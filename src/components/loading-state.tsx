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
    <div className="flex flex-col items-center justify-center space-y-4 py-12">
      <Spinner className="h-12 w-12 text-muted-foreground" />
      <p className="text-lg font-medium text-muted-foreground text-center">
        {message}
      </p>
    </div>
  )
}