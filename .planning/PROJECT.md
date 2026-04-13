# Art Gallery - AI Image Experience

## What This Is

A web experience where visitors curate AI-generated artwork for exhibition. Enter a text prompt, and watch as an image materializes in a museum-worthy frame, accompanied by a formal museum docent's narration explaining the piece. The visitor plays the role of gallery curator, selecting works for display, while an AI art expert provides context and commentary. Ephemeral and intentional—each creation exists only in the moment.

## Core Value

A meditative, gallery-like experience where AI-generated art feels curated and meaningful, not random.

## Requirements

### Validated (v1.0)

- ✓ Visitor can enter a text prompt describing desired artwork — v1.0
- ✓ "Create Art" button activates only when prompt field has content — v1.0
- ✓ Formal museum-style loading messages appear during generation — v1.0
- ✓ AI-generated image appears in an elegant frame upon completion — v1.0
- ✓ Museum docent voiceover script is generated explaining the artwork — v1.0
- ✓ Voice narration plays automatically when artwork is revealed — v1.0
- ✓ Clean, light gallery aesthetic with shadcn components — v1.0
- ✓ Error states display friendly message allowing retry — v1.0

### Current Milestone: v1.1 Polish & Refinements

**Goal:** Refine the gallery experience with landscape display, background music, and fix a crash bug on repeat generations.

**Target features:**
- Frame & image in 16:9 landscape aspect ratio
- Larger artwork display (size configurable via `ARTWORK_SIZE` env var)
- Background music (`background_music.mp3`) plays on artwork reveal
- Music loops with 1-second fade in
- Music fades out (1s) when "Create Another" is pressed
- Mute button appears in bottom corner while music plays
- Fix: crash on second image generation (1MB body limit error)

### Active

- [ ] Artwork frame displays in 16:9 landscape aspect ratio
- [ ] Artwork display size is larger and configurable via environment variable
- [ ] Background music plays and loops when artwork is revealed
- [ ] Background music fades in over 1 second on artwork reveal
- [ ] Background music fades out over 1 second when "Create Another" is pressed
- [ ] Mute button appears in bottom corner while music is playing
- [ ] Second image generation no longer crashes (1MB body limit fixed)

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

**Shipped:** v1.0 on 2026-04-13

## Constraints

- **API Dependencies**: Requires OpenAI API key and Eleven Labs API key in `.env`
- **Model Configuration**: OpenAI image and script models configurable via env vars
- **Generation Time**: AI image + script + voice can take 15-30 seconds
- **No Persistence**: All artwork is ephemeral—no storage, no history
- **Desktop Experience**: Focus on desktop browser experience

## Key Decisions

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

*Last updated: 2026-04-13 — v1.1 milestone started (Polish & Refinements)*
