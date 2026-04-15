'use client'

import { useRef, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'

interface ArtDisplayProps {
  imageUrl: string
  audioBase64: string
  script: string
  artworkSize?: number
  onReset: () => void
}

export function ArtDisplay({ imageUrl, audioBase64, script, artworkSize = 70, onReset }: ArtDisplayProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [showPlayButton, setShowPlayButton] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Trigger fade-in animation after mount
    requestAnimationFrame(() => setIsVisible(true))
    
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
    <div 
      className="flex flex-col items-center space-y-6 transition-all duration-700 ease-out"
      style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(16px)' }}
    >
      {/* Gold museum frame */}
      <div className="relative p-6 bg-gradient-to-b from-amber-100 to-amber-50 rounded-lg shadow-2xl mx-auto" style={{ width: `${artworkSize}vw` }}>
        {/* Inner mat (white border) */}
        <div className="p-3 bg-white rounded shadow-inner overflow-hidden">
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
