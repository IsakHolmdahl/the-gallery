"use client";

import { useState } from "react";
import { PromptForm } from "@/components/prompt-form";
import { MuteButton } from "@/components/ui/mute-button";
import { useBackgroundMusic } from "@/hooks/use-background-music";

interface GalleryContentProps {
  artworkSize: number;
}

export function GalleryContent({ artworkSize }: GalleryContentProps) {
  const [isArtworkShowing, setIsArtworkShowing] = useState(false);

  // Background music with fade effects
  const {
    isMuted,
    toggleMute,
    isReady: musicReady,
  } = useBackgroundMusic({
    src: "/background_music.mp3",
    isPlaying: isArtworkShowing,
    fadeDuration: 1000,
    loop: true,
  });

  return (
    <main className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 pt-12 pb-20">
      {/* Elegant header */}
      <header className="text-center mb-16">
        <h1 className="text-6xl md:text-7xl font-serif tracking-tight text-stone-900 mb-4">
          The Gallery
        </h1>
        <p className="text-lg md:text-xl text-stone-500 tracking-widest uppercase">
          Curate your vision
        </p>
      </header>

      {/* Gallery-style presentation for the form */}
      <div className={`w-full ${isArtworkShowing ? '' : 'max-w-xl'}`}>
        {/* Elegant frame/border treatment */}
        <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl shadow-stone-200/50 border border-stone-200/60 p-8 md:p-10">
          {/* Inner frame line for gallery feel */}
          <div className="absolute inset-2 rounded-xl border border-stone-300/40 pointer-events-none" />

          <PromptForm
            artworkSize={artworkSize}
            onArtworkStateChange={setIsArtworkShowing}
          />
        </div>
      </div>

      {/* Subtle footer */}
      <footer className="absolute bottom-8 text-center">
        <p className="text-xs text-stone-400 tracking-widest uppercase">
          An ephemeral experience
        </p>
      </footer>

      {/* Mute button for background music - fixed to viewport */}
      <MuteButton
        isMuted={isMuted}
        onToggle={toggleMute}
        visible={musicReady && isArtworkShowing}
      />
    </main>
  );
}
