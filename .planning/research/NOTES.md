# Research Notes

## Artifacts

- GitHub repo: https://github.com/haceneZERROUK/Claude-Code-Best-Practices
- Over 9.4k stars
- A cheat sheet / quick reference — NOT a long guide
- Created by someone who learned Claude Code as a new user (nov 2025)
- Organized around 5 key themes: AGENTS.md, CLI, CLAUDE.md, Hooks, Skills

## Approach

The user doesn't want a skills-bible-style long guide. They want something closer to the Claude-Code-Best-Practices cheat sheet format: concise, actionable, quick to scan.

Since our source material is the official Anthropic docs (much richer than the cheat sheet), we should:
- Keep the cheat sheet "quick reference" spirit
- But offer MORE DETAIL where it helps — deeper explanations, more examples, gotchas
- Result: Medium-length guide that's both scannable AND genuinely useful

## Key patterns from the reference cheat sheet
- Emoji section headers (🔥 📋 etc)
- Short code blocks with comments
- "Pro tip" callouts
- Concise but not bare

## Structure decided

1. AGENTS.md — The memory architecture (levels, inheritance, what goes where, pro tips)
2. CLI Commands — Slash commands, session management, piped input
3. CLAUDE.md — Project memory structure (nested, persona, tool rules)
4. Claude Skills — What they are, when to use, structure, manifest format
5. Hooks — Event types, examples, safety gotchas (DO NOT EDIT)
6. Settings hierarchy — Files, precedence, what goes where
7. Model Context Protocol (MCP) — Config, JSON schema, modes
8. CLI flags & options — Quick reference table
9. Pro Tips — Actionable advice beyond official docs
