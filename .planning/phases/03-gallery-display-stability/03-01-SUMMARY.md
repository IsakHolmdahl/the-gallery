---
phase: 03-gallery-display-stability
plan: "01"
subsystem: ui
tags: [nextjs, react, openai, dall-e, zod, tailwind]

# Dependency graph
requires: []
provides:
  - ARTWORK_SIZE env var with configurable viewport width
  - 16:9 landscape artwork display
  - Crash-free multi-generation flow (useActionState replaced with useState+useTransition)
affects:
  - Phase 04 (audio experience) — stable frame and state management as foundation

# Tech tracking
tech-stack:
  added: []
  patterns:
    - useState + useTransition for server action calls (replacing useActionState)
    - zod coerce.number() for numeric env vars
    - Inline style for dynamic viewport-width sizing (Tailwind can't use dynamic classes)

key-files:
  created: []
  modified:
    - src/lib/env.ts — Added ARTWORK_SIZE env var
    - src/app/actions.ts — Removed prevState param, changed image size to 1792x1024
    - src/components/prompt-form.tsx — Replaced useActionState with useState+useTransition
    - src/components/art-display.tsx — 16:9 aspect ratio frame with configurable width
    - .env.example — Documented ARTWORK_SIZE=70

key-decisions:
  - "Replaced useActionState with useState+useTransition to fix 1MB body limit crash on second generation"
  - "Used inline style for dynamic ARTWORK_SIZE width since Tailwind cannot use runtime values"
  - "import env directly in client component rather than passing as prop (Next.js injects env at build time)"

patterns-established:
  - "Server action pattern: simple async function (formData) with useTransition on client"

requirements-completed: [BUG-01, DISP-01, DISP-02]

# Metrics
duration: 5min
completed: 2026-04-14
---

# Phase 03 Plan 01: Gallery Display & Stability Summary

**Fixed crash-on-second-generation by replacing useActionState with useState+useTransition, upgraded to 16:9 landscape artwork frame with configurable viewport width via ARTWORK_SIZE env var**

## Performance

- **Duration:** 5 min
- **Started:** 2026-04-14T11:21:12Z
- **Completed:** 2026-04-14T11:26:00Z
- **Tasks:** 3
- **Files modified:** 5

## Accomplishments
- ARTWORK_SIZE env var with zod coerce.number() defaulting to 70, documented in .env.example
- Fixed crash bug: useActionState serialized base64 audio back to server, exceeding Vercel's 1MB body limit on second generation — replaced with useState + useTransition
- Artwork frame now displays in 16:9 landscape aspect ratio with configurable viewport width (default 70vw)

## Task Commits

1. **Task 1: Add ARTWORK_SIZE to env schema** - `6acf3bf` (feat)
2. **Task 2: Fix crash bug — replace useActionState with useState+useTransition** - `eac433e` (fix)
3. **Task 3: Update frame to 16:9 aspect ratio with configurable viewport width** - `267e7f0` (feat)

**Plan metadata:** pending (docs: complete plan)

## Files Created/Modified
- `src/lib/env.ts` — Added ARTWORK_SIZE with zod coerce.number() defaulting to 70
- `src/app/actions.ts` — Removed prevState param, changed image size from 1024x1024 to 1792x1024
- `src/components/prompt-form.tsx` — Replaced useActionState with useState+useTransition, added handleSubmit, state clear on reset
- `src/components/art-display.tsx` — 16:9 aspect ratio via aspect-video class, configurable width via ARTWORK_SIZE env var, overflow-hidden on mat
- `.env.example` — Documented ARTWORK_SIZE=70

## Decisions Made
- Replaced useActionState with useState+useTransition: root cause was useActionState serializing previous response (including ~800KB base64 audio) back to server on each submission, exceeding Vercel's 1MB body limit
- Used inline style for ARTWORK_SIZE width rather than dynamic Tailwind classes (not possible with Tailwind's JIT)
- Imported env directly in art-display client component (Next.js injects server env at build time)

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None - all tasks completed cleanly. `npm run build` passes, TypeScript compiles without errors.

## Next Phase Readiness
- Stable multi-generation flow ready for Phase 4 (audio experience)
- 16:9 frame ready for background music and mute button integration

---

*Phase: 03-gallery-display-stability*
*Completed: 2026-04-14*

## Self-Check: PASSED

All 5 files exist on disk. All 3 commit hashes verified in git log.
