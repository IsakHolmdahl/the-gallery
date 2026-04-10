# Art Gallery - AI Image Experience

## What This Is

A web experience where visitors curate AI-generated artwork for exhibition. Enter a text prompt, and watch as an image materializes in a museum-worthy frame, accompanied by a formal museum docent's narration explaining the piece. The visitor plays the role of gallery curator, selecting works for display, while an AI art expert provides context and commentary. Ephemeral and intentional—each creation exists only in the moment.

## Core Value

A meditative, gallery-like experience where AI-generated art feels curated and meaningful, not random.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Visitor can enter a text prompt describing desired artwork
- [ ] "Create Art" button activates only when prompt field has content
- [ ] Formal museum-style loading messages appear during generation (e.g., "Creation in Progress, Perfection Pending")
- [ ] AI-generated image appears in an elegant frame upon completion
- [ ] Museum docent voiceover script is generated explaining the artwork
- [ ] Voice narration plays automatically when artwork is revealed
- [ ] Clean, light gallery aesthetic with shadcn components
- [ ] Error states display friendly message allowing retry

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
- OpenAI API for image generation (DALL-E) and script generation (GPT)
- Eleven Labs API for voice synthesis

## Constraints

- **API Dependencies**: Requires OpenAI API key and Eleven Labs API key in `.env`
- **Model Configuration**: OpenAI image and script models configurable via env vars (flexibility as models evolve)
- **Generation Time**: AI image + script + voice can take 15-30 seconds
- **No Persistence**: All artwork is ephemeral—no storage, no history
- **Desktop Experience**: Focus on desktop browser experience

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| No user accounts | Simplicity; gallery is atmosphere, not social | — Pending |
| Ephemeral experience | Art exists in the moment; creates intentionality | — Pending |
| Visitor as curator | User prompts, but AI is the "artist"—creates docent dynamic | — Pending |
| Fancy frame around image | Visual anchor, museum authenticity | — Pending |
| Formal docent narration | Elevates AI output; museum context | — Pending |
| shadcn + light theme | Clean, gallery-white aesthetic | — Pending |
| OpenAI for image + script | Configurable models via env vars | — Pending |
| Eleven Labs for voice | TTS with formal docent voice | — Pending |

---

*Last updated: 2025-04-10 after initialization*
