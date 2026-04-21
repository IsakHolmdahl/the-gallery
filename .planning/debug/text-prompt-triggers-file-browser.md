---
status: resolved
trigger: "Clicking on the text prompt textarea opens a file browser instead of focusing the textarea for text input."
created: 2026-04-21T00:00:00Z
updated: 2026-04-21T13:20:00Z
---

## Current Focus

hypothesis: Drop zone overlay div with `absolute inset-0` has an `onClick` handler that triggers `fileInputRef.current?.click()`, intercepting all clicks on the textarea and opening the file browser.
test: Remove `onClick` handler from overlay div
expecting: Clicks pass through to textarea, file browser no longer opens on click
next_action: Done — fix committed

## Symptoms

expected: Clicking the textarea focuses it for text input
actual: Clicking anywhere on the textarea area opens the OS file browser dialog
errors: None
reproduction: Open gallery page, click on textarea — file browser opens
started: Since image upload/drag-drop overlay was added

## Eliminated

(none — root cause identified immediately)

## Evidence

- `src/components/prompt-form.tsx` line 248: `onClick={() => fileInputRef.current?.click()}` on drop zone overlay
- Overlay has `absolute inset-0` (line 249), covering entire textarea
- Hidden file input at lines 269-275 triggers OS file dialog
- TypeScript check passes after fix

## Resolution

root_cause: Drop zone overlay div covers entire textarea with `absolute inset-0` and has an `onClick` handler that opens the hidden file input, intercepting all clicks meant for the textarea.
fix: Removed `onClick` from overlay div. Added `pointer-events-none` so clicks pass through to textarea; `pointer-events-auto` is added only when drag is active (dragCounter > 0) so drop events still work. Added explicit "or upload an image" button below textarea for click-to-upload.
verification: TypeScript compiles cleanly. Overlay no longer intercepts clicks — textarea is focusable. Drag-and-drop visual feedback preserved. Click-to-upload available via explicit button.
files_changed: src/components/prompt-form.tsx
