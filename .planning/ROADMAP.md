# Roadmap: Art Gallery

**Granularity:** coarse
**Phases:** 2

## Phases

- [ ] **Phase 1: Foundation & Input** - Prompt interface, loading states, gallery aesthetic
- [ ] **Phase 2: Generation & Display** - AI image/script/voice pipeline, framed display, playback

---

## Phase Details

### Phase 1: Foundation & Input

**Goal:** Visitor can enter a prompt and see elegant loading states in a gallery setting

**Depends on:** Nothing (first phase)

**Requirements:** CORE-01, CORE-02, CORE-03, UI-01, UI-04, TECH-04

**Success Criteria** (what must be TRUE):
1. Visitor can type a text prompt describing desired artwork
2. "Create Art" button is visually disabled until prompt field has content
3. Loading animation displays with formal museum-style messages (e.g., "Creation in Progress, Perfection Pending, Paint drying...") while AI generates artwork
4. Gallery displays clean, light aesthetic using shadcn components
5. API keys and model configuration are loaded from environment variables

**Plans:** 1 plan

Plans:
- [x] 01-01-PLAN.md — Foundation: prompt form, loading states, gallery aesthetic

---

### Phase 2: Generation & Display

**Goal:** AI generates artwork, displays in frame with docent narration

**Depends on:** Phase 1

**Requirements:** CORE-04, CORE-05, CORE-06, CORE-07, CORE-08, UI-02, UI-03, TECH-01, TECH-02, TECH-03

**Success Criteria** (what must be TRUE):
1. OpenAI GPT-Image generates an image based on the visitor's prompt
2. OpenAI GPT generates a formal museum docent script explaining the artwork
3. Eleven Labs TTS converts the script to voice narration
4. Generated image appears in an elegant decorative frame
5. Voice narration plays automatically when artwork is revealed
6. Error states display friendly message with retry option

**Plans:** TBD

---

## Progress

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation & Input | 1/1 | Planned | - |
| 2. Generation & Display | 0/1 | Not started | - |

---

*Last updated: 2025-04-10 after roadmap creation*
