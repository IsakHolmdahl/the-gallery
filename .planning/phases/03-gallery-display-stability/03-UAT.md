---
status: testing
phase: 03-gallery-display-stability
source: [03-01-SUMMARY.md]
started: 2026-04-14T11:30:00Z
updated: 2026-04-14T11:35:00Z
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
reported: "Generation failed: 400 Invalid size '1792x1024'. Supported sizes are 1024x1024, 1024x1536, 1536x1024, and auto."
severity: blocker
resolution: Changed image size from 1792x1024 to 1536x1024 in actions.ts. OpenAI API no longer supports 1792x1024.
fix_commit: 17bc6c0

### 2. Landscape 16:9 Frame
expected: The artwork displays in a landscape orientation (wider than tall). The frame has a 16:9 aspect ratio — noticeably wider than the previous square format.
result: [pending]

### 3. Configurable Frame Width
expected: The artwork frame fills approximately 70% of the viewport width (default). It is centered on the page. If ARTWORK_SIZE env var is set to a different value, the frame width changes accordingly.
result: [pending]

## Summary

total: 3
passed: 0
issues: 2 (both resolved)
pending: 2
skipped: 0
blocked: 0

## Gaps

- truth: "User can load the main page without errors"
  status: resolved
  reason: "User reported: Runtime ZodError — OPENAI_API_KEY and ELEVEN_LABS_API_KEY undefined"
  severity: blocker
  test: 1
  root_cause: "art-display.tsx imported env in client component — server-only env vars undefined on client"
  artifacts:
    - path: "src/components/art-display.tsx"
      issue: "imported env in 'use client' component"
  missing:
    - "Pass ARTWORK_SIZE as prop from server component instead of importing env in client"
  debug_session: ""
  resolution: "Fixed in commit 45b9814"

- truth: "Image generation uses landscape 16:9 size"
  status: resolved
  reason: "User reported: 400 Invalid size '1792x1024'. Supported sizes are 1024x1024, 1024x1536, 1536x1024, and auto."
  severity: blocker
  test: 1
  root_cause: "OpenAI API no longer supports 1792x1024 size. Plan used outdated size value."
  artifacts:
    - path: "src/app/actions.ts"
      issue: "size: 1792x1024 not supported"
  missing:
    - "Use 1536x1024 (supported landscape size) instead of 1792x1024"
  debug_session: ""
  resolution: "Fixed in commit 17bc6c0 — changed to 1536x1024"
