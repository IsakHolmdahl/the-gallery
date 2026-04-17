# Roadmap: Art Gallery

## Milestones

- ✅ **v1.0 Art Gallery** - Phases 1-2 (shipped 2026-04-13)
- ✅ **v1.1 Polish & Refinements** - Phases 3-4 (shipped 2026-04-15)
- 🚧 **v1.2 Image Upload & Lecture** - Phases 5-7 (in progress)

## Phases

<details>
<summary>✅ v1.0 Art Gallery (Phases 1-2) - SHIPPED 2026-04-13</summary>

### Phase 1: Foundation
**Goal**: Core gallery experience with AI generation pipeline
**Plans**: 2 plans

Plans:
- [x] 01-01: Project setup + gallery layout
- [x] 01-02: AI generation pipeline (image → script → voice)

### Phase 2: Display & Interaction
**Goal**: Elegant artwork display with create-another flow
**Plans**: 1 plan

Plans:
- [x] 02-01: ArtDisplay component + reset flow

</details>

<details>
<summary>✅ v1.1 Polish & Refinements (Phases 3-4) - SHIPPED 2026-04-15</summary>

### Phase 3: Gallery Display & Stability
**Goal**: Second generation works reliably, artwork frame is landscape
**Plans**: 1 plan

Plans:
- [x] 03-01: Fix crash-on-second-generation + 16:9 frame + configurable size

### Phase 4: Audio Experience
**Goal**: Background music plays alongside narration with mute control
**Plans**: N/A (quick task)

</details>

### 🚧 v1.2 Image Upload & Lecture (In Progress)

**Milestone Goal:** Let visitors drop their own image into the gallery and get a docent narration, skipping the AI image generation step.

#### Phase 5: Vision Pipeline
**Goal**: Server can generate docent narration from an uploaded image, with voice synthesis
**Depends on**: Phase 4
**Requirements**: VISN-01, VISN-02, VISN-03, VISN-04, VISN-06
**Success Criteria** (what must be TRUE):
  1. A new server action generates a docent script from a user-provided image using the OpenAI vision model
  2. The dropped image is base64-encoded on the client and sent to the server action
  3. Voice narration is generated using the existing ElevenLabs pipeline after the vision script
  4. The dropped image displays in the full-size elegant frame, identical to AI-generated images
  5. Vision model uses `detail: "high"` for richer, more specific art analysis
**Plans**: 1 plan

Plans:
- [ ] 05-01: Vision server action (createArtFromImage with validation)

#### Phase 6: Upload Interface
**Goal**: Users can upload images via drag-and-drop or click, see a preview, and submit for narration
**Depends on**: Phase 5
**Requirements**: DROP-01, DROP-02, DROP-03, DROP-04, PREV-01, PREV-02, PREV-03, VISN-05
**Success Criteria** (what must be TRUE):
  1. Dragging an image over the text field shows a plus icon with amber/stone border glow
  2. Only PNG, JPEG, and WEBP files are accepted; other types show a friendly error
  3. Images over 3MB are rejected with a clear message explaining the limit
  4. User can click the text field area to open a file picker for click-to-upload
  5. Dropped image displays as a preview in a miniature museum-style frame, replacing the text field
  6. Remove button (X) clears the preview and returns to text prompt mode
  7. "Create Another" resets image state — revokes object URL, clears preview, returns to text prompt
**Plans**: 1 plan

Plans:
- [x] 06-01: Upload interface (drop zone, preview, dynamic button, mode switching)

**UI hint**: yes

#### Phase 7: Polish & Edge Cases
**Goal**: Upload flow handles edge cases gracefully and feels polished
**Depends on**: Phase 6
**Requirements**: DROP-05
**Success Criteria** (what must be TRUE):
  1. Drag-enter/leave does not flicker when moving over child elements within the drop zone
  2. Object URLs are always revoked on remove, reset, and component unmount — no memory leaks
  3. Non-image drag payloads (text, links) are ignored without triggering the drop zone
  4. Error states for vision generation or voice synthesis show friendly messages allowing retry
**Plans**: 1 plan

Plans:
- [x] 07-01: Drag flicker fix, non-image filter, error retry, glow animation
**UI hint**: yes

## Progress

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1. Foundation | v1.0 | 2/2 | Complete | 2026-04-13 |
| 2. Display & Interaction | v1.0 | 1/1 | Complete | 2026-04-13 |
| 3. Gallery Display & Stability | v1.1 | 1/1 | Complete | 2026-04-15 |
| 4. Audio Experience | v1.1 | N/A | Complete | 2026-04-15 |
| 5. Vision Pipeline | v1.2 | 0/1 | Ready to execute | - |
| 6. Upload Interface | v1.2 | 1/1 | Complete | 2026-04-17 |
| 7. Polish & Edge Cases | v1.2 | 1/1 | Complete   | 2026-04-17 |

---

*For v1.0 milestone details, see .planning/milestones/v1.0-ROADMAP.md*
*For v1.1 milestone details, see .planning/milestones/v1.1-ROADMAP.md*
