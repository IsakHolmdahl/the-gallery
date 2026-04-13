---
phase: 02
reviewers: [opencode]
reviewed_at: 2026-04-13T00:00:00.000Z
plans_reviewed: [02-01-PLAN.md]
---

# Cross-AI Plan Review — Phase 2

## OpenCode Review

### Summary

The plan is structurally sound and accurately translates the project requirements into a logical Next.js architecture using Server Actions. It correctly isolates the API dependencies to the server side and provides a clear breakdown of components (Action, Form, Display). However, there are significant technical risks regarding browser autoplay policies, Next.js server execution limits, and data payload sizes that must be addressed to ensure a stable production experience.

### Strengths

- **Secure Architecture:** Using Server Actions properly keeps the OpenAI and ElevenLabs API keys secure on the server.
- **Clear Component Boundaries:** The separation between the `PromptForm` (input/loading state), `actions.ts` (orchestration), and `ArtDisplay` (presentation) is clean and maintainable.
- **Comprehensive Error Handling:** Explicitly planning for failure states and providing a "Create Another" retry loop aligns perfectly with the required UX.
- **Direct Alignment:** Every phase requirement (CORE-04 through TECH-03) is explicitly accounted for in the planned tasks.

### Concerns

- **HIGH: Browser Autoplay Restrictions.** Browsers strictly block audio autoplay unless there is a recent user interaction. Because the generation pipeline takes 15-30 seconds, the browser will likely lose the "user gesture" context from the initial button click, causing the audio auto-play to be blocked by the browser.
- **HIGH: Server Action Timeouts.** The combined pipeline (5-15s + 3-5s + 5-10s = up to 30 seconds) risks hitting Next.js/Vercel serverless function timeout limits (which default to 10-15 seconds on some tiers).
- **MEDIUM: Unnecessary Sequential Latency.** The plan specifies a sequential pipeline (`image → script → voice`). Assuming the script is generated based purely on the user's prompt (and not a vision-based analysis of the generated image), waiting for the image to finish before starting the script adds unnecessary waiting time.
- **MEDIUM: Base64 Audio Payload Size.** Returning the entire audio file as a Base64 string in a Server Action response can result in massive payload sizes (megabytes), which can cause memory spikes, hit Next.js response size limits, and cause UI stuttering during hydration.

### Suggestions

- **Parallelize independent generations:** Use `Promise.all` to run the Image Generation and Script Generation at the same time. Once the Script finishes, pass it immediately to ElevenLabs. This will cut 5-15 seconds off the total wait time.
- **Add a fallback UI for Audio:** In `ArtDisplay`, handle the promise returned by `audioElement.play()`. If it rejects due to autoplay policies, show a prominent "Play Narration" button over the artwork so the user can manually start it.
- **Stream Audio instead of Base64 (Optional but Recommended):** Instead of waiting for the full ElevenLabs generation to complete and sending it as a massive Base64 string, consider storing the ElevenLabs generation behind an API route (`/api/audio?prompt=...`) and having the client `<audio src="/api/audio?..." />` fetch and stream it. If you must use Base64 due to the ephemeral constraint, ensure Next.js body size limits are configured to allow it.
- **Verify Serverless Timeouts:** Explicitly set `export const maxDuration = 60;` in `src/app/actions.ts` to prevent the function from timing out in deployment.

### Risk Assessment

**HIGH** — While the feature completeness is good, the plan relies on a 30-second synchronous server action returning a large Base64 payload, followed by a browser autoplay execution. Without mitigating the server timeout limits and browser autoplay blocks, the feature is highly likely to fail silently or crash in a deployed environment. Implementing the parallelization and autoplay fallback suggestions will reduce this risk to LOW.

---

## Consensus Summary

### Agreed Strengths

- Secure server-side architecture
- Clean component separation
- Comprehensive error handling
- Direct requirement alignment

### Agreed Concerns

- **HIGH**: Browser autoplay restrictions (user gesture context lost after 15-30s wait)
- **HIGH**: Server action timeout risks (30s pipeline vs 10-15s default limits)
- **MEDIUM**: Base64 audio payload size could cause memory/response size issues

### Priority Fixes

1. Add "Play Narration" fallback button in ArtDisplay for autoplay policy blocks
2. Set `export const maxDuration = 60` in actions.ts for serverless timeout
3. Consider parallelizing image + script generation (not voice - depends on script)

### Divergent Views

N/A - only one reviewer (OpenCode) completed successfully.
