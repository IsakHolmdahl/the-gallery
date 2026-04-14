---
status: testing
phase: 03-gallery-display-stability
source: [03-01-SUMMARY.md]
started: 2026-04-14T11:30:00Z
updated: 2026-04-14T11:32:00Z
---

## Current Test

number: 1
name: Second Generation No Crash
expected: |
  Generate an artwork. Immediately submit a second prompt. The app does not crash, show an error, or hang — the second artwork generates successfully and replaces the first.
awaiting: user response

## Tests

### 1. Second Generation No Crash
expected: Generate an artwork. Immediately submit a second prompt. The app does not crash, show an error, or hang — the second artwork generates successfully and replaces the first.
result: issue (resolved)
reported: "cant enter main screen, it gives an error — Runtime ZodError: OPENAI_API_KEY and ELEVEN_LABS_API_KEY undefined"
severity: blocker
resolution: art-display.tsx imported env from @/lib/env which runs envSchema.parse(process.env) at module level. In client components, server-only env vars are undefined. Fix: pass ARTWORK_SIZE as prop from server component instead.
fix_commit: 45b9814

### 2. Landscape 16:9 Frame
expected: The artwork displays in a landscape orientation (wider than tall). The frame has a 16:9 aspect ratio — noticeably wider than the previous square format.
result: [pending]

### 3. Configurable Frame Width
expected: The artwork frame fills approximately 70% of the viewport width (default). It is centered on the page. If ARTWORK_SIZE env var is set to a different value, the frame width changes accordingly.
result: [pending]

## Summary

total: 3
passed: 0
issues: 1 (resolved)
pending: 2
skipped: 0
blocked: 0

## Gaps

- truth: "User can load the main page without errors"
  status: resolved
  reason: "User reported: cant enter main screen, Runtime ZodError — OPENAI_API_KEY and ELEVEN_LABS_API_KEY undefined"
  severity: blocker
  test: 1
  root_cause: "art-display.tsx (client component) imported env from @/lib/env which calls envSchema.parse(process.env) at module load. Server-only env vars are undefined on client side."
  artifacts:
    - path: "src/components/art-display.tsx"
      issue: "imported env in 'use client' component"
  missing:
    - "Pass ARTWORK_SIZE as prop from server component instead of importing env in client"
  debug_session: ""
  resolution: "Fixed in commit 45b9814 — removed env import from client components, ARTWORK_SIZE flows as prop from page.tsx → PromptForm → ArtDisplay"
