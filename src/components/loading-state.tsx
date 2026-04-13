'use client'

import { useState, useEffect } from 'react'
import { Spinner } from '@/components/spinner'

const MUSEUM_MESSAGES = [
  'Creation in Progress, Perfection Pending',
  'Artistry Unfolds, A Moment of Anticipation',
  'The Muse Inspires, Please Remain',
  'Curating Beauty, A Brief Interlude',
]

export function LoadingState() {
  const [message, setMessage] = useState(MUSEUM_MESSAGES[0])

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
    <div className="flex flex-col items-center justify-center py-8 space-y-4">
      <Spinner className="h-10 w-10 text-stone-400" />
      <p className="text-sm text-stone-500 text-center italic tracking-wide">
        {message}
      </p>
    </div>
  )
}
