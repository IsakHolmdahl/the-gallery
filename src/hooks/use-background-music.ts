"use client";

import { useRef, useEffect, useState, useCallback } from "react";

interface UseBackgroundMusicOptions {
  src: string;
  isPlaying: boolean;
  fadeDuration?: number;
  loop?: boolean;
}

interface UseBackgroundMusicReturn {
  isMuted: boolean;
  toggleMute: () => void;
  isReady: boolean;
}

export function useBackgroundMusic({
  src,
  isPlaying,
  fadeDuration = 1000,
  loop = true,
}: UseBackgroundMusicOptions): UseBackgroundMusicReturn {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isReady, setIsReady] = useState(false);

  // Initialize audio element
  useEffect(() => {
    const audio = new Audio(src);
    audio.loop = loop;
    audio.volume = 0;
    audioRef.current = audio;

    audio.addEventListener("canplaythrough", () => setIsReady(true));

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      audio.pause();
      audio.src = "";
      audioRef.current = null;
    };
  }, [src, loop]);

  // Smooth fade function
  const fadeAudio = useCallback(
    (targetVolume: number, duration: number, onComplete?: () => void) => {
      const audio = audioRef.current;
      if (!audio) return;

      // Cancel any ongoing fade
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      const startVolume = audio.volume;
      const startTime = performance.now();

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease-out cubic for natural fade
        const eased = 1 - Math.pow(1 - progress, 3);
        // Clamp to [0, 1] to avoid floating point precision errors
        audio.volume = Math.max(
          0,
          Math.min(1, startVolume + (targetVolume - startVolume) * eased),
        );

        if (progress < 1) {
          animationFrameRef.current = requestAnimationFrame(animate);
        } else {
          animationFrameRef.current = null;
          onComplete?.();
        }
      };

      animationFrameRef.current = requestAnimationFrame(animate);
    },
    [],
  );

  // Handle play/pause with fade
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !isReady) return;

    if (isPlaying && !isMuted) {
      // Start playing (muted initially to avoid pop)
      audio.play().catch(() => {
        // Autoplay blocked - will need user interaction
        console.log("Background music autoplay blocked");
      });
      // Fade in
      fadeAudio(0.25, fadeDuration);
    } else if (isPlaying && isMuted) {
      // Playing but muted
      audio.play().catch(() => {});
      audio.volume = 0;
    } else {
      // Fade out and pause
      fadeAudio(0, fadeDuration, () => {
        audio.pause();
        audio.currentTime = 0;
      });
    }
  }, [isPlaying, isReady, isMuted, fadeDuration, fadeAudio]);

  // Handle mute toggle
  const toggleMute = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    setIsMuted((prev) => {
      const newMuted = !prev;
      if (audio && isPlaying) {
        if (newMuted) {
          // Fade to mute
          fadeAudio(0, 300);
        } else {
          // Fade to unmute
          fadeAudio(1, 300);
        }
      }
      return newMuted;
    });
  }, [isPlaying, fadeAudio]);

  return { isMuted, toggleMute, isReady };
}
