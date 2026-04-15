# Phase 4: Audio Experience

## Summary
Add background music with smooth fade effects and mute control to enhance the gallery experience. When artwork is revealed, ambient music fades in over 1 second. When "Create Another" is clicked, music fades out over 1 second. A mute button provides user control.

## Requirements
- **AUD-01**: Background music plays and loops when artwork is revealed
- **AUD-02**: Music fades in over 1 second on reveal
- **AUD-03**: Music fades out over 1 second on "Create Another"
- **AUD-04**: Mute button in bottom corner while music playing

## Files Modified
- `src/components/art-display.tsx` — Add background music player and mute button
- `src/hooks/use-background-music.ts` — New hook for audio management with fade effects
- `src/components/ui/mute-button.tsx` — New mute button component

## Implementation Plan

### Step 1: Create useBackgroundMusic Hook
Create a custom hook that manages the background music lifecycle:
- Accepts a boolean `isPlaying` to control playback
- Handles fade-in/fade-out with configurable duration (default 1000ms)
- Uses HTML5 Audio API with `volume` property for smooth fades
- Implements `requestAnimationFrame` for smooth volume transitions
- Provides `isMuted` state and `toggleMute` function
- Cleans up audio on unmount

### Step 2: Create MuteButton Component
Create a simple, elegant mute button:
- Uses Lucide icons (Volume2/VolumeX)
- Positioned fixed in bottom-right corner
- Only visible when music is playing
- Smooth opacity transition on hover
- Accessible with proper ARIA labels

### Step 3: Integrate into ArtDisplay
Modify ArtDisplay to:
- Import and use the `useBackgroundMusic` hook
- Pass `isPlaying={true}` when component mounts
- Pass `isPlaying={false}` before calling `onReset`
- Render the MuteButton component
- Ensure narration audio and background music don't conflict

## Technical Details

### Fade Implementation
```typescript
// Smooth fade using requestAnimationFrame
const fadeAudio = (audio: HTMLAudioElement, targetVolume: number, duration: number) => {
  const startVolume = audio.volume;
  const startTime = performance.now();
  
  const animate = (currentTime: number) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Ease-out curve for natural fade
    const eased = 1 - Math.pow(1 - progress, 3);
    audio.volume = startVolume + (targetVolume - startVolume) * eased;
    
    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  };
  
  requestAnimationFrame(animate);
};
```

### Audio Management
- Background music: `/background_music.mp3` (loops)
- Narration: Base64 audio from API response
- Both can play simultaneously (background + narration)
- Mute only affects background music, not narration

## Edge Cases
1. **Autoplay blocked**: Browser may block autoplay. Solution: Start muted, fade in after user interaction
2. **Multiple creates**: Each "Create Another" should fade out, then new artwork fades in fresh
3. **Fast clicking**: Prevent overlapping fades by canceling previous animation frames
4. **Mobile considerations**: Volume APIs may behave differently on mobile browsers

## Success Criteria
- [ ] Background music plays when artwork is revealed
- [ ] Music fades in smoothly over ~1 second
- [ ] Music fades out smoothly over ~1 second on reset
- [ ] Mute button appears in bottom corner
- [ ] Mute button toggles background music on/off
- [ ] Narration audio plays independently of background music
- [ ] No audio glitches or pops during transitions
- [ ] Works across modern browsers (Chrome, Firefox, Safari)
