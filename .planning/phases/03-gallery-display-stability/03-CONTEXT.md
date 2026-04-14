# Phase 3: Gallery Display & Stability - Context

**Gathered:** 2026-04-13
**Status:** Ready for planning

<domain>
## Phase Boundary

Fix crash bug on second image generation and upgrade artwork display to landscape 16:9 frame with configurable sizing. This phase addresses stability (BUG-01) and visual refinement (DISP-01, DISP-02) only — audio features are Phase 4.

</domain>

<decisions>
## Implementation Decisions

### Image Generation
- **D-01:** Generate landscape images using DALL-E 3's 1792x1024 size option — no cropping
- **D-02:** Update `createArt` server action to use `size: "1792x1024"` instead of `"1024x1024"`

### Frame Sizing
- **D-03:** Artwork frame uses 16:9 aspect ratio via CSS (enforced on the image container)
- **D-04:** `ARTWORK_SIZE` env var controls viewport width percentage as a number (e.g., `70` = 70vw)
- **D-05:** Default `ARTWORK_SIZE` to `70` if not set (70% of viewport width)
- **D-06:** Add `ARTWORK_SIZE` to env schema in `src/lib/env.ts` with zod default

### Bug Fix (1MB Body Limit)
- **D-07:** Root cause: `useActionState` serializes previous response state (including base64 audio) back to server on each submission
- **D-08:** Replace `useActionState` with `useState` for response data + `useTransition` for pending state
- **D-09:** Clear all state on reset — no previous submission data carries forward
- **D-10:** Server action signature changes from `useActionState` pattern to simple async function called via `startTransition`

### the agent's Discretion
- Exact CSS implementation for 16:9 aspect ratio enforcement
- How to handle responsive sizing alongside ARTWORK_SIZE
- Error handling improvements if any arise during implementation

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Current Implementation
- `src/components/art-display.tsx` — Frame component, amber gradient, current image sizing
- `src/components/prompt-form.tsx` — Form with `useActionState`, state management, reset logic
- `src/app/actions.ts` — Server action with image generation (1024x1024), base64 audio return
- `src/lib/env.ts` — Environment variable schema with zod validation

### Configuration
- `next.config.js` — Next.js config (no body size limit currently set)
- `.env` — Environment variables (OPENAI_API_KEY, ELEVEN_LABS_API_KEY, etc.)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `ArtDisplay` component: Frame styling can be modified in place — amber gradient stays, sizing changes
- `Textarea` + `Button` from shadcn: Reusable for any UI additions
- `env` schema pattern: Easy to add new env vars following existing zod pattern

### Established Patterns
- Server actions with `"use server"` directive
- Zod schema validation for environment variables
- shadcn component library for UI
- Tailwind CSS for styling

### Integration Points
- `createArt` server action: Change image size parameter
- `prompt-form.tsx`: Replace `useActionState` with `useState` + `useTransition`
- `art-display.tsx`: Update frame sizing and aspect ratio
- `env.ts`: Add `ARTWORK_SIZE` to schema

</code_context>

<specifics>
## Specific Ideas

- Image must be generated landscape from the start — no post-processing crop
- ARTWORK_SIZE is a simple number representing viewport width percentage
- Default of 70% leaves breathing room around the artwork
- Bug fix: move away from `useActionState` entirely for this use case since we don't need previous state

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope. Audio features (background music, fade, mute) are Phase 4.

</deferred>

---

*Phase: 03-gallery-display-stability*
*Context gathered: 2026-04-13*
