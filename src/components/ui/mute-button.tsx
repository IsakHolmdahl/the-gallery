'use client'

import { Volume2, VolumeX } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface MuteButtonProps {
  isMuted: boolean
  onToggle: () => void
  visible: boolean
}

export function MuteButton({ isMuted, onToggle, visible }: MuteButtonProps) {
  return (
    <div
      className="fixed bottom-6 right-6 z-50 transition-all duration-300"
      style={{
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? 'auto' : 'none',
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
      }}
    >
      <Button
        onClick={onToggle}
        variant="ghost"
        size="icon"
        className="h-12 w-12 rounded-full bg-stone-900/80 hover:bg-stone-900 text-white backdrop-blur-sm shadow-lg border border-stone-700/50"
        aria-label={isMuted ? 'Unmute background music' : 'Mute background music'}
      >
        {isMuted ? (
          <VolumeX className="h-5 w-5" />
        ) : (
          <Volume2 className="h-5 w-5" />
        )}
      </Button>
    </div>
  )
}
