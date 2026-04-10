# Phase 1: Foundation & Input - Research

**Researched:** 2025-04-10
**Domain:** Next.js App Router + shadcn/ui form handling and loading states
**Confidence:** HIGH

<user_constraints>
## User Constraints (from STATE.md Accumulated Context)

**CRITICAL:** No CONTEXT.md from discuss-phase exists yet. All decisions at the agent's discretion.

### Locked Decisions (from STATE.md)
- shadcn + light theme (gallery-white aesthetic)
- No user accounts (simplicity)
- Ephemeral experience (art exists in moment)
- Visitor as curator (prompts + AI artist)
- Fancy frame around image (museum authenticity) — Phase 2
- Formal docent narration (elevates AI output) — Phase 2
- OpenAI for image + script (configurable models) — Phase 2
- Eleven Labs for voice (formal docent voice) — Phase 2

### Phase 1 Scope
This phase covers:
- CORE-01: Text prompt input interface
- CORE-02: Disabled "Create Art" button until prompt has content
- CORE-03: Loading animation with museum-style messages
- UI-01: Clean gallery aesthetic with shadcn components
- UI-04: Formal museum tone for loading messages
- TECH-04: Environment variable setup for API keys and model config

### Out of Scope for Phase 1
- AI image generation (CORE-04) — Phase 2
- Script generation (CORE-05) — Phase 2
- TTS voice (CORE-06) — Phase 2
- Image framing (UI-02) — Phase 2
- Error states with retry (UI-03) — Phase 2

### the agent's Discretion
- Exact shadcn component selection (Input, Button, Textarea based on needs)
- Loading animation style (Spinner vs Progress vs custom)
- Form validation approach
- Museum message rotation strategy
- Page layout structure
</user_constraints>

<research_summary>
## Summary

Phase 1 establishes the foundation: prompt input, disabled button behavior, and loading states in a gallery aesthetic. The tech stack is Next.js 15+ with App Router, shadcn/ui for components, Tailwind CSS for styling, and Zod for environment variable validation.

**Key findings:**
1. Form handling uses Next.js `useActionState` hook with Server Actions — `disabled={pending}` controls button state
2. shadcn Button has no built-in loading state — compose with Spinner component manually
3. Loading messages rotate through museum-style phrases; no animation library needed, just CSS `animate-spin`
4. Environment variables use Zod schema validation with `z.string()` and `.safeParse()`

**Primary recommendation:** Use Next.js App Router with `'use client'` form component, shadcn Input/Button, useActionState for pending state, and Zod for env validation. Keep it simple — this is foundation, not the generation pipeline.
</research_summary>

<standard_stack>
## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js | 15.x | React framework with App Router | App Router is the current standard; Server Actions simplify form handling |
| React | 19.x | UI library | Ships with Next.js 15 |
| shadcn/ui | latest | Component library | Copy-paste components, not a package; fully customizable |
| Tailwind CSS | 4.x | Styling | Integrated with shadcn; OKLch color system |
| Zod | 4.x | Schema validation | Industry standard for TypeScript validation; used in Next.js docs |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| lucide-react | latest | Icons | Included with shadcn; Loader2 icon for spinner |
| @tailwindcss/postcss | 4.x | PostCSS processing | Required for Tailwind 4 |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Pages Router | App Router | App Router is current standard; Server Components enable better patterns |
| React Hook Form | useActionState + Server Actions | Simpler for Phase 1's single form; no client-side validation needed |
| tailwindcss-animate | tw-animate-css | tw-animate-css is the shadcn v4 standard for animations |
| Yup validation | Zod | Zod is TypeScript-first and used in Next.js docs |

**Installation:**
```bash
npx shadcn@latest init
npx shadcn@latest add button input textarea
npm install zod
```
</standard_stack>

<architecture_patterns>
## Architecture Patterns

### Recommended Project Structure
```
src/
├── app/
│   ├── page.tsx              # Main gallery page
│   ├── layout.tsx            # Root layout with fonts
│   └── globals.css           # Tailwind + shadcn theme
├── components/
│   ├── ui/                   # shadcn components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   └── textarea.tsx
│   ├── prompt-form.tsx       # Client component for prompt input
│   ├── loading-state.tsx     # Loading display component
│   └── spinner.tsx          # Custom spinner if needed
├── lib/
│   ├── utils.ts              # cn() helper from shadcn
│   └── env.ts                # Environment validation schema
└── actions/
    └── create-art.ts         # Server Action (Phase 2, placeholder for now)
```

### Pattern 1: Client Component Form with useActionState
**What:** Use `'use client'` component with useActionState to manage form state and pending status
**When to use:** Any form that needs immediate UI feedback (disabled button, loading indicator)
**Example:**
```tsx
'use client'

import { useActionState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createArt } from '@/app/actions'

export function PromptForm() {
  const [state, formAction, pending] = useActionState(createArt, null)

  return (
    <form action={formAction}>
      <Input
        name="prompt"
        placeholder="Describe the artwork you wish to create..."
        disabled={pending}
      />
      <Button type="submit" disabled={pending}>
        {pending ? 'Creating...' : 'Create Art'}
      </Button>
    </form>
  )
}
```

### Pattern 2: Loading Button Composition
**What:** shadcn Button has no `isLoading` prop — compose with Spinner manually
**When to use:** When button needs visual loading state
**Example:**
```tsx
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

<Button disabled={pending}>
  {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
  Create Art
</Button>
```

### Pattern 3: Environment Validation with Zod
**What:** Validate env vars at runtime with Zod schema
**When to use:** API keys and configuration that must exist
**Example:**
```typescript
import { z } from 'zod'

const envSchema = z.object({
  OPENAI_API_KEY: z.string().min(1),
  OPENAI_IMAGE_MODEL: z.string().default('dall-e-3'),
  OPENAI_SCRIPT_MODEL: z.string().default('gpt-4o'),
  ELEVEN_LABS_API_KEY: z.string().min(1),
  ELEVEN_LABS_VOICE_ID: z.string().default('某某个voice'),
})

export const env = envSchema.parse(process.env)
```

### Anti-Patterns to Avoid
- **Using 'use server' in client component files:** Server Actions go in separate files or use 'use server' at function level only
- **Setting disabled on Button without visual feedback:** Always show loading indicator when disabling
- **Hardcoding API keys:** Use environment variables, validated at startup
</architecture_patterns>

<dont_hand_roll>
## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Form validation | Custom validation logic | Zod safeParse() | Edge cases (empty, whitespace, special chars) are handled |
| Button loading state | Custom button with built-in spinner | Button + Loader2 composition | shadcn Button is just a styled button; composition is the intended pattern |
| Color theming | Custom CSS variables | shadcn OKLch system | Accessible contrast ratios, consistent with shadcn ecosystem |
| Animation | Custom CSS keyframes for basic spin | Tailwind animate-spin | Already provided by Tailwind; just add `animate-spin` class |

**Key insight:** shadcn is a component COPY system, not a package. You copy components and own them. This means loading states are intentionally not built-in — you're expected to compose them yourself.
</dont_hand_roll>

<common_pitfalls>
## Common Pitfalls

### Pitfall 1: Missing 'use client' Directive
**What goes wrong:** useActionState errors with "useActionState is not a function"
**Why it happens:** useActionState is a React hook; hooks require 'use client'
**How to avoid:** Add `'use client'` at top of form component file
**Warning signs:** "Invalid hook call" errors in browser console

### Pitfall 2: Button Disabled Without Loading Indicator
**What goes wrong:** User clicks button, button disables, user doesn't know something is happening
**Why it happens:** Only setting `disabled={pending}` without showing spinner
**How to avoid:** Always compose Loader2 spinner inside Button when pending
**Warning signs:** User reports "button stopped working" or "nothing happens"

### Pitfall 3: Environment Variables Not Validated at Startup
**What goes wrong:** API calls fail later with cryptic errors
**Why it happens:** Missing env vars aren't caught until runtime
**How to avoid:** Validate with Zod at module load time; fail fast on missing keys
**Warning signs:** "process.env.OPENAI_API_KEY is undefined" errors during generation

### Pitfall 4: Form Works in Dev but Fails in Production
**What goes wrong:** Environment variables work in .env but not loaded in production
**Why it happens:** Next.js env vars must be explicitly exposed to client
**How to avoid:** Prefix client-side vars with NEXT_PUBLIC_ OR keep all API keys server-side only
**Warning signs:** API errors in production that don't occur locally
</common_pitfalls>

<code_examples>
## Code Examples

### Form Component with Loading State
```tsx
// Source: Next.js forms guide + shadcn composition
'use client'

import { useActionState } from 'react'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { createArt } from '@/app/actions'

export function PromptForm() {
  const [state, formAction, pending] = useActionState(createArt, null)

  return (
    <form action={formAction} className="w-full max-w-md space-y-4">
      <Textarea
        name="prompt"
        placeholder="Describe the artwork you wish to create..."
        className="min-h-[120px] resize-none"
        disabled={pending}
      />
      <Button type="submit" disabled={pending} className="w-full">
        {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {pending ? 'Creation in Progress...' : 'Create Art'}
      </Button>
    </form>
  )
}
```

### Environment Validation
```typescript
// Source: Next.js environment variables guide + Zod
import { z } from 'zod'

const envSchema = z.object({
  OPENAI_API_KEY: z.string().min(1, 'OPENAI_API_KEY is required'),
  OPENAI_IMAGE_MODEL: z.string().default('dall-e-3'),
  OPENAI_SCRIPT_MODEL: z.string().default('gpt-4o'),
  ELEVEN_LABS_API_KEY: z.string().min(1, 'ELEVEN_LABS_API_KEY is required'),
  ELEVEN_LABS_VOICE_ID: z.string().default('azo'),
})

// Throws on invalid — fail fast at startup
export const env = envSchema.parse(process.env)
```

### Loading Messages (Museum Style)
```tsx
// Source: shadcn pattern for conditional rendering
const MUSEUM_MESSAGES = [
  'Creation in Progress, Perfection Pending',
  'Artistry Unfolds, A Moment of Anticipation',
  'The Muse Inspires, Please Remain',
  'Curating Beauty, A Brief Interlude',
]

export function LoadingState() {
  const [message, setMessage] = useState(MUSEUM_MESSAGES[0])

  // Rotate messages every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setMessage(prev => {
        const idx = MUSEUM_MESSAGES.indexOf(prev)
        return MUSEUM_MESSAGES[(idx + 1) % MUSEUM_MESSAGES.length]
      })
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <Loader2 className="h-12 w-12 animate-spin text-muted-foreground" />
      <p className="text-lg font-medium text-muted-foreground">{message}</p>
    </div>
  )
}
```

### .env.example
```bash
# Source: Next.js environment variables guide
# OpenAI Configuration
OPENAI_API_KEY=sk-...
OPENAI_IMAGE_MODEL=dall-e-3
OPENAI_SCRIPT_MODEL=gpt-4o

# Eleven Labs Configuration
ELEVEN_LABS_API_KEY=...
ELEVEN_LABS_VOICE_ID=某某个voice-id
```
</code_examples>

<sota_updates>
## State of the Art (2024-2025)

What's changed recently:

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Pages Router | App Router | 2023+ | Server Components reduce client JS; Server Actions replace API routes for forms |
| react-hook-form | useActionState + Server Actions | React 19 / Next.js 15 | Simpler DX for basic forms; no client-side validation needed |
| tailwindcss-animate | tw-animate-css | shadcn v4 (2024) | Better performance, smaller bundle |
| CSS Modules | Tailwind CSS + OKLch | shadcn default | Consistent theming, better color handling |

**New tools/patterns to consider:**
- **Next.js 15:** Improved form handling, better Server Action errors
- **shadcn v4:** New CLI, Tailwind v4, tw-animate-css

**Deprecated/outdated:**
- **Pages Router:** Use App Router for new projects
- **react-hook-form:** Use useActionState for simple forms; RHF still good for complex validation
</sota_updates>

<open_questions>
## Open Questions

1. **Should loading messages rotate or stay static?**
   - What we know: Requirements say "Loading animation displays with formal museum-style messages"
   - What's unclear: Should messages cycle or show one static message?
   - Recommendation: Rotate every 3 seconds for a more elegant experience

2. **Should the form use Textarea or Input?**
   - What we know: Prompt could be multi-sentence
   - What's unclear: Short prompts vs detailed descriptions
   - Recommendation: Textarea with min-height for better UX on desktop

3. **Where should API keys live — client or server?**
   - What we know: Phase 2 needs OpenAI and Eleven Labs
   - What's unclear: Should Phase 1 set up env vars for client or server?
   - Recommendation: Server-only for now (Phase 1 is UI only). Phase 2 will need client exposure for API calls.
</open_questions>

<sources>
## Sources

### Primary (HIGH confidence)
- /vercel/next.js - forms guide, environment variables, useActionState
- /shadcn-ui/ui - button composition, spinner, loading states

### Secondary (MEDIUM confidence)
- Next.js documentation on Server Actions and form handling
- shadcn/ui Discord/suggestions on loading state patterns

### Tertiary (LOW confidence - needs validation)
- Specific rotation timing for museum messages (3 seconds is a guess)
</sources>

<metadata>
## Metadata

**Research scope:**
- Core technology: Next.js 15 + shadcn/ui
- Ecosystem: Zod, Tailwind 4, lucide-react
- Patterns: Form handling, loading states, env validation
- Pitfalls: useActionState usage, button composition, env validation

**Confidence breakdown:**
- Standard stack: HIGH - verified with Context7, widely used
- Architecture: HIGH - from official Next.js and shadcn docs
- Pitfalls: HIGH - documented issues from Next.js/shadcn communities
- Code examples: HIGH - from Context7 verified sources

**Research date:** 2025-04-10
**Valid until:** 2025-05-10 (30 days - Next.js/shadcn ecosystem stable)
</metadata>

---

*Phase: 01-foundation-input*
*Research completed: 2025-04-10*
*Ready for planning: yes*
