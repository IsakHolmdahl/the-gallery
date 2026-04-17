# Research Summary: v1.2 Image Upload & Lecture

**Date:** 2026-04-17
**Milestone:** v1.2 Image Upload & Lecture

## Stack Additions
- None — existing stack sufficient. Zero new npm packages required.
- OpenAI vision integration uses the same `openai.chat.completions.create()` endpoint already in use — just a different message format with `image_url` content blocks.
- All drag-and-drop and file reading handled by native browser APIs (Drag and Drop API, FileReader). No `react-dropzone` or similar.

## Feature Table Stakes
- **Drag-over visual indicator (plus icon + border glow)**: Low complexity — CSS state on prompt-form.tsx wrapper div
- **File type + size validation (client-side)**: Low complexity — check `file.type` and `file.size` before processing; cap at 3MB raw (4.5MB Vercel body limit)
- **Click-to-upload fallback**: Low complexity — hidden `<input type="file" accept="image/*">` triggered by textarea click
- **Image preview with remove button**: Medium complexity — `URL.createObjectURL()` for instant preview, revoke on remove
- **New server action `createArtFromImage`**: Medium complexity — vision-based script gen + same ElevenLabs voice pipeline; skip DALL-E entirely
- **"Create Another" resets image state**: Low complexity — revoke object URL, clear `droppedImage`, reset drag counter

## Feature Differentiators
- **Smooth drag-enter/leave animation** (amber/stone border glow matching gallery aesthetic): Low complexity — CSS transitions
- **Aspect-ratio-aware miniature frame in preview**: Medium complexity — reuse art-display frame CSS classes in preview state

## Architecture Changes
- **`prompt-form.tsx` — Major changes**: Add `droppedImage` state, `isDragging` state, drag counter ref, drop zone wrapper div, conditional rendering (textarea OR preview), dual submit paths (text vs image). This is the primary interaction surface.
- **`actions.ts` — Add `createArtFromImage`**: Separate server action (Option A) that receives base64 image + mimeType, calls OpenAI vision (gpt-4o with `detail: "high"`), then ElevenLabs TTS. Returns same shape as `createArt`. Optionally extract `generateVoice()` helper shared by both paths.
- **`env.ts` — Optional**: Add `OPENAI_VISION_MODEL` env var falling back to `OPENAI_SCRIPT_MODEL`. Can defer — reuse existing for now.
- **`art-display.tsx` — No changes**: Already accepts `imageUrl` prop; works identically for AI-generated and user-uploaded images.
- **`gallery-content.tsx` — No changes**: `onArtworkStateChange` and background music hooks unaffected.

## Build Order
1. **Server action first** — Add `createArtFromImage` to `actions.ts`. Test with hardcoded base64 image to validate vision API + voice pipeline end-to-end before touching UI.
2. **Image state + preview** — Add `droppedImage` state to `prompt-form.tsx`, hidden file input, click-to-upload, preview rendering, remove button, wire submit to new action. Test end-to-end with click flow.
3. **Drag-and-drop** — Add drag event handlers with counter pattern, `isDragging` state, visual indicator (plus icon overlay, border glow), file validation on drop. Handle edge cases (multiple files, non-image, text drag).
4. **Polish + edge cases** — Error messages, animated GIF rejection, "Create Another" reset, memory management (revoke URLs), body size limit enforcement, loading messages.

## Watch Out For
- **Vercel server action body size (4.5MB limit)**: Base64 inflates ~33%. Cap at 3MB raw client-side, show clear error for oversized images. Fallback: migrate to API route with `bodyParser: { sizeLimit: '10mb' }` if needed later.
- **Drag-enter/leave flicker on child elements**: Use `useRef` counter pattern — increment on `dragEnter`, decrement on `dragLeave`, only set `isDragging = false` when counter hits 0.
- **Object URL memory leaks**: Always call `URL.revokeObjectURL()` on remove, reset, and unmount cleanup. Don't revoke on re-render.
- **Mutually exclusive modes**: Either text prompt OR image, never both. Dropping an image clears/overrides text. Simplifies state and avoids confusing UX.
- **Animated GIF rejection**: OpenAI doesn't support animated GIFs. Either reject all GIFs ("Use PNG or JPEG") or detect animation — simpler to reject GIFs entirely.

## Key Decisions Needed
- **Image size cap**: 3MB raw (safe for Vercel 4.5MB limit) vs. higher with API route migration. Recommend starting at 3MB — covers most phone photos compressed.
- **Vision model config**: Reuse `OPENAI_SCRIPT_MODEL` (gpt-4o) for vision vs. add separate `OPENAI_VISION_MODEL` env var. Recommend reusing — skip the env var for v1.2.
- **GIF handling**: Accept static GIFs only vs. reject all GIFs. Recommend reject all GIFs — simpler, show "Use PNG or JPEG instead".
- **Detail level**: `detail: "high"` for richer art analysis vs. `detail: "auto"`. Recommend `"high"` — costs more tokens but produces better docent narration; acceptable for single-use ephemeral experience.
