'use client'

import { useRef, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'

interface ArtDisplayProps {
  imageUrl: string
  audioBase64: string
  script: string
  onReset: () => void
}

export function ArtDisplay({ imageUrl, audioBase64, script, onReset }: ArtDisplayProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [showPlayButton, setShowPlayButton] = useState(false)

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.play()
        .then(() => setShowPlayButton(false))
        .catch(() => {
          // Autoplay blocked - show fallback button
          setShowPlayButton(true)
        })
    }
  }, [audioBase64])

  const handlePlayNarration = () => {
    if (audioRef.current) {
      audioRef.current.play()
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Gold museum frame */}
      <div className="relative p-6 bg-gradient-to-b from-amber-100 to-amber-50 rounded-lg shadow-2xl">
        {/* Inner mat (white border) */}
        <div className="p-3 bg-white rounded shadow-inner">
          <img 
            src={imageUrl} 
            alt="Generated artwork" 
            className="w-full h-auto rounded-sm"
          />
        </div>
      </div>

      {/* Hidden audio player */}
      <audio 
        ref={audioRef}
        src={`data:audio/mp3;base64,${audioBase64}`}
      />

      {/* Fallback Play Narration button (shown if autoplay blocked) */}
      {showPlayButton && (
        <Button 
          onClick={handlePlayNarration}
          variant="default"
          className="w-full"
        >
          ▶ Play Narration
        </Button>
      )}

      {/* Create another button */}
      <Button 
        onClick={onReset}
        variant="outline"
        className="w-full"
      >
        Create Another
      </Button>
    </div>
  )
}
