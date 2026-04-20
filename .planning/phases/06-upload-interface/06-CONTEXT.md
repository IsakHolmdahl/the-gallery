# Phase 6: Upload Interface - Context

**Gathered:** 2026-04-17
**Status:** Ready for planning

<domain>
## Phase Boundary

Build the upload interface UI — drag-and-drop zone, image preview in a museum-style frame, and submission to the vision pipeline. This phase covers all user-facing upload interactions; server-side vision processing is handled by Phase 5's `createArtFromImage` action.

</domain>

<decisions>
## Implementation Decisions

### Drop Zone Integration
- **D-01:** Drop zone overlays the textarea — when user drags an image over the form, the textarea is covered by the drop zone with visual feedback. When not dragging, the textarea remains visible and functional.

### Preview Frame Style
- **D-02:** Simplified gallery frame — preview uses a lighter version with border/shadow styling, matching the gallery aesthetic (stone/amber tones) without the ornate details of the full ArtDisplay frame.

### Submission Flow
- **D-03:** Same "Create Art" button — button text dynamically changes to "Analyze art" when an image is present. Single button handles both text-to-art and image-to-narration flows.

### Text ↔ Image Mode Switching
- **D-04:** X button only — clicking the X button on the preview clears the image and returns to text prompt mode. No toggle tabs or separate mode switcher.

### the agent's Discretion
- Drop zone visual feedback (amber/stone border glow animation) — implementer decides exact animation timing and easing
- Preview frame dimensions — implementer decides sizing relative to the form container
- Error message positioning — implementer decides where format/size errors appear

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### UI & Styling
- `src/components/prompt-form.tsx` — Current form component that will be modified; contains textarea, button, and loading state patterns
- `src/components/gallery-content.tsx` — Parent container with gallery frame styling and layout
- `src/components/art-display.tsx` — Reference for museum frame aesthetic (simplified version for preview)
- `src/components/ui/textarea.tsx` — Textarea component being overlaid by drop zone
- `src/components/ui/button.tsx` — Button component with existing styling patterns

### Server Actions
- `src/app/actions.ts` — Contains `createArtFromImage` server action (Phase 5) that will be called on submission

### Design System
- `src/components/ui/button.tsx` — Stone-900 primary button, rounded-xl, tracking-wide
- `src/components/ui/textarea.tsx` — Stone-300 border, rounded-xl, focus:stone-500

No external specs — requirements fully captured in decisions above

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `Textarea` component: Will be overlaid by drop zone, not replaced
- `Button` component: Text will dynamically change based on image state
- `Spinner` component: Reuse for loading state during vision pipeline
- `MUSEUM_MESSAGES` array: Reuse rotating messages during processing

### Established Patterns
- Stone/amber color palette throughout (stone-900, stone-300, stone-500, amber tones)
- Rounded-xl border radius on interactive elements
- `useTransition` for async form submission
- `FormData` pattern for server action calls
- Form reset via `formKey` state increment

### Integration Points
- `prompt-form.tsx`: Main modification point — add drop zone overlay, preview state, dynamic button text
- `gallery-content.tsx`: No changes needed — already wraps PromptForm with gallery frame
- `createArtFromImage`: Server action called instead of `createArt` when image is present

</code_context>

<specifics>
## Specific Ideas

- Drop zone should show a plus icon with amber/stone border glow when dragging (per DROP-01)
- Preview should be in a "miniature museum-style frame" (per PREV-03) — simplified version of ArtDisplay
- Button text changes: "Create Art" → "Analyze art" when image is present
- X button clears preview and returns to text mode (per PREV-02)
- Only PNG, JPEG, WEBP accepted (per DROP-02) — server validates, but client shows friendly error
- Images over 3MB rejected with clear message (per DROP-03)

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 06-upload-interface*
*Context gathered: 2026-04-17*
