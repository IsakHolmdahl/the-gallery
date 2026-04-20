# Milestones: Art Gallery

## v1.2 Image Upload & Lecture (Shipped: 2026-04-20)

**Status:** ✅ SHIPPED 2026-04-20
**Phases:** 3 | **Plans:** 3 | **Requirements:** 14/14 complete

**Key accomplishments:**

- Vision server action (`createArtFromImage`) with OpenAI vision API integration
- Drag-and-drop image upload with drop zone overlay and amber/stone glow animation
- Image preview in miniature museum-style frame with X button to clear
- Counter-based drag detection eliminating flicker from child elements
- Client-side Canvas API compression for Vercel free tier compatibility
- 1-second voice delay for natural reveal timing
- Upload limit increased from 3MB to 10MB with server body size config

**Archive:** `.planning/milestones/v1.2-ROADMAP.md`
**Requirements:** `.planning/milestones/v1.2-REQUIREMENTS.md`

---

## v1.1 Polish & Refinements (Shipped: 2026-04-15)

**Phases completed:** 2 phases, 2 plans, 3 tasks

**Key accomplishments:**

- Fixed crash-on-second-generation by replacing useActionState with useState+useTransition, upgraded to 16:9 landscape artwork frame with configurable viewport width via ARTWORK_SIZE env var

---

## v1.0 Art Gallery

**Status:** ✅ SHIPPED 2026-04-13
**Phases:** 2 | **Plans:** 2 | **Requirements:** 16/16 complete

**Delivered:**

- Gallery page with elegant museum-quality visual design
- Sequential AI generation pipeline (image → script → voice)
- OpenAI image + script generation, ElevenLabs TTS
- ArtDisplay component with decorative amber frame
- Audio autoplay with fallback "Play Narration" button
- "Create Another" reset flow with smooth transitions
- Error handling with friendly messages

**Archive:** `.planning/milestones/v1.0-ROADMAP.md`
**Requirements:** `.planning/milestones/v1.0-REQUIREMENTS.md`

---

*See archive files for full phase details and requirements traceability.*
