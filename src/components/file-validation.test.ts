import { describe, it, expect } from 'vitest'
import { validateFile } from './file-utils'

describe('file validation', () => {
  it('accepts PNG files', () => {
    const result = validateFile({ type: 'image/png', size: 1024 })
    expect(result.valid).toBe(true)
    expect(result.error).toBeNull()
  })

  it('accepts JPEG files', () => {
    const result = validateFile({ type: 'image/jpeg', size: 1024 })
    expect(result.valid).toBe(true)
  })

  it('accepts WEBP files', () => {
    const result = validateFile({ type: 'image/webp', size: 1024 })
    expect(result.valid).toBe(true)
  })

  it('rejects GIF files', () => {
    const result = validateFile({ type: 'image/gif', size: 1024 })
    expect(result.valid).toBe(false)
    expect(result.error).toContain('Unsupported image format')
  })

  it('rejects SVG files', () => {
    const result = validateFile({ type: 'image/svg+xml', size: 1024 })
    expect(result.valid).toBe(false)
  })

  it('rejects files over 10MB', () => {
    const result = validateFile({ type: 'image/png', size: 11 * 1024 * 1024 })
    expect(result.valid).toBe(false)
    expect(result.error).toContain('Maximum size is 10MB')
  })

  it('accepts files at exactly 10MB', () => {
    const result = validateFile({ type: 'image/png', size: 10 * 1024 * 1024 })
    expect(result.valid).toBe(true)
  })

  it('rejects files just over 10MB', () => {
    const result = validateFile({ type: 'image/png', size: 10 * 1024 * 1024 + 1 })
    expect(result.valid).toBe(false)
  })

  it('rejects files with no type', () => {
    const result = validateFile({ type: '', size: 1024 })
    expect(result.valid).toBe(false)
  })
})
