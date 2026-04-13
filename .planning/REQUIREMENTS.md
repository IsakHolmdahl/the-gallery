# Requirements: Art Gallery

**Defined:** 2025-04-10
**Core Value:** A meditative, gallery-like experience where AI-generated art feels curated and meaningful, not random.

## v1 Requirements

### Core Flow

- [ ] **CORE-01**: Visitor can enter a text prompt describing desired artwork
- [ ] **CORE-02**: "Create Art" button is disabled until prompt field has content
- [ ] **CORE-03**: Loading animation displays during generation with formal museum-style messages
- [ ] **CORE-04**: OpenAI GPT-Image generates an image based on the prompt
- [ ] **CORE-05**: OpenAI GPT generates a museum docent voiceover script explaining the artwork
- [ ] **CORE-06**: Eleven Labs TTS converts the script to voice narration
- [ ] **CORE-07**: AI-generated image appears in an elegant frame upon completion
- [ ] **CORE-08**: Voice narration plays automatically when artwork is revealed

### UI/UX

- [ ] **UI-01**: Clean, light gallery aesthetic using shadcn components
- [ ] **UI-02**: Fancy decorative frame around generated image
- [ ] **UI-03**: Error states display friendly message with retry option
- [ ] **UI-04**: Loading messages maintain formal museum tone ("Creation in Progress, Perfection Pending, Paint drying...")

### Technical

- [ ] **TECH-01**: OpenAI API integration for image generation (model configurable via env var)
- [ ] **TECH-02**: OpenAI API integration for script generation (GPT model configurable via env var)
- [ ] **TECH-03**: Eleven Labs API integration for TTS voice generation
- [ ] **TECH-04**: Environment variable setup for API keys and model selection:
  - `OPENAI_API_KEY` - OpenAI API key
  - `OPENAI_IMAGE_MODEL` - Model for image generation (e.g., dall-e-3, gpt-image-1)
  - `OPENAI_SCRIPT_MODEL` - Model for script generation (e.g., gpt-4o, gpt-4o-mini)
  - `ELEVEN_LABS_API_KEY` - Eleven Labs API key
  - `ELEVEN_LABS_VOICE_ID` - Voice ID for docent narration

## v2 Requirements

(None yet)

## Out of Scope

| Feature | Reason |
|---------|--------|
| User accounts | Simplicity; gallery is atmosphere, not social |
| Saving/sharing artwork | Ephemeral by design |
| Gallery navigation | Single artwork at a time |
| Mobile optimization | Desktop-first experience |
| Custom frame styles | Single elegant frame design |
| Multiple voice options | One formal docent voice |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| CORE-01 | Phase 1 | Pending |
| CORE-02 | Phase 1 | Pending |
| CORE-03 | Phase 1 | Pending |
| CORE-04 | Phase 2 | Pending |
| CORE-05 | Phase 2 | Pending |
| CORE-06 | Phase 2 | Pending |
| CORE-07 | Phase 2 | Pending |
| CORE-08 | Phase 2 | Pending |
| UI-01 | Phase 1 | Pending |
| UI-02 | Phase 2 | Pending |
| UI-03 | Phase 2 | Pending |
| UI-04 | Phase 1 | Pending |
| TECH-01 | Phase 2 | Pending |
| TECH-02 | Phase 2 | Pending |
| TECH-03 | Phase 2 | Pending |
| TECH-04 | Phase 1 | Pending |

**Coverage:**
- v1 requirements: 16 total
- Mapped to phases: 16
- Unmapped: 0 ✓

---
*Requirements defined: 2025-04-10*
*Last updated: 2025-04-10 after roadmap creation*
