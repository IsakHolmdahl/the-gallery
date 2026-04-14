'use client'

import { useState, useEffect, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Spinner } from '@/components/spinner'
import { createArt } from '@/app/actions'
import { ArtDisplay } from './art-display'

const MUSEUM_MESSAGES = [
  'Creation in Progress, Perfection Pending',
  'Artistry Unfolds, A Moment of Anticipation',
  'The Muse Inspires, Please Remain',
  'Curating Beauty, A Brief Interlude',
]

interface PromptFormProps {
  artworkSize?: number
}

export function PromptForm({ artworkSize = 70 }: PromptFormProps) {
  const [formKey, setFormKey] = useState(0)
  const [state, setState] = useState<{ success: boolean; error?: string; imageUrl?: string; audioBase64?: string; script?: string } | null>(null)
  const [pending, startTransition] = useTransition()
  const [prompt, setPrompt] = useState('')
  const [messageIndex, setMessageIndex] = useState(0)
  const [showResult, setShowResult] = useState(false)

  const isEmpty = prompt.trim().length === 0

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    setState(null)
    setShowResult(false)
    startTransition(async () => {
      const result = await createArt(formData)
      setState(result)
    })
  }

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

  // Show result when success state arrives
  useEffect(() => {
    if (state?.success && state?.imageUrl && state?.audioBase64 && state?.script) {
      setShowResult(true)
    }
  }, [state])

  // Handle successful result
  const result = showResult && state?.success && state?.imageUrl && state?.audioBase64 && state?.script
    ? { imageUrl: state.imageUrl, audioBase64: state.audioBase64, script: state.script }
    : null

  if (result) {
    return (
      <ArtDisplay
        imageUrl={result.imageUrl}
        audioBase64={result.audioBase64}
        script={result.script}
        artworkSize={artworkSize}
        onReset={() => {
          setState(null)
          setShowResult(false)
          setFormKey(prev => prev + 1)
        }}
      />
    )
  }

  return (
    <form key={formKey} onSubmit={handleSubmit} className="space-y-6">
      {/* Elegant textarea */}
      <div className="space-y-2">
        <label htmlFor="prompt" className="sr-only">
          Describe your artwork
        </label>
        <Textarea
          id="prompt"
          name="prompt"
          placeholder="Describe the artwork you wish to create..."
          className="min-h-[140px] resize-none bg-transparent border-stone-300 text-stone-800 placeholder:text-stone-400 focus:border-stone-500 focus:ring-stone-500/20 rounded-xl py-4 px-4 text-base leading-relaxed"
          disabled={pending}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
      </div>

      {/* Error message */}
      {state?.error && (
        <p className="text-sm text-red-600 text-center">{state.error}</p>
      )}

      {/* Elegant submit button */}
      <Button 
        type="submit" 
        disabled={pending || isEmpty} 
        className="w-full h-12 bg-stone-900 hover:bg-stone-800 text-white font-medium tracking-wide rounded-xl transition-all duration-200 disabled:bg-stone-200 disabled:text-stone-500"
      >
        {pending ? (
          <>
            <Spinner className="mr-3 h-4 w-4" />
            <span>Creation in Progress...</span>
          </>
        ) : (
          <span>Create Art</span>
        )}
      </Button>

      {/* Loading state with museum messages */}
      {pending && (
        <div className="flex flex-col items-center justify-center py-8 space-y-4">
          <Spinner className="h-10 w-10 text-stone-400" />
          <p className="text-sm text-stone-500 text-center italic tracking-wide">
            {MUSEUM_MESSAGES[messageIndex]}
          </p>
        </div>
      )}
    </form>
  )
}
