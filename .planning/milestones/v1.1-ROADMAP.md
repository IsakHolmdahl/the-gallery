# Roadmap: Art Gallery

## Milestones

- ✅ **v1.0 Art Gallery** — Phases 1-2 (shipped 2026-04-13)
- 🚧 **v1.1 Polish & Refinements** — Phases 3-4 (current)

---

## Phases

- [ ] **Phase 3: Gallery Display & Stability** — Fix crash bug and upgrade to landscape frame with configurable sizing
- [ ] **Phase 4: Audio Experience** — Background music with fade effects and mute control

## Phase Details

### Phase 3: Gallery Display & Stability
**Goal**: Artwork displays reliably in a polished landscape frame that fills more of the viewport
**Depends on**: Nothing (v1.0 complete)
**Requirements**: BUG-01, DISP-01, DISP-02
**Success Criteria** (what must be TRUE):
  1. User can generate multiple artworks in succession without the app crashing
  2. Artwork frame displays in 16:9 landscape aspect ratio
  3. Artwork display is noticeably larger and fills more of the viewport
  4. Artwork size is configurable via `ARTWORK_SIZE` environment variable
**Plans**: 1 plan

Plans:
- [x] 03-01-PLAN.md — Fix crash bug, upgrade to landscape 16:9 frame with configurable sizing

**UI hint**: yes

### Phase 4: Audio Experience
**Goal**: Artwork reveal is accompanied by looping background music with smooth fade transitions and user mute control
**Depends on**: Phase 3
**Requirements**: AUD-01, AUD-02, AUD-03, AUD-04
**Success Criteria** (what must be TRUE):
  1. Background music starts playing and loops when artwork is revealed
  2. Music fades in smoothly over approximately 1 second when it starts
  3. Music fades out smoothly over approximately 1 second when user clicks "Create Another"
  4. Mute button is visible in the bottom corner while music is playing
  5. User can toggle mute on and off at any time while music is active
**Plans**: TBD
**UI hint**: yes

## Progress

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 3. Gallery Display & Stability | 0/1 | Ready to execute | - |
| 4. Audio Experience | 0/0 | Not started | - |

---

*For v1.0 milestone details, see .planning/milestones/v1.0-ROADMAP.md*
*For v1.0 requirements history, see .planning/milestones/v1.0-REQUIREMENTS.md*
