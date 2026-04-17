# Phase 5: Vision Pipeline — Research

**Researched:** 2026-04-17
**Status:** Complete

## Standard Stack

| Component | Technology | Notes |
|-----------|-----------|-------|
| Vision API | OpenAI `chat.completions.create` | Same SDK as existing script generation |
| Vision Model | `OPENAI_SCRIPT_MODEL` (gpt-4o) | Reuses existing env var — gpt-4o supports vision |
| Voice Synthesis | ElevenLabs `textToSpeech.stream` | Reuses exact existing pipeline |
| Image Transport | Base64 data URI in server action | Client encodes, server receives |

## Vision API Approach

The OpenAI Node SDK (v6) supports vision via `chat.completions.create` with multimodal content:

```typescript
const response = await openai.chat.completions.create({
  model: env.OPENAI_SCRIPT_MODEL, // gpt-4o
  messages: [
    { role: "system", content: DOCENT_SYSTEM_PROMPT },
    {
      role: "user",
      content: [
        {
          type: "text",
          text: "Describe this artwork as a docent narration for gallery visitors.",
        },
        {
          type: "image_url",
          image_url: {
            url: `data:image/png;base64,${base64Image}`,
            detail: "high", // richer analysis per user decision
          },
        },
      ],
    },
  ],
  max_completion_tokens: 500,
});
```

**Key decisions:**
- `detail: "high"` — richer, more specific art analysis (user-locked decision)
- Reuse `OPENAI_SCRIPT_MODEL` — no new env var needed (user-locked decision)
- Same `DOCENT_SYSTEM_PROMPT` — consistent narration voice
- Same `max_completion_tokens: 500` — fits 30-60s spoken narration

## Image Format Support

| Format | MIME Type | OpenAI Support |
|--------|-----------|---------------|
| PNG | `image/png` | ✅ |
| JPEG | `image/jpeg` | ✅ |
| WEBP | `image/webp` | ✅ |
| GIF | `image/gif` | ❌ Rejected (animated) |

## Body Size Constraint

- Vercel serverless body limit: ~4.5MB
- Base64 inflation: ~33% larger than binary
- **Effective client image cap: ~3MB** (already decided in STATE.md)
- Client-side validation MUST enforce this before sending

## ElevenLabs Pipeline

Identical to existing `createArt` action — the vision script text feeds directly into `elevenlabs.textToSpeech.stream` with same params:
- `modelId: "eleven_multilingual_v2"`
- `outputFormat: "mp3_44100_128"`
- Voice ID from `env.ELEVEN_LABS_VOICE_ID`

## Architecture Pattern

New server action `createArtFromImage` follows the same structure as `createArt`:
1. Receive base64 image in FormData
2. Call OpenAI vision API → get script
3. Call ElevenLabs TTS → get audio
4. Return `{ success, imageUrl, audioBase64, script }` — same response shape

The image URL is the original base64 data URI (no round-trip needed — the client already has the image data in memory).

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Base64 payload > Vercel limit | 413 error | 3MB client-side cap |
| Vision model hallucination | Poor narration | `detail: "high"` + strong system prompt |
| GIF upload | API error | Client-side type validation |
| Large image token cost | Higher latency/cost | `detail: "high"` is intentional trade-off |

## Validation Architecture

Not applicable — `nyquist_validation_enabled` is false.

---

*Phase 5: Vision Pipeline*
*Research complete: 2026-04-17*
