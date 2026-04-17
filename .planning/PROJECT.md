# Art Gallery - AI Image Experience

## What This Is

A web experience where visitors curate AI-generated artwork for exhibition. Enter a text prompt or drop your own image, and watch as it appears in a museum-worthy frame, accompanied by a formal museum docent's narration explaining the piece. The visitor plays the role of gallery curator, selecting works for display, while an AI art expert provides context and commentary. Ephemeral and intentional—each creation exists only in the moment.

## Core Value

A meditative, gallery-like experience where AI-generated art feels curated and meaningful, not random.

## Current Milestone: v1.2 Image Upload & Lecture

**Goal:** Let visitors drop their own image into the gallery and get a docent narration, skipping the AI image generation step.

**Target features:**
- Drag-and-drop image upload replacing the text prompt
- Visual drag indicator (plus icon) on text field when hovering an image
- Image preview window after drop with remove option
- Script + voice generation based on the dropped image (vision model)
- Dropped image displays in the same elegant frame

## Requirements

### Validated

#### v1.0

- ✓ Visitor can enter a text prompt describing desired artwork — v1.0
- ✓ "Create Art" button activates only when prompt field has content — v1.0
- ✓ Formal museum-style loading messages appear during generation — v1.0
- ✓ AI-generated image appears in an elegant frame upon completion — v1.0
- ✓ Museum docent voiceover script is generated explaining the artwork — v1.0
- ✓ Voice narration plays automatically when artwork is revealed — v1.0
- ✓ Clean, light gallery aesthetic with shadcn components — v1.0
- ✓ Error states display friendly message allowing retry — v1.0

#### v1.1 Polish & Refinements

- ✓ Artwork frame displays in 16:9 landscape aspect ratio — v1.1
- ✓ Artwork display size is larger and configurable via `ARTWORK_SIZE` env var — v1.1
- ✓ Background music (`background_music.mp3`) plays and loops when artwork is revealed — v1.1
- ✓ Background music fades in over 1 second on artwork reveal — v1.1
- ✓ Background music fades out over 1 second when "Create Another" is pressed — v1.1
- ✓ Mute button appears in bottom corner while music is playing — v1.1
- ✓ Second image generation no longer crashes (1MB body limit fixed) — v1.1

### Active

<!-- v1.2 Image Upload & Lecture — see REQUIREMENTS.md for full details -->

### Out of Scope

- User accounts or authentication
- Saving or sharing generated artwork
- Social features or comments
- Multiple image display or gallery navigation
- User-customizable frames or themes
- Mobile-optimized experience (desktop-first)

## Context

**Technical Environment:**
- Next.js application with TypeScript
- shadcn UI components for clean, consistent design
- Light color scheme evoking gallery/museum spaces
- OpenAI API for image generation and script generation
- Eleven Labs API for voice synthesis
- HTML5 Audio API for background music with fade effects

**Current State:**
- v1.0 shipped on 2026-04-13
- v1.1 shipped on 2026-04-15
- Phases 3-4 completed (display stability + audio experience)
- All 15 requirements satisfied across v1.0 and v1.1
- Starting v1.2: Image Upload & Lecture

## Constraints

- **API Dependencies**: Requires OpenAI API key and Eleven Labs API key in `.env`
- **Model Configuration**: OpenAI image and script models configurable via env vars
- **Generation Time**: AI image + script + voice can take 15-30 seconds
- **No Persistence**: All artwork is ephemeral—no storage, no history
- **Desktop Experience**: Focus on desktop browser experience

## Key Decisions

### v1.0 Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| No user accounts | Simplicity; gallery is atmosphere, not social | ✓ Shipped v1.0 |
| Ephemeral experience | Art exists in the moment; creates intentionality | ✓ Shipped v1.0 |
| Visitor as curator | User prompts, but AI is the "artist"—creates docent dynamic | ✓ Shipped v1.0 |
| Fancy frame around image | Visual anchor, museum authenticity | ✓ Shipped v1.0 |
| Formal docent narration | Elevates AI output; museum context | ✓ Shipped v1.0 |
| shadcn + light theme | Clean, gallery-white aesthetic | ✓ Shipped v1.0 |
| OpenAI for image + script | Configurable models via env vars | ✓ Shipped v1.0 |
| Eleven Labs for voice | TTS with formal docent voice | ✓ Shipped v1.0 |
| Sequential pipeline | Script describes actual generated image | ✓ Shipped v1.0 |

### v1.1 Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| useBackgroundMusic custom hook | Clean separation of audio logic from UI | ✓ Working |
| State lifted to gallery-content.tsx | Enables parent-level mute button | ✓ Working |
| Conditional container width | Artwork needs 70vw, form needs max-w-xl | ✓ Working |
| Background music + narration coexist | Both audio sources can play simultaneously | ✓ Working |
| Autoplay handled gracefully | Browser restrictions respected with mute fallback | ✓ Working |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---

*Last updated: 2026-04-17 after v1.2 milestone kickoff*
