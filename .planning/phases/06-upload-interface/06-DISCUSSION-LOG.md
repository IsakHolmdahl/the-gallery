# Phase 6: Upload Interface - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-17
**Phase:** 06-upload-interface
**Areas discussed:** Drop Zone Integration, Preview Frame Style, Submission Flow, Text/Image Mode Switching

---

## Drop Zone Integration

| Option | Description | Selected |
|--------|-------------|----------|
| A) Overlay the textarea | Drop zone covers the textarea when dragging; textarea stays visible otherwise | ✓ |
| B) Replace the textarea | Drop zone is the new input area; text input becomes secondary or hidden | |
| C) Separate drop zone below textarea | Two distinct input areas side by side or stacked | |

**User's choice:** A
**Notes:** Overlay approach keeps the existing text prompt flow intact while adding drag-and-drop capability.

---

## Preview Frame Style

| Option | Description | Selected |
|--------|-------------|----------|
| A) Match existing ArtDisplay frame | Reuse the same frame styling from art-display.tsx but smaller | |
| B) Simplified gallery frame | Lighter version with just border/shadow, no ornate details | ✓ |
| C) Thumbnail with frame accent | Small preview with a decorative corner or border element | |

**User's choice:** B
**Notes:** Simplified frame keeps the gallery feel without over-engineering the preview.

---

## Submission Flow

| Option | Description | Selected |
|--------|-------------|----------|
| A) Same "Create Art" button | Button text changes to "Analyze art" when image is present | ✓ |
| B) Auto-submit on drop | Image drops → immediately starts vision pipeline (no button click) | |
| C) Separate "Analyze" button | New button appears alongside the preview, "Create Art" stays for text | |

**User's choice:** A
**Notes:** User specified exact text: "Analyze art" (not "Analyze This Artwork"). Single button approach keeps UI clean.

---

## Text ↔ Image Mode Switching

| Option | Description | Selected |
|--------|-------------|----------|
| A) X button only | Click X on preview to clear and return to text mode | ✓ |
| B) X button + click-to-upload | Both X and clicking the drop zone area can switch modes | |
| C) Toggle/tab switch | Explicit "Text" / "Image" tabs above the input area | |

**User's choice:** A
**Notes:** Simple and clear — X button is the only way to switch back to text mode.

---

## Agent's Discretion

- Drop zone visual feedback (amber/stone border glow animation) — implementer decides exact animation timing and easing
- Preview frame dimensions — implementer decides sizing relative to the form container
- Error message positioning — implementer decides where format/size errors appear
