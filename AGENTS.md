<!-- GSD:project-start source:PROJECT.md -->
## Project

**Art Gallery - AI Image Experience**

A web experience where visitors curate AI-generated artwork for exhibition. Enter a text prompt, and watch as an image materializes in a museum-worthy frame, accompanied by a formal museum docent's narration explaining the piece. The visitor plays the role of gallery curator, selecting works for display, while an AI art expert provides context and commentary. Ephemeral and intentional—each creation exists only in the moment.

**Core Value:** A meditative, gallery-like experience where AI-generated art feels curated and meaningful, not random.

### Constraints

- **API Dependencies**: Requires OpenAI API key and Eleven Labs API key in `.env`
- **Model Configuration**: OpenAI image and script models configurable via env vars (flexibility as models evolve)
- **Generation Time**: AI image + script + voice can take 15-30 seconds
- **No Persistence**: All artwork is ephemeral—no storage, no history
- **Desktop Experience**: Focus on desktop browser experience
<!-- GSD:project-end -->

<!-- GSD:stack-start source:STACK.md -->
## Technology Stack

Technology stack not yet documented. Will populate after codebase mapping or first phase.
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->
## Conventions

Conventions not yet established. Will populate as patterns emerge during development.
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->
## Architecture

Architecture not yet mapped. Follow existing patterns found in the codebase.
<!-- GSD:architecture-end -->

<!-- GSD:skills-start source:skills/ -->
## Project Skills

No project skills found. Add skills to any of: `.claude/skills/`, `.agents/skills/`, `.cursor/skills/`, or `.github/skills/` with a `SKILL.md` index file.
<!-- GSD:skills-end -->

<!-- GSD:workflow-start source:GSD defaults -->
## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd-quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd-debug` for investigation and bug fixing
- `/gsd-execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->



<!-- GSD:profile-start -->
## Developer Profile

> Profile not yet configured. Run `/gsd-profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
