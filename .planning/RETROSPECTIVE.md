# Retrospective: Art Gallery

Living retrospective — updated per milestone.

---

## Milestone: v1.2 — Image Upload & Lecture

**Shipped:** 2026-04-20
**Phases:** 3 | **Plans:** 3 | **Quick Tasks:** 3

### What Was Built

- Vision server action with OpenAI vision API integration (`detail: "high"`)
- Drag-and-drop image upload with drop zone overlay and amber/stone glow animation
- Image preview in miniature museum-style frame
- Counter-based drag detection eliminating flicker
- Client-side Canvas API compression for Vercel free tier compatibility
- Upload limit increased to 10MB with server body size config
- 1-second voice delay for natural reveal timing

### What Worked

- Research-first approach for Phase 5 (vision pipeline) — identified correct API patterns before planning
- TDD for file validation (tests first, then implementation)
- Quick tasks for post-execution fixes (size limit, compression, voice delay) — kept main phases clean
- Canvas API for compression avoided new dependencies

### What Was Inefficient

- Requirements traceability table wasn't updated during execution — had to verify via verification docs at milestone end
- Volume range bug in background music hook could have been caught with linting

### Patterns Established

- Counter-based drag detection pattern (dragCounter > 0) over boolean isDragging
- Quick tasks for ad-hoc fixes separate from planned phases
- `COMPRESSION_THRESHOLD` constant pattern for conditional processing

### Key Lessons

- Verification docs are more reliable than manual checklists for requirements tracking
- Vercel free tier limits need proactive handling — don't assume body limits will just work
- Canvas API compression is powerful enough for most client-side image processing needs

---

## Milestone: v1.1 — Polish & Refinements

**Shipped:** 2026-04-15
**Phases:** 2 | **Plans:** 1

### What Was Built

- Fixed crash-on-second-generation (useActionState → useState+useTransition)
- 16:9 landscape artwork frame
- Configurable display size via ARTWORK_SIZE env var
- Background music with fade in/out and mute toggle

### What Worked

- Custom hook pattern (useBackgroundMusic) for clean separation
- State lifting to parent for cross-component mute control

---

## Milestone: v1.0 — Art Gallery

**Shipped:** 2026-04-13
**Phases:** 2 | **Plans:** 2

### What Was Built

- Gallery page with elegant museum-quality visual design
- Sequential AI generation pipeline (image → script → voice)
- ArtDisplay component with decorative amber frame
- Audio autoplay with fallback "Play Narration" button
- "Create Another" reset flow

### What Worked

- shadcn components for consistent, clean design
- Sequential pipeline ensures script describes actual generated image

---

## Cross-Milestone Trends

| Metric | v1.0 | v1.1 | v1.2 |
|--------|------|------|------|
| Phases | 2 | 2 | 3 |
| Plans | 2 | 1 | 3 |
| Requirements | 16 | 7 | 14 |
| Quick tasks | 0 | 0 | 3 |
| Duration | ~1 day | ~1 day | ~3 days |

---

*Last updated: 2026-04-20 after v1.2 milestone*
