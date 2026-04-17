# Feature Research: Image Upload & Lecture

**Date:** 2026-04-17
**Milestone:** v1.2 Image Upload & Lecture

## Feature Categories

### Drag & Drop Upload

#### Table Stakes
- **Drag-over visual indicator on textarea**: When user drags an image over the prompt field, show a plus icon overlay and change border to indicate drop target — Complexity: Low
  - Depends on: prompt-form.tsx textarea element
  - Uses HTML5 `onDragEnter`/`onDragLeave`/`onDragOver`/`onDrop` events on the textarea wrapper
  - The plus icon should replace or overlay the placeholder text
- **File type validation (client-side)**: Accept only PNG, JPEG, WEBP, GIF (non-animated) — matching OpenAI's supported formats — Complexity: Low
  - Depends on: none (pure client check)
  - Check `file.type` against allowlist: `image/png`, `image/jpeg`, `image/webp`, `image/gif`
  - Show friendly error if wrong type dropped
- **File size validation**: Warn/reject images over ~20MB (OpenAI limit) — Complexity: Low
  - Depends on: none (pure client check)
  - Practical limit: consider capping at 10MB to avoid slow base64 encoding and large FormData payloads
- **Click-to-upload fallback**: A clickable area or file input so users without drag-and-drop can also upload — Complexity: Low
  - Depends on: prompt-form.tsx
  - Hidden `<input type="file" accept="image/*">` triggered by clicking the textarea area
  - Standard UX: most drag-and-drop zones also support click

#### Differentiators
- **Smooth drag-enter/leave animation**: Subtle border glow or background tint when dragging over — Complexity: Low
  - Depends on: CSS transitions in prompt-form.tsx
  - Matches gallery aesthetic — warm amber or stone highlight

#### Anti-Features (avoid)
- **Multi-file upload gallery**: Out of scope — single image only, ephemeral experience
- **Image cropping/resizing UI**: Over-engineering — send full image, let OpenAI handle it
- **Camera capture on mobile**: Desktop-first experience per constraints
- **Image editing/filters**: Breaks the "curator, not artist" metaphor

### Image Preview

#### Table Stakes
- **Preview after drop**: Show the dropped image in place of the textarea, sized to fit the form width — Complexity: Medium
  - Depends on: prompt-form.tsx state management
  - Use `URL.createObjectURL(file)` for instant preview (no base64 roundtrip)
  - Maintain aspect ratio, max height ~200px to keep form compact
- **Remove/reset button**: Small × or "Remove" link to clear the dropped image and return to text prompt mode — Complexity: Low
  - Depends on: preview state in prompt-form.tsx
  - Revoke object URL on remove to free memory
- **Image filename or visual confirmation**: Show subtle indicator that image is loaded (filename text or check icon) — Complexity: Low
  - Depends on: preview state
- **Disable textarea when image is loaded**: Mutually exclusive — either text prompt OR image, not both — Complexity: Low
  - Depends on: prompt-form.tsx conditional rendering
  - The textarea becomes the preview area when image is present

#### Differentiators
- **Aspect-ratio-aware preview frame**: Show the image in a miniature version of the gold museum frame during preview — Complexity: Medium
  - Depends on: art-display.tsx frame styles (reuse CSS classes)
  - Reinforces the gallery metaphor even in preview state

### Vision-Based Script Generation

#### Table Stakes
- **New server action for image-based creation**: `createArtFromImage(formData)` that receives the image file, sends it to OpenAI vision model, generates script, then voice — Complexity: Medium
  - Depends on: actions.ts (extend or add parallel action)
  - Skip DALL-E step entirely — the user's image IS the artwork
  - Send image as base64 data URL in `image_url` content block to chat completions
  - Use `gpt-4o` or configurable `OPENAI_SCRIPT_MODEL` with vision capability
- **Base64 encoding of dropped image**: Convert File to base64 on client before sending to server action — Complexity: Low
  - Depends on: prompt-form.tsx
  - FileReader API or `file.arrayBuffer()` → `Buffer.toString('base64')`
  - Needed because FormData with File in Next.js server actions has body size constraints
- **Docent prompt adaptation for vision**: Modify the DOCENT_SYSTEM_PROMPT to work with image input — the user message changes from `Describe this artwork: ${prompt}` to the image_url content block — Complexity: Low
  - Depends on: actions.ts
  - Same system prompt works — "Write a formal docent narration that introduces and explains an artwork"
  - User message becomes the image itself (no text description needed)
- **Same voice pipeline**: Reuse existing Eleven Labs integration unchanged — Complexity: Low
  - Depends on: actions.ts (already abstracted)
- **Same display pipeline**: Dropped image displays in the same ArtDisplay component with the gold frame — Complexity: Low
  - Depends on: art-display.tsx (already accepts `imageUrl` prop)
  - Works as-is: pass the dropped image's data URL as `imageUrl`

#### Differentiators
- **Configurable vision model**: Add `OPENAI_VISION_MODEL` env var (falls back to `OPENAI_SCRIPT_MODEL`) — Complexity: Low
  - Depends on: env.ts
  - Allows using a different model for vision vs text-only script generation
- **Detail level "high" for image analysis**: Use `detail: "high"` in the image_url block for richer docent narration — Complexity: Low
  - Depends on: actions.ts
  - Costs more tokens but produces better, more specific descriptions

## Edge Cases

| Edge Case | Handling |
|-----------|----------|
| **User drops non-image file** | Client-side type check → show error toast "Please drop an image file (PNG, JPEG, WEBP, or GIF)" |
| **User drops very large image (>20MB)** | Client-side size check → show error "Image too large. Please use an image under 20MB" |
| **User drops image AND types text** | Mutually exclusive — dropping an image clears/overrides the text. If text exists, warn "Image will replace your text prompt" |
| **Animated GIF dropped** | OpenAI doesn't support animated GIFs. Accept only static GIFs or reject all GIFs and show "Use PNG or JPEG instead" (simpler) |
| **Image fails to load in preview** | Show error state with remove button, allow retry |
| **OpenAI vision API timeout** | Same error handling as current flow — "Generation failed: [message]" with retry |
| **OpenAI rejects image (NSFW, watermark)** | Catch API error → show "This image couldn't be processed. Please try a different image" |
| **User drags text/URL instead of file** | `e.dataTransfer.files` will be empty → ignore drag, don't show indicator |
| **Multiple files dropped at once** | Take `files[0]` only, ignore rest. Optionally show "Using first image only" |
| **Drop zone fires on child elements** | Use `onDragEnter`/`onDragLeave` with counter pattern to avoid flicker from child enter/leave events |
| **Browser doesn't support drag-and-drop** | Click-to-upload fallback always available |
| **Object URL revoked prematurely** | Only revoke on explicit remove, not on re-render |
| **Server action body size limit (Vercel: 4.5MB)** | Base64 encoding inflates ~33%, so practical image limit is ~3MB raw. Either: (a) compress client-side, (b) use API route instead of server action, or (c) accept the limit and show clear error |

## Dependencies on Existing Features

| Existing Feature | How It's Affected |
|-----------------|-------------------|
| **prompt-form.tsx** | Major changes: add drag-drop handlers, image state, preview rendering, conditional action dispatch (text vs image path) |
| **actions.ts** | Add new `createArtFromImage` function alongside existing `createArt`. Shared voice generation code can be extracted. |
| **art-display.tsx** | No changes needed — already accepts `imageUrl` and renders it in the frame. Works for both AI-generated and user-uploaded images. |
| **gallery-content.tsx** | Minor: `onArtworkStateChange` callback already handles the container width transition. No changes expected. |
| **Background music** | No changes — music triggers on `isArtworkShowing`, which works the same regardless of image source. |
| **Museum loading messages** | Reuse existing rotating messages for the image path — still takes 15-30s for script + voice. |
| **"Create Another" flow** | Must also clear image state (revoke object URL, reset file input). Currently only resets form key. |
| **env.ts** | Add optional `OPENAI_VISION_MODEL` env var. |
| **1MB body limit fix (v1.1)** | Relevant! Base64 images can be large. The 1MB fix was for response bodies; request bodies have different limits. Need to verify server action payload limits. |

## Complexity Summary

| Feature | Complexity | Dependencies |
|---------|-----------|--------------|
| Drag-over visual indicator (plus icon) | Low | prompt-form.tsx |
| File type validation | Low | None |
| File size validation | Low | None |
| Click-to-upload fallback | Low | prompt-form.tsx |
| Image preview with remove | Medium | prompt-form.tsx state |
| Disable textarea when image loaded | Low | prompt-form.tsx |
| New server action for vision | Medium | actions.ts, env.ts |
| Base64 client-side encoding | Low | prompt-form.tsx |
| Docent prompt for vision | Low | actions.ts |
| Reuse display pipeline | Low | art-display.tsx (no changes) |
| Configurable vision model | Low | env.ts |
| "Create Another" clears image state | Low | prompt-form.tsx |

## Recommendations

### Build Order
1. **Server action first** (`createArtFromImage`) — test the vision pipeline end-to-end with a hardcoded image before touching the UI. This validates the core API integration.
2. **Image state + preview** — add image handling to prompt-form.tsx with click-to-upload, then preview rendering.
3. **Drag-and-drop** — add drag events and visual indicators on top of the working image state.
4. **Polish** — animations, error messages, edge case handling.

### Key Technical Decisions

- **Use server action, not API route**: The existing `createArt` is a server action. Keep `createArtFromImage` as a server action for consistency. The body size concern (4.5MB on Vercel) is acceptable — most images under 3MB raw (~4MB base64) will fit. Show clear error for oversized images.
- **Base64 encoding on client**: Convert File → base64 in the browser before calling the server action. This avoids FormData complexity and keeps the action signature simple (receives a string, not a File).
- **Mutually exclusive modes**: The UI should make it clear: EITHER type a prompt OR drop an image. Don't allow both. This simplifies state management and avoids confusing UX ("does my text matter if I dropped an image?").
- **Reuse ArtDisplay unchanged**: The dropped image is just another `imageUrl`. No need to distinguish "AI-generated" vs "user-uploaded" in the display component.
- **Skip the env var for now**: Use `OPENAI_SCRIPT_MODEL` for vision too. Most modern GPT-4o+ models support vision. Only add `OPENAI_VISION_MODEL` if we need a different model for vision. Keep it simple for v1.2.

### Risk: Body Size on Vercel

This is the biggest technical risk. Vercel serverless functions have a 4.5MB request body limit. Base64 encoding adds ~33% overhead. A 3MB JPEG becomes ~4MB base64, which is at the edge. Options:
- **Accept the limit**: Cap client-side at 3MB raw, show clear error. Covers most phone photos (compressed).
- **Use API route instead**: `/api/create-from-image` with `bodyParser: { sizeLimit: '10mb' }` in Next.js config. More complex but higher limit.
- **Recommendation**: Start with the 3MB cap. Most uploaded images will be well under this. If it becomes a problem, migrate to API route.

## Sources

- OpenAI Vision docs: https://platform.openai.com/docs/guides/vision (verified 2026-04-17)
- OpenAI vision input requirements: PNG, JPEG, WEBP, non-animated GIF; up to 20MB per image; base64 or URL
- Existing codebase: actions.ts, prompt-form.tsx, art-display.tsx, gallery-content.tsx (read 2026-04-17)
- HTML5 Drag and Drop API: standard browser API, well-supported in all modern desktop browsers
- Next.js server actions: body size limited by deployment platform (Vercel: 4.5MB serverless)
