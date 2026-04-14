# Phase 3: Gallery Display & Stability - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-13
**Phase:** 03-gallery-display-stability
**Areas discussed:** Image size, Frame sizing, Bug fix approach

---

## Image Size

| Option | Description | Selected |
|--------|-------------|----------|
| Landscape (1792x1024) | Generate landscape images natively via DALL-E 3 | ✓ |
| Keep square (1024x1024) | Keep current square generation, crop to 16:9 | |

**User's choice:** Generate landscape images, no cropping
**Notes:** User explicitly said "no cropping" — image must be generated in landscape format from the start

---

## Frame Sizing

| Option | Description | Selected |
|--------|-------------|----------|
| Percentage of viewport | ARTWORK_SIZE is a number like "70" meaning 70vw | ✓ |
| Max width in pixels | ARTWORK_SIZE is pixel value like "800" meaning 800px max | |
| CSS value | ARTWORK_SIZE is raw CSS like "70vw" | |

**User's choice:** Percentage of viewport
**Notes:** Default 70% — "70 sounds good"

---

## Bug Fix Approach

| Option | Description | Selected |
|--------|-------------|----------|
| Agent's discretion | User said "you figure out the bug" | ✓ |

**Analysis:** Root cause is `useActionState` serializing previous response state (including large base64 audio) back to server on each submission. Fix: replace with `useState` + `useTransition`, clear all state on reset.

**User's clarification:** "The audio is not needed on the second submission. No data from previous submissions are needed in the new ones." — Confirms that clearing state completely on reset is the right approach.

---

## the agent's Discretion

- Exact CSS implementation for 16:9 aspect ratio
- Responsive sizing alongside ARTWORK_SIZE
- Error handling improvements

---

*Phase: 03-gallery-display-stability*
*Context gathered: 2026-04-13*
