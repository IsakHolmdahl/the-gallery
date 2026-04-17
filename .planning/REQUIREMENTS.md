# Requirements: Art Gallery

**Defined:** 2026-04-17
**Core Value:** A meditative, gallery-like experience where AI-generated art feels curated and meaningful, not random.

## v1.2 Requirements

Requirements for the Image Upload & Lecture milestone. Each maps to roadmap phases.

### Drag & Drop Upload

- [ ] **DROP-01**: Plus icon and border glow appear on text field when user drags an image over it
- [ ] **DROP-02**: Only PNG, JPEG, and WEBP files are accepted; other types show a friendly error
- [ ] **DROP-03**: Images over 3MB are rejected with a clear message explaining the limit
- [ ] **DROP-04**: User can click the text field area to open a file picker (click-to-upload fallback)
- [x] **DROP-05**: Drag indicator has smooth amber/stone border glow animation matching gallery aesthetic

### Image Preview

- [ ] **PREV-01**: Dropped image displays as a preview replacing the text field
- [ ] **PREV-02**: Remove button (X) clears the preview and returns to text prompt mode
- [ ] **PREV-03**: Preview image is displayed in a miniature museum-style frame

### Vision Script Generation

- [ ] **VISN-01**: New `createArtFromImage` server action generates docent script from dropped image using OpenAI vision model
- [ ] **VISN-02**: Dropped image is base64-encoded on client before sending to server action
- [ ] **VISN-03**: Voice narration generates using the same ElevenLabs pipeline after vision script
- [ ] **VISN-04**: Dropped image displays in the full-size elegant frame (same as AI-generated images)
- [ ] **VISN-05**: "Create Another" resets image state — revokes object URL, clears preview, returns to text prompt
- [ ] **VISN-06**: Vision model uses `detail: "high"` for richer, more specific docent narration

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

- **IMG-01**: Configurable vision model via `OPENAI_VISION_MODEL` env var
- **IMG-02**: Support for animated GIFs (static frames extracted)
- **IMG-03**: Client-side image compression before upload
- **IMG-04**: Camera capture on mobile

## Out of Scope

| Feature | Reason |
|---------|--------|
| Multi-file upload gallery | Single image only — ephemeral experience |
| Image cropping/resizing UI | Over-engineering — send full image, let OpenAI handle it |
| Image editing/filters | Breaks the "curator, not artist" metaphor |
| Camera capture | Desktop-first experience per constraints |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| DROP-01 | Phase 6 | Pending |
| DROP-02 | Phase 6 | Pending |
| DROP-03 | Phase 6 | Pending |
| DROP-04 | Phase 6 | Pending |
| DROP-05 | Phase 7 | Complete |
| PREV-01 | Phase 6 | Pending |
| PREV-02 | Phase 6 | Pending |
| PREV-03 | Phase 6 | Pending |
| VISN-01 | Phase 5 | Pending |
| VISN-02 | Phase 5 | Pending |
| VISN-03 | Phase 5 | Pending |
| VISN-04 | Phase 5 | Pending |
| VISN-05 | Phase 6 | Pending |
| VISN-06 | Phase 5 | Pending |

**Coverage:**
- v1.2 requirements: 14 total
- Mapped to phases: 14
- Unmapped: 0 ✓

---
*Requirements defined: 2026-04-17*
*Last updated: 2026-04-17 after initial definition*
