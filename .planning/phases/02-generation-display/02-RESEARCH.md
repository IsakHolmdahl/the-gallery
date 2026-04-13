# Research: Phase 2 - Generation & Display

**Phase:** 2
**Goal:** AI generates artwork, displays in frame with docent narration
**Generated:** 2026-04-13

---

## Research Summary

This phase implements the AI generation pipeline: image → script → voice → display. The pipeline is sequential by nature (each step depends on the previous).

---

## 1. OpenAI Image Generation

### API Pattern (Node.js SDK)

```typescript
import OpenAI from 'openai';
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const imageResponse = await openai.images.generate({
  model: process.env.OPENAI_IMAGE_MODEL || 'gpt-image-1',
  prompt: userPrompt,
  n: 1,
  size: '1024x1024', // or '1792x1024' for landscape
});

// Response: { created: number, data: [{ url?: string, b64_json?: string }] }
const imageUrl = imageResponse.data[0].url;
```

### Key Findings

- **Model**: `gpt-image-1` (latest) or `dall-e-3` (fallback)
- **Response format**: `url` (public URL) or `b64_json` (base64 for privacy)
- **Image size**: `1024x1024` (square), `1792x1024` (landscape), `1024x1792` (portrait)
- **Generation time**: 5-15 seconds
- **Rate limits**: 50 requests/minute for DALL-E 3, subject to OpenAI tier limits

### Error Handling

```typescript
try {
  const imageResponse = await openai.images.generate({ ... });
} catch (error) {
  if (error.status === 429) {
    // Rate limited - retry with backoff
  } else if (error.status === 400) {
    // Invalid prompt - return user-friendly error
  }
}
```

---

## 2. OpenAI Script Generation (Museum Docent Narration)

### API Pattern (Node.js SDK)

```typescript
const scriptResponse = await openai.chat.completions.create({
  model: process.env.OPENAI_SCRIPT_MODEL || 'gpt-4o',
  messages: [
    {
      role: 'system',
      content: `You are a formal museum docent. Write a 30-60 second narration 
        explaining an artwork to visitors. Use formal, elegant language. 
        Begin directly with the narration - no preamble.`
    },
    {
      role: 'user', 
      content: `Describe this artwork: ${userPrompt}`
    }
  ],
  max_tokens: 500,
  temperature: 0.7,
});

const script = scriptResponse.choices[0].message.content;
```

### Key Findings

- **Model**: `gpt-4o` or `gpt-4o-mini` (faster, cheaper)
- **Response**: Plain text script, ~150-250 words for 30-60 seconds of narration
- **Tone**: Formal, museum-style, educational
- **Structure**: Descriptive, evocative, no greetings or sign-offs

### Docent Prompt Template

```
You are the distinguished curator of a renowned art museum. Write a formal 
docent narration (30-60 seconds when spoken aloud) that introduces and 
explains an artwork to gallery visitors.

Style guidelines:
- Formal, elegant language befitting a world-class institution
- Address visitors as "we" and "you" to create intimacy
- Focus on artistic technique, historical context, and emotional impact
- Begin the narration immediately - no preamble like "Welcome to..."
- End with an invitation to contemplate the work

Artwork to describe: [user prompt]

Write only the narration text, nothing else.
```

---

## 3. Eleven Labs TTS (Voice Narration)

### API Pattern (Node.js SDK)

```typescript
import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';

const elevenlabs = new ElevenLabsClient({
  apiKey: process.env.ELEVEN_LABS_API_KEY,
});

const audioStream = await elevenlabs.textToSpeech.stream(
  process.env.ELEVEN_LABS_VOICE_ID || 'azo',
  {
    text: scriptText,
    modelId: 'eleven_multilingual_v2',
    outputFormat: 'mp3_44100_128',
  }
);

// audioStream is a ReadableStream<Uint8Array>
```

### Key Findings

- **Voice ID**: `azo` (configured in env, formal voice)
- **Model**: `eleven_multilingual_v2` (supports multiple languages)
- **Output format**: `mp3_44100_128` (MP3, 44.1kHz, 128kbps)
- **Streaming**: Returns readable stream, ideal for real-time playback
- **Generation time**: ~5-10 seconds for 30-60 second audio

### Audio Playback in Browser

```typescript
// In a client component
const audioChunks: Uint8Array[] = [];

// Collect chunks from stream
const reader = audioStream.getReader();
while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  audioChunks.push(value);
}

// Create blob and play
const audioBlob = new Blob(audioChunks, { type: 'audio/mp3' });
const audioUrl = URL.createObjectURL(audioBlob);
const audio = new Audio(audioUrl);
await audio.play();
```

### Alternative: Base64 Audio for Simplicity

```typescript
// Convert stream to base64, send to client
import { toFile } from '@elevenlabs/elevenlabs-js';

// Option: Save as file or return base64
const audioBuffer = await toFile(audioStream);
const base64 = audioBuffer.toString('base64');
// Send base64 to client, decode and play
```

---

## 4. Sequential Pipeline Architecture

### Recommended Flow

```
User submits prompt
       │
       ▼
┌─────────────────┐
│ 1. Generate    │ ← 5-15 seconds
│    Image       │
│ (OpenAI GPT-   │
│  Image)        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ 2. Generate     │ ← 3-5 seconds
│    Script       │
│ (OpenAI GPT)    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ 3. Generate     │ ← 5-10 seconds
│    Voice        │
│ (Eleven Labs)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ 4. Display &    │
│    Play         │
└─────────────────┘
```

### Server Action Implementation

```typescript
'use server'

export async function createArt(
  prevState: { success: boolean; error?: string } | null,
  formData: FormData
): Promise<{ success: boolean; imageUrl?: string; audioBase64?: string; script?: string; error?: string }> {
  const prompt = formData.get('prompt') as string;
  
  try {
    // Step 1: Generate image
    const imageResponse = await openai.images.generate({
      model: env.OPENAI_IMAGE_MODEL,
      prompt,
      n: 1,
      size: '1024x1024',
    });
    const imageUrl = imageResponse.data[0].url!;

    // Step 2: Generate script
    const scriptResponse = await openai.chat.completions.create({
      model: env.OPENAI_SCRIPT_MODEL,
      messages: [
        { role: 'system', content: DOCENT_SYSTEM_PROMPT },
        { role: 'user', content: `Describe this artwork: ${prompt}` }
      ],
      max_tokens: 500,
    });
    const script = scriptResponse.choices[0].message.content!;

    // Step 3: Generate voice
    const audioStream = await elevenlabs.textToSpeech.stream(
      env.ELEVEN_LABS_VOICE_ID,
      { text: script, modelId: 'eleven_multilingual_v2' }
    );
    
    // Convert stream to base64 for client playback
    const audioBuffer = await collectStream(audioStream);
    const audioBase64 = Buffer.from(audioBuffer).toString('base64');

    return { success: true, imageUrl, audioBase64, script };
    
  } catch (error) {
    console.error('Art generation failed:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Generation failed' 
    };
  }
}

async function collectStream(stream: ReadableStream<Uint8Array>): Promise<Uint8Array> {
  const reader = stream.getReader();
  const chunks: Uint8Array[] = [];
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
  }
  // Concatenate chunks
  const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;
  for (const chunk of chunks) {
    result.set(chunk, offset);
    offset += chunk.length;
  }
  return result;
}
```

### Error Handling Strategy

| Error Type | User Message | Action |
|------------|--------------|--------|
| Rate limit (429) | "The gallery is busy. Please try again in a moment." | Auto-retry once after 2s |
| Invalid prompt (400) | "This artwork cannot be created. Try a different description." | Show error, don't retry |
| API key invalid | "Gallery configuration error. Please contact support." | Show error |
| Network failure | "Connection lost. Please check your network and try again." | Show retry button |
| TTS failure | "Narration unavailable. Please try again." | Allow retry without regenerating image |

### Timeout Handling

```typescript
// Use AbortController for timeouts
const controller = new AbortController();
const timeout = setTimeout(() => controller.abort(), 60000); // 60s max

try {
  const result = await createArt(...);
} catch (error) {
  if (error.name === 'AbortError') {
    return { success: false, error: 'Generation timed out. Please try again.' };
  }
} finally {
  clearTimeout(timeout);
}
```

---

## 5. Frontend Integration

### Display Component Structure

```typescript
// src/components/art-display.tsx
'use client'

import { useEffect, useRef } from 'react';

interface ArtDisplayProps {
  imageUrl: string;
  audioBase64: string;
  script: string;
}

export function ArtDisplay({ imageUrl, audioBase64, script }: ArtDisplayProps) {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    // Auto-play audio when component mounts
    if (audioRef.current && audioBase64) {
      audioRef.current.play().catch(console.error);
    }
  }, [audioBase64]);

  return (
    <div className="space-y-6">
      {/* Image in decorative frame */}
      <div className="relative">
        {/* Outer frame */}
        <div className="p-4 bg-gradient-to-b from-amber-100 to-amber-50 rounded-lg shadow-lg">
          {/* Inner mat */}
          <div className="p-2 bg-white">
            {/* Image */}
            <img 
              src={imageUrl} 
              alt="Generated artwork"
              className="w-full h-auto rounded"
            />
          </div>
        </div>
      </div>

      {/* Hidden audio player for auto-play */}
      <audio 
        ref={audioRef}
        src={`data:audio/mp3;base64,${audioBase64}`}
        autoPlay
      />
    </div>
  );
}
```

### Frame Styling

Existing inner frame pattern from Phase 1:
```tsx
<div className="absolute inset-2 rounded-xl border border-stone-300/40 pointer-events-none" />
```

Enhanced frame for Phase 2:
```tsx
{/* Gold museum frame effect */}
<div className="relative p-6 bg-gradient-to-b from-amber-100 to-amber-50 rounded-lg shadow-2xl">
  {/* Inner mat (white border around image) */}
  <div className="p-3 bg-white rounded shadow-inner">
    <img src={imageUrl} alt="Generated artwork" className="w-full rounded-sm" />
  </div>
  {/* Shadow overlay for depth */}
  <div className="absolute inset-0 rounded-lg shadow-inner pointer-events-none" />
</div>
```

### Error State UI

```typescript
// Error display component
function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="text-center py-8 space-y-4">
      <p className="text-stone-600">{message}</p>
      <Button onClick={onRetry} variant="outline">
        Try Again
      </Button>
    </div>
  );
}
```

---

## 6. Dependencies

### Required Packages

```bash
npm install openai @elevenlabs/elevenlabs-js
```

### Environment Variables (Already Configured)

```
OPENAI_API_KEY=sk-...
OPENAI_IMAGE_MODEL=gpt-image-1  # or dall-e-3
OPENAI_SCRIPT_MODEL=gpt-4o
ELEVEN_LABS_API_KEY=...
ELEVEN_LABS_VOICE_ID=azo
```

---

## 7. Potential Pitfalls & Solutions

| Pitfall | Mitigation |
|---------|------------|
| Audio doesn't auto-play (browser policy) | User gesture required; show "Play Narration" button as fallback |
| Image generation slow (15s+) | Keep loading state, update museum message |
| Base64 audio large (>1MB) | Use streaming URL or reduce audio quality |
| Script too long for audio | Limit max_tokens: 500 (~60s max narration) |
| Rate limiting | Implement retry with exponential backoff |
| API keys exposed | All calls server-side only via Server Actions |

---

## 8. Recommendations

1. **Sequential pipeline is correct** - Each step depends on previous output
2. **Use base64 for audio** - Simpler than streaming for this use case
3. **Reuse existing frame pattern** - Extend Phase 1's inner frame with gold museum aesthetic
4. **Store image URL** - No need to proxy; OpenAI URLs are public
5. **Collect audio chunks server-side** - Convert stream to base64 before returning
