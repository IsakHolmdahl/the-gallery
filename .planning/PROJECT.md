# Art Gallery - AI Image Experience

## What This Is

A web experience where visitors curate AI-generated artwork for exhibition. Enter a text prompt or drop your own image, and watch as it appears in a museum-worthy frame, accompanied by a formal museum docent's narration explaining the piece. The visitor plays the role of gallery curator, selecting works for display, while an AI art expert provides context and commentary. Ephemeral and intentional—each creation exists only in the moment.

## Core Value

A meditative, gallery-like experience where AI-generated art feels curated and meaningful, not random.

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

#### v1.1

- ✓ Artwork frame displays in 16:9 landscape aspect ratio — v1.1
- ✓ Artwork display size is larger and configurable via `ARTWORK_SIZE` env var — v1.1
- ✓ Background music (`background_music.mp3`) plays and loops when artwork is revealed — v1.1
- ✓ Background music fades in over 1 second on artwork reveal — v1.1
- ✓ Background music fades out over 1 second when "Create Another" is pressed — v1.1
- ✓ Mute button appears in bottom corner while music is playing — v1.1
- ✓ Second image generation no longer crashes (1MB body limit fixed) — v1.1

#### v1.2

- ✓ Plus icon and border glow appear on text field when user drags an image over it — v1.2
- ✓ Only PNG, JPEG, and WEBP files are accepted; other types show a friendly error — v1.2
- ✓ Images over 10MB are rejected with a clear message explaining the limit — v1.2
- ✓ User can click the text field area to open a file picker (click-to-upload fallback) — v1.2
- ✓ Drag indicator has smooth amber/stone border glow animation matching gallery aesthetic — v1.2
- ✓ Dropped image displays as a preview replacing the text field — v1.2
- ✓ Remove button (X) clears the preview and returns to text prompt mode — v1.2
- ✓ Preview image is displayed in a miniature museum-style frame — v1.2
- ✓ New `createArtFromImage` server action generates docent script from dropped image using OpenAI vision model — v1.2
- ✓ Dropped image is base64-encoded on client before sending to server action — v1.2
- ✓ Voice narration generates using the same ElevenLabs pipeline after vision script — v1.2
- ✓ Dropped image displays in the full-size elegant frame (same as AI-generated images) — v1.2
- ✓ "Create Another" resets image state — revokes object URL, clears preview, returns to text prompt — v1.2
- ✓ Vision model uses `detail: "high"` for richer, more specific docent narration — v1.2

### Active

<!-- No active requirements — v1.2 complete. Run /gsd-new-milestone to define next. -->

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
- Canvas API for client-side image compression

**Current State:**
- v1.0 shipped on 2026-04-13
- v1.1 shipped on 2026-04-15
- v1.2 shipped on 2026-04-20
- All 29 requirements satisfied across v1.0, v1.1, and v1.2
- Text-to-art generation + image upload with narration fully working
- Ready for next milestone

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

### v1.2 Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Reuse OPENAI_SCRIPT_MODEL for vision | No new env var needed | ✓ Shipped v1.2 |
| GIFs rejected entirely | OpenAI doesn't support animated GIFs | ✓ Shipped v1.2 |
| `detail: "high"` for vision | Richer, more specific art analysis | ✓ Shipped v1.2 |
| Drop zone overlays textarea | Single interactive element, no layout shift | ✓ Shipped v1.2 |
| Simplified gallery frame for preview | Lightweight, responsive | ✓ Shipped v1.2 |
| Dynamic button text | "Analyze art" signals image mode | ✓ Shipped v1.2 |
| Counter-based drag detection | Eliminates flicker on child elements | ✓ Shipped v1.2 |
| Canvas API compression | Zero dependencies, Vercel compatible | ✓ Shipped v1.2 |
| 1-second voice delay | Image reveal before narration | ✓ Shipped v1.2 |

## Evolution

This document evolves at phase transitions and milestone boundaries.

---

*Last updated: 2026-04-20 after v1.2 milestone completion*
