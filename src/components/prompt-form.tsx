'use client'

import { useActionState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Spinner } from '@/components/spinner'
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
        {pending && <Spinner className="mr-2 h-4 w-4" />}
        {pending ? 'Creation in Progress...' : 'Create Art'}
      </Button>
    </form>
  )
}