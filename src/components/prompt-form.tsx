'use client'

import { useState, useEffect, useTransition, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Spinner } from '@/components/spinner'
import { createArt, createArtFromImage } from '@/app/actions'
import { ArtDisplay } from './art-display'
import { validateFile } from './file-utils'

const MUSEUM_MESSAGES = [
  'Creation in Progress, Perfection Pending',
  'Artistry Unfolds, A Moment of Anticipation',
  'The Muse Inspires, Please Remain',
  'Curating Beauty, A Brief Interlude',
]

interface PromptFormProps {
  artworkSize?: number
  onArtworkStateChange?: (isShowing: boolean) => void
}

export function PromptForm({ artworkSize = 70, onArtworkStateChange }: PromptFormProps) {
  const [formKey, setFormKey] = useState(0)
  const [state, setState] = useState<{ success: boolean; error?: string; imageUrl?: string; audioBase64?: string; script?: string } | null>(null)
  const [pending, startTransition] = useTransition()
  const [prompt, setPrompt] = useState('')
  const [messageIndex, setMessageIndex] = useState(0)
  const [showResult, setShowResult] = useState(false)

  // Image upload state
  const [imageData, setImageData] = useState<string | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [imageError, setImageError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const isEmpty = imageData ? false : prompt.trim().length === 0

  // File validation and processing
  const processFile = (file: File) => {
    const validation = validateFile({ type: file.type, size: file.size })
    if (!validation.valid) {
      setImageError(validation.error)
      return
    }

    // Create preview URL
    const previewUrl = URL.createObjectURL(file)
    setImagePreview(previewUrl)

    // Read as base64 data URI
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      setImageData(result)
    }
    reader.readAsDataURL(file)
  }

  // Drag handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    setImageError(null)

    const file = e.dataTransfer.files[0]
    if (file) {
      processFile(file)
    }
  }

  // Click-to-upload handler
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageError(null)
      processFile(file)
    }
  }

  // Clear image and return to text mode
  const clearImage = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview)
    }
    setImagePreview(null)
    setImageData(null)
    setImageError(null)
  }

  // Cleanup object URL on unmount
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview)
      }
    }
  }, [imagePreview])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    setState(null)
    setShowResult(false)
    setImageError(null)

    startTransition(async () => {
      let result
      if (imageData) {
        // Image mode — call createArtFromImage
        formData.set('image', imageData)
        formData.set('mimeType', imageData.split(';')[0].split(':')[1])
        result = await createArtFromImage(formData)
      } else {
        // Text mode — call createArt
        result = await createArt(formData)
      }
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
      onArtworkStateChange?.(true)
    }
  }, [state, onArtworkStateChange])

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
          clearImage()
          setState(null)
          setShowResult(false)
          setFormKey(prev => prev + 1)
          onArtworkStateChange?.(false)
        }}
      />
    )
  }

  return (
    <form key={formKey} onSubmit={handleSubmit} className="space-y-6">
      {/* Input area — textarea or image preview */}
      <div className="space-y-2 relative">
        <label htmlFor="prompt" className="sr-only">
          Describe your artwork
        </label>

        {imagePreview ? (
          /* Image preview with simplified gallery frame */
          <div className="relative">
            <div className="relative bg-white/80 rounded-xl shadow-lg shadow-stone-200/50 border border-stone-200/60 p-3">
              <img
                src={imagePreview}
                alt="Uploaded image preview"
                className="w-full h-auto max-h-[300px] object-contain rounded-lg"
              />
            </div>

            {/* X button to clear */}
            <button
              type="button"
              onClick={clearImage}
              className="absolute -top-2 -right-2 w-6 h-6 bg-stone-800 hover:bg-stone-700 text-white rounded-full flex items-center justify-center shadow-md transition-colors"
              aria-label="Remove image"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ) : (
          /* Textarea with drop zone overlay */
          <>
            <Textarea
              id="prompt"
              name="prompt"
              placeholder="Describe the artwork you wish to create..."
              className="min-h-[140px] resize-none bg-transparent border-stone-300 text-stone-800 placeholder:text-stone-400 focus:border-stone-500 focus:ring-stone-500/20 rounded-xl py-4 px-4 text-base leading-relaxed"
              disabled={pending}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />

            {/* Drop zone overlay */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`absolute inset-0 rounded-xl transition-all duration-200 cursor-pointer
                ${isDragging
                  ? 'bg-amber-50/80 border-2 border-dashed border-amber-400 ring-2 ring-amber-200/50'
                  : 'bg-transparent'
                }
              `}
            >
              {isDragging && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex flex-col items-center space-y-2">
                    <svg className="w-8 h-8 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span className="text-sm text-amber-600 font-medium">Drop image here</span>
                  </div>
                </div>
              )}
            </div>

            {/* Hidden file input for click-to-upload */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleFileInput}
              className="hidden"
            />
          </>
        )}
      </div>

      {/* Error message */}
      {(state?.error || imageError) && (
        <p className="text-sm text-red-600 text-center">{state?.error || imageError}</p>
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
          <span>{imageData ? 'Analyze art' : 'Create Art'}</span>
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
