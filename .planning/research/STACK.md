# Stack Research: Image Upload & Lecture

**Date:** 2026-04-17
**Milestone:** v1.2 Image Upload & Lecture

## New Dependencies Needed

**None.** Zero new npm packages required. The feature uses existing `openai` SDK (v6.34+) and built-in browser APIs.

## Existing Stack Changes

### Server Action (`actions.ts`)
- **Change:** Add new server action (e.g., `describeArt`) that accepts base64 image data instead of DALL-E generation
- **Reason:** Image upload bypasses DALL-E entirely — user provides the image, only script + voice are generated
- **Integration:** Shares same OpenAI client instance, ElevenLabs client, `collectStream` helper

### Environment Config (`lib/env.ts`)
- **Change:** Add optional `OPENAI_VISION_MODEL` env var (default: reuse `OPENAI_SCRIPT_MODEL` which is `gpt-4o`)
- **Reason:** gpt-4o already supports vision; separate config allows model evolution without code changes
- **Note:** This is optional — can just reuse `OPENAI_SCRIPT_MODEL` if you want zero env changes

### Prompt Form (`prompt-form.tsx`)
- **Change:** Add drag-and-drop zone over/around the textarea, file input fallback, image preview state
- **Reason:** Core UI change — textarea becomes drop target

## Browser API Requirements

### Drag and Drop (Native)
- **APIs needed:** `dragenter`, `dragover`, `dragleave`, `drop` events on DOM elements
- **Browser compatibility:** All modern browsers (Chrome, Firefox, Safari, Edge) — fully supported since ~2012
- **No library needed:** React event handlers map directly to these DOM events
- **Key detail:** Must call `e.preventDefault()` on `dragover` and `drop` to prevent browser default (opening file)

### File Reading (Native)
- **APIs needed:** `FileReader` with `readAsDataURL()` for base64 conversion
- **Browser compatibility:** Universal — all browsers support FileReader
- **Alternative:** `URL.createObjectURL()` for instant local preview (no base64 needed for display)
- **Recommended approach:** Use `URL.createObjectURL(file)` for instant preview, `FileReader.readAsDataURL(file)` only when sending to server

### Image Validation (Native)
- **Approach:** Check `file.type` against allowed MIME types: `image/png`, `image/jpeg`, `image/gif`, `image/webp`
- **Size limit:** Validate client-side (e.g., 20MB max — OpenAI supports up to 20MB per image)
- **No library needed:** Simple type/size checks before processing

## OpenAI Vision Integration

### API Approach
- **Endpoint:** `openai.chat.completions.create()` — same endpoint already used for script generation
- **Model:** `gpt-4o` (already configured as `OPENAI_SCRIPT_MODEL`) — natively supports vision
- **Content format:** Multimodal content array with `image_url` type
- **Image data:** Send as `data:image/png;base64,{base64string}` data URL

### Message Structure
```typescript
{
  model: env.OPENAI_SCRIPT_MODEL, // gpt-4o
  messages: [
    { role: "system", content: DOCENT_SYSTEM_PROMPT },
    {
      role: "user",
      content: [
        {
          type: "text",
          text: "Describe this artwork for gallery visitors."
        },
        {
          type: "image_url",
          image_url: {
            url: `data:${mimeType};base64,${base64Image}`,
            detail: "high"  // Use high detail for art analysis
          }
        }
      ]
    }
  ],
  max_completion_tokens: 500
}
```

### Detail Level Decision
- **Recommendation:** `detail: "high"` — art analysis requires visual detail (brushwork, composition, color)
- **Cost:** Higher token usage than `low`, but for 30-second experiences this is acceptable
- **Alternative:** `detail: "auto"` lets the model decide (simpler, slightly unpredictable)

### Cost Considerations
- Vision with `high` detail: ~85-1700+ tokens per image depending on size
- Script generation tokens: ~500 max_completion_tokens
- **Net effect:** Vision script call costs ~2-5x more than text-only script call
- **Mitigation:** Not needed — single-user ephemeral experience, not batch processing

## New Server Action Pattern

### `describeArt` (new function in `actions.ts`)
```typescript
export async function describeArt(
  formData: FormData
): Promise<{
  success: boolean;
  audioBase64?: string;
  script?: string;
  error?: string;
}> {
  const imageBase64 = formData.get("image") as string;
  const mimeType = formData.get("mimeType") as string;

  // Validate
  if (!imageBase64) return { success: false, error: "No image provided." };

  // Step 1: Generate script from image (vision)
  const scriptResponse = await openai.chat.completions.create({
    model: env.OPENAI_SCRIPT_MODEL,
    messages: [
      { role: "system", content: DOCENT_SYSTEM_PROMPT },
      {
        role: "user",
        content: [
          { type: "text", text: "Describe this artwork for gallery visitors." },
          {
            type: "image_url",
            image_url: {
              url: `data:${mimeType};base64,${imageBase64}`,
              detail: "high",
            },
          },
        ],
      },
    ],
    max_completion_tokens: 500,
  });
  const script = scriptResponse.choices[0].message.content;

  // Step 2: Generate voice (same as existing)
  const audioStream = await elevenlabs.textToSpeech.stream(
    env.ELEVEN_LABS_VOICE_ID,
    {
      text: script,
      modelId: "eleven_multilingual_v2",
      outputFormat: "mp3_44100_128",
    }
  );
  const audioBase64 = await collectStream(audioStream);

  return { success: true, audioBase64, script };
}
```

### Key difference from `createArt`
- **Skips:** `openai.images.generate()` — no DALL-E call
- **Changes:** Script generation uses multimodal content array instead of text prompt
- **Returns:** No `imageUrl` (user's image is displayed client-side via `URL.createObjectURL`)
- **Reuses:** Same ElevenLabs voice pipeline, same `collectStream` helper

## What NOT to Add

| Avoid | Why |
|-------|-----|
| `react-dropzone` | 6KB+ dependency for what's ~30 lines of native event handlers. Overkill. |
| `sharp` / image processing libs | Server-side image manipulation not needed — send base64 directly to OpenAI |
| File upload API routes | No storage needed — base64 in FormData works fine for ephemeral experience |
| `multer` / `formidable` | Next.js FormData handling already built in |
| Image cropping/editing | Out of scope — user drops image, gets narration |
| Multiple image support | Single image per experience matches current single-prompt flow |
| Progress bars for upload | Image is read client-side and sent as base64 — no separate upload step |

## Integration Points

### Data Flow
```
[Browser]
  User drops image
  → FileReader.readAsDataURL() or URL.createObjectURL()
  → Show preview in same textarea area
  → User clicks "Describe Artwork" button
  → FormData with base64 image + mimeType
  → Server Action: describeArt()
    → OpenAI chat.completions.create() with vision
    → ElevenLabs TTS (same as existing)
  → Return script + audioBase64
  → ArtDisplay component (reused as-is — shows image in frame + plays audio)
```

### Component Changes
1. **`prompt-form.tsx`** — Add drop zone state, image preview, dual submit paths (text vs image)
2. **`actions.ts`** — Add `describeArt` function
3. **`lib/env.ts`** — Optional: add `OPENAI_VISION_MODEL` (can reuse existing)
4. **`.env.example`** — Optional: document new env var

### Reusable As-Is
- `art-display.tsx` — Already handles `imageUrl` + `audioBase64` + `script`
- `gallery-content.tsx` — Wraps form, no changes needed
- `use-background-music.ts` — Audio fades, mute button — all work unchanged
- ElevenLabs pipeline — Identical TTS flow

## Summary

| Category | Count | Notes |
|----------|-------|-------|
| New npm deps | **0** | Browser APIs + existing `openai` SDK sufficient |
| Existing deps to update | **0** | `openai` v6.34+ already supports vision |
| New server actions | **1** | `describeArt` |
| Modified components | **1** | `prompt-form.tsx` |
| Optional env vars | **1** | `OPENAI_VISION_MODEL` (can default to existing) |
| Risk level | **LOW** | All components are built-in browser APIs or existing stack |

## Sources

- OpenAI Vision Guide: https://developers.openai.com/api/docs/guides/images-vision
- OpenAI Node SDK (vision): https://github.com/openai/openai-node/blob/master/api.md (multimodal content)
- Browser Drag and Drop API: MDN Web Docs (universal browser support)
- FileReader API: MDN Web Docs (universal browser support)
- Existing codebase: `actions.ts`, `prompt-form.tsx`, `art-display.tsx`, `package.json`

**Confidence:** HIGH — All findings verified against OpenAI official docs and existing codebase. No new dependencies needed. Browser APIs are universal. Vision API is well-documented and uses the same chat.completions endpoint already in use.
