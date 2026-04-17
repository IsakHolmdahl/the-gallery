import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { resolve } from 'path'

describe('drop zone glow animation', () => {
  const css = readFileSync(resolve(__dirname, '../app/globals.css'), 'utf-8')

  it('defines @keyframes drop-glow in globals.css', () => {
    expect(css).toMatch(/@keyframes\s+drop-glow/)
  })

  it('defines .drop-zone-glow class with animation', () => {
    expect(css).toMatch(/\.drop-zone-glow/)
    expect(css).toMatch(/animation:\s*drop-glow/)
  })

  it('uses amber tones in the glow keyframes', () => {
    // Should reference amber color values (rgba with amber hue)
    expect(css).toMatch(/rgba\(\s*245\s*,\s*158\s*,\s*11/)
  })
})
