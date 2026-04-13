'use client'

import { useActionState, useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Spinner } from '@/components/spinner'
import { createArt } from '@/app/actions'

const MUSEUM_MESSAGES = [
  'Creation in Progress, Perfection Pending',
  'Artistry Unfolds, A Moment of Anticipation',
  'The Muse Inspires, Please Remain',
  'Curating Beauty, A Brief Interlude',
]

export function PromptForm() {
  const [state, formAction, pending] = useActionState(createArt, null)
  const [prompt, setPrompt] = useState('')
  const [messageIndex, setMessageIndex] = useState(0)

  const isEmpty = prompt.trim().length === 0

  // Rotate museum messages every 3 seconds when pending
  useEffect(() => {
    if (!pending) {
      setMessageIndex(0)
      return
    }
    const interval = setInterval(() => {
      setMessageIndex(prev => (prev + 1) % MUSEUM_MESSAGES.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [pending])

  return (
    <form action={formAction} className="w-full max-w-md space-y-4">
      <Textarea
        name="prompt"
        placeholder="Describe the artwork you wish to create..."
        className="min-h-[120px] resize-none"
        disabled={pending}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <Button type="submit" disabled={pending || isEmpty} className="w-full">
        {pending ? <Spinner className="mr-2 h-4 w-4" /> : null}
        {pending ? 'Creation in Progress...' : 'Create Art'}
      </Button>
      {pending && (
        <div className="flex flex-col items-center justify-center space-y-4 py-8">
          <Spinner className="h-12 w-12 text-muted-foreground" />
          <p className="text-lg font-medium text-muted-foreground text-center">
            {MUSEUM_MESSAGES[messageIndex]}
          </p>
        </div>
      )}
    </form>
  )
}