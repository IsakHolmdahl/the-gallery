# Architecture Research: Image Upload & Lecture

**Date:** 2026-04-17
**Milestone:** v1.2 Image Upload & Lecture
**Confidence:** HIGH

## Integration Points

### Existing Components to Modify

| Component | Changes | Why |
|-----------|---------|-----|
| `prompt-form.tsx` | Major: add drag-drop zone, image state, preview, conditional dispatch (text vs image) | This is the primary interaction surface. All new UX flows through here. |
| `actions.ts` | Add `createArtFromImage` server action; extract shared voice generation | Vision pipeline reuses voice synth but replaces image gen + script gen with vision-based script gen. |
| `env.ts` | Add optional `OPENAI_VISION_MODEL` env var (fall back to `OPENAI_SCRIPT_MODEL`) | Allows using a vision-specialized model without changing code. Low priority — can defer. |

### Components NOT Modified

| Component | Reason |
|-----------|--------|
| `art-display.tsx` | Already accepts `imageUrl` as a prop — works identically for AI-generated and user-uploaded images. No changes needed. |
| `gallery-content.tsx` | `onArtworkStateChange` already handles container width transition. Background music hooks unaffected. |
| `use-background-music.ts` | Music triggers on `isArtworkShowing`, which works regardless of image source. |
| `page.tsx` | Just passes `artworkSize` to `GalleryContent`. No changes. |

### New Components Needed

None required. All new functionality fits within `prompt-form.tsx` (drag-drop zone, preview) and `actions.ts` (vision action). This is intentional — keeps the component tree shallow and avoids premature abstraction.

**Possible future extraction:** If drag-drop logic grows complex (>100 lines), extract a `useImageDrop` custom hook. Not needed for v1.2.

## Data Flow Changes

### Current Flow (text prompt)
```
User types prompt → clicks "Create Art"
  → FormData sent to createArt(server action)
    → Step 1: openai.images.generate (DALL-E) → imageUrl
    → Step 2: openai.chat.completions (script from prompt text) → script
    → Step 3: elevenlabs.textToSpeech.stream → audioBase64
  → { imageUrl, script, audioBase64 } returned
  → ArtDisplay renders with gold frame
```

### New Flow (dropped image)
```
User drops image → preview shown in place of textarea → clicks "Create Art"
  → Client: File → base64 string (via FileReader/arrayBuffer)
  → base64 sent to createArtFromImage(server action)
    → Step 1: openai.chat.completions.create with image_url content block → script
      (uses vision model, not DALL-E)
    → Step 2: elevenlabs.textToSpeech.stream → audioBase64
      (identical to current)
  → { imageUrl: dataURL, script, audioBase64 } returned
  → ArtDisplay renders with gold frame (same component)
```

### Pipeline Modifications

**Key change:** The pipeline becomes 2 steps instead of 3 for the image path.

| Step | Text Prompt Path | Image Upload Path |
|------|-----------------|-------------------|
| 1 | Generate image (DALL-E, ~10s) | **SKIP** — user provides image |
| 2 | Generate script from text prompt (GPT-4o, ~3s) | Generate script from image via vision (GPT-4o, ~5s) |
| 3 | Generate voice (ElevenLabs, ~3s) | Generate voice (ElevenLabs, ~3s) |

The image upload path is potentially faster (no DALL-E wait) but script generation may be slightly slower due to image token processing.

## Server-Side Considerations

### Image Handling Strategy

**Approach:** Client-side base64 encoding, passed directly to server action as a string parameter.

```
Client                          Server Action
──────                          ─────────────
File object                     Receives: { imageBase64, mimeType }
  ↓                                    ↓
FileReader.readAsDataURL()      Format as data URL: `data:${mimeType};base64,${imageBase64}`
  ↓                                    ↓
"data:image/jpeg;base64,..."    Pass to openai.chat.completions.create()
  ↓                                    ↓
Server action call              image_url.content = { url: dataUrl }
```

**Why base64 on client (not FormData with File):**
- Next.js server actions serialize FormData with specific constraints
- Base64 string is a simple parameter — predictable serialization
- Client can enforce size limits before encoding (reject >3MB raw → ~4MB base64)
- Avoids FormData boundary parsing edge cases

### Size Constraints

| Platform | Server Action Body Limit | Practical Image Limit |
|----------|------------------------|----------------------|
| Vercel serverless | 4.5MB | ~3MB raw (~4MB base64) |
| Local dev | No hard limit | Accept any size |
| Self-hosted | Configurable | Configurable |

**Recommendation:** Cap client-side at **3MB raw**. This covers:
- Most phone photos (compressed JPEG ~2-5MB, but easily compressed to <3MB)
- Screenshots and web images (typically <1MB)
- Camera photos can be resized/compressed client-side if needed

### OpenAI Vision API Integration

**Endpoint:** `openai.chat.completions.create()` — same as current script generation, different message format.

**Current script generation (text-only):**
```typescript
{
  model: env.OPENAI_SCRIPT_MODEL,  // gpt-4o
  messages: [
    { role: "system", content: DOCENT_SYSTEM_PROMPT },
    { role: "user", content: `Describe this artwork: ${prompt}` }
  ]
}
```

**New vision-based script generation:**
```typescript
{
  model: env.OPENAI_SCRIPT_MODEL,  // gpt-4o (supports vision)
  messages: [
    { role: "system", content: DOCENT_SYSTEM_PROMPT },
    {
      role: "user",
      content: [
        { type: "text", text: "Describe this artwork for a museum docent narration:" },
        {
          type: "image_url",
          image_url: {
            url: `data:${mimeType};base64,${imageBase64}`,
            detail: "high"  // Higher detail for richer descriptions
          }
        }
      ]
    }
  ],
  max_completion_tokens: 500
}
```

**Image format requirements (from OpenAI docs, verified 2026-04-17):**
- Supported: PNG, JPEG, WEBP, non-animated GIF
- Max size: 20MB per image (but we cap at 3MB for transport)
- `detail: "high"` for richer analysis (costs more tokens but better narration)

### System Prompt Reuse

The existing `DOCENT_SYSTEM_PROMPT` works for vision without modification:
> "You are the distinguished curator of a renowned art museum. Write a formal docent narration..."

It's about how to DESCRIBE art — works whether the input is a text description or an actual image. No prompt changes needed.

### Server Action Design

**Option A: Separate action (recommended)**
```typescript
// actions.ts

export async function createArtFromImage(formData: FormData): Promise<{
  success: boolean;
  imageUrl?: string;
  audioBase64?: string;
  script?: string;
  error?: string;
}>
```

- Receives `imageBase64` and `mimeType` from FormData
- Returns same shape as `createArt` — client handles identically
- Clear separation of concerns (text path vs image path)

**Option B: Unified action with mode parameter**
```typescript
export async function createArt(formData: FormData): Promise<{...}>
// Checks if "imageBase64" present → vision path, else → text path
```

**Why Option A:** Simpler to test, easier to reason about, no conditional branching in one function. The two paths share only the voice generation step, which can be extracted into a helper if needed.

### Extracted Helper (optional)
```typescript
async function generateVoice(script: string): Promise<string> {
  const audioStream = await elevenlabs.textToSpeech.stream(
    env.ELEVEN_LABS_VOICE_ID,
    { text: script, modelId: "eleven_multilingual_v2", outputFormat: "mp3_44100_128" }
  );
  return collectStream(audioStream);
}
```

## Component Architecture

### Drop Zone Integration in prompt-form.tsx

**State additions:**
```typescript
const [droppedImage, setDroppedImage] = useState<{
  file: File;
  previewUrl: string;  // URL.createObjectURL(file)
} | null>(null);
const [isDragging, setIsDragging] = useState(false);
```

**Drop zone placement:**
```
form
├── div (wrapper with drag events)
│   ├── IF droppedImage: img preview + remove button
│   ├── ELSE: Textarea (existing)
│   └── IF isDragging: overlay with + icon
├── error message (existing)
├── submit button (existing)
└── loading state (existing)
```

**Drag events on wrapper div:**
- `onDragEnter`: set `isDragging = true`, increment counter
- `onDragLeave`: decrement counter, set `isDragging = false` when counter = 0
- `onDragOver`: `e.preventDefault()` (required to allow drop)
- `onDrop`: `e.preventDefault()`, validate file, set `droppedImage`

**Counter pattern for dragEnter/Leave:**
```typescript
const dragCounter = useRef(0);

const handleDragEnter = (e: React.DragEvent) => {
  e.preventDefault();
  dragCounter.current++;
  if (dragCounter.current === 1) setIsDragging(true);
};

const handleDragLeave = (e: React.DragEvent) => {
  e.preventDefault();
  dragCounter.current--;
  if (dragCounter.current === 0) setIsDragging(false);
};
```

This prevents flicker when dragging over child elements (textarea, placeholder text).

### Submit Logic Changes

```typescript
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();

  if (droppedImage) {
    // Image path: encode to base64, call createArtFromImage
    const formData = new FormData();
    // ... encode and add imageBase64, mimeType
    startTransition(async () => {
      const result = await createArtFromImage(formData);
      setState(result);
    });
  } else {
    // Text path: existing behavior
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await createArt(formData);
      setState(result);
    });
  }
};
```

### Preview Component (inline in prompt-form.tsx)

```tsx
{droppedImage ? (
  <div className="relative group">
    <img
      src={droppedImage.previewUrl}
      alt="Dropped image preview"
      className="w-full max-h-[200px] object-contain rounded-xl border border-stone-300"
    />
    <button
      type="button"
      onClick={handleRemoveImage}
      className="absolute top-2 right-2 p-1 bg-white/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
    >
      <X className="h-4 w-4 text-stone-600" />
    </button>
  </div>
) : (
  <Textarea ... />
)}
```

**Memory management:** Revoke object URL on remove:
```typescript
const handleRemoveImage = () => {
  if (droppedImage?.previewUrl) {
    URL.revokeObjectURL(droppedImage.previewUrl);
  }
  setDroppedImage(null);
};
```

### "Create Another" Reset

The existing `onReset` callback must also clear image state:
```typescript
onReset={() => {
  if (droppedImage?.previewUrl) {
    URL.revokeObjectURL(droppedImage.previewUrl);
  }
  setDroppedImage(null);
  setIsDragging(false);
  dragCounter.current = 0;
  // ... existing reset logic
}}
```

### Client-Side Base64 Encoding

```typescript
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Strip "data:image/jpeg;base64," prefix — send raw base64
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
```

Or using arrayBuffer (slightly more control):
```typescript
async function fileToBase64(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  return btoa(String.fromCharCode(...new Uint8Array(buffer)));
}
```

**Recommendation:** Use `FileReader.readAsDataURL` — simpler, well-tested, handles all image types.

## Build Order

### Phase 1: Server Action (test vision pipeline)
**Goal:** Validate OpenAI vision API integration before touching UI.

1. Add `createArtFromImage` to `actions.ts`
2. Test with a hardcoded base64 image (e.g., a test JPEG)
3. Verify script generation works with image input
4. Verify voice generation works with resulting script
5. Test error handling (invalid image, API errors)

**No UI changes.** Use a test script or Postman to call the action directly.

### Phase 2: Image State + Preview
**Goal:** Get image selection working in the form (click-to-upload first).

1. Add `droppedImage` state to `prompt-form.tsx`
2. Add hidden file input (`<input type="file" accept="image/*">`)
3. Add click handler on textarea area to trigger file input
4. Show preview image when file selected (replace textarea)
5. Add remove button to clear image
6. Wire submit to call `createArtFromImage` when image present
7. Test end-to-end: click → preview → submit → display

**Still no drag-and-drop.** Click-to-upload is the foundation.

### Phase 3: Drag-and-Drop
**Goal:** Add drag-and-drop on top of working image state.

1. Add drag event handlers (enter/leave/over/drop) with counter pattern
2. Add `isDragging` state
3. Add drag-over visual indicator (plus icon overlay, border glow)
4. Add file type + size validation on drop
5. Handle edge cases: multiple files, non-image files, text drag

### Phase 4: Polish + Edge Cases
**Goal:** Production-ready quality.

1. Smooth drag-enter/leave animations (CSS transitions)
2. Error messages for invalid files (type, size)
3. Animated GIF detection and rejection
4. "Create Another" properly resets image state
5. Memory management (revoke object URLs)
6. Test body size limits with large images
7. Loading messages still work for image path

## Risks

### Risk 1: Server Action Body Size (MEDIUM)
**What:** Vercel serverless 4.5MB body limit. Base64 adds ~33% overhead.
**Impact:** Large images (>3MB raw) will fail to send.
**Mitigation:** Cap at 3MB client-side. Show clear error. Most images are under this.
**Fallback:** Migrate to API route with configurable body limit if needed later.

### Risk 2: Vision Model Quality (LOW)
**What:** The docent narration quality depends on the vision model's understanding of the image.
**Impact:** Generic or inaccurate descriptions.
**Mitigation:** Use `detail: "high"` for richer analysis. Test with diverse images. Adjust system prompt if needed.
**Confidence:** HIGH — `gpt-4o` vision is mature and well-documented.

### Risk 3: Drag-and-Drop Browser Compatibility (LOW)
**What:** HTML5 drag-and-drop works on all modern desktop browsers.
**Impact:** Negligible — desktop-first per constraints. Click fallback always available.
**Mitigation:** Click-to-upload works everywhere. Drag-and-drop is enhancement.

### Risk 4: Object URL Memory Leaks (LOW)
**What:** Forgetting to revoke `URL.createObjectURL()` leaks memory.
**Impact:** Accumulated memory use over multiple "Create Another" cycles.
**Mitigation:** Always revoke on remove/reset. Revoke in cleanup on unmount.

### Risk 5: Base64 Encoding Performance (LOW)
**What:** Large images (10MB+) could take noticeable time to encode.
**Impact:** Brief UI freeze during encoding.
**Mitigation:** Size cap at 3MB eliminates this. Encoding is synchronous but fast for small files.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      prompt-form.tsx                        │
│                                                             │
│  ┌─────────────────┐     ┌──────────────────────────────┐   │
│  │  Text Path       │     │  Image Path (NEW)            │   │
│  │                  │     │                              │   │
│  │  Textarea ───────┤     │  Drop Zone ──── Preview      │   │
│  │       │          │     │       │              │       │   │
│  │       ▼          │     │       ▼              ▼       │   │
│  │  FormData        │     │  File → base64    Remove     │   │
│  │  (prompt text)   │     │  FormData          btn       │   │
│  └────────┬─────────┘     └────────┬───────────────────┘   │
│           │                        │                        │
│           ▼                        ▼                        │
│  ┌────────────────┐     ┌────────────────────┐             │
│  │ createArt()    │     │ createArtFromImage()│             │
│  └────────┬───────┘     └────────┬───────────┘             │
│           │                      │                          │
└───────────┼──────────────────────┼──────────────────────────┘
            │                      │
            ▼                      ▼
┌──────────────────────┐  ┌──────────────────────────┐
│ Server: actions.ts   │  │ Server: actions.ts       │
│                      │  │                          │
│ 1. images.generate   │  │ 1. chat.completions      │
│    (DALL-E)          │  │    (vision → script)     │
│ 2. chat.completions  │  │    image_url content     │
│    (text → script)   │  │                          │
│ 3. tts.stream        │  │ 2. tts.stream            │
│    (voice)           │  │    (voice)               │
└──────────┬───────────┘  └──────────┬───────────────┘
           │                         │
           ▼                         ▼
       Same response shape: { success, imageUrl, audioBase64, script }
           │                         │
           └────────────┬────────────┘
                        ▼
              ┌──────────────────┐
              │  ArtDisplay      │
              │  (unchanged)     │
              │  Gold frame +    │
              │  audio player    │
              └──────────────────┘
```

## Sources

- OpenAI Vision API docs: https://platform.openai.com/docs/guides/vision (verified 2026-04-17)
- OpenAI Node SDK: `openai` v6.34.0 (from package.json)
- Existing codebase: `actions.ts`, `prompt-form.tsx`, `art-display.tsx`, `gallery-content.tsx`
- Feature research: `.planning/research/FEATURES.md` (comprehensive edge case analysis)
- HTML5 Drag and Drop API: standard browser API
- FileReader API: standard browser API for base64 encoding
