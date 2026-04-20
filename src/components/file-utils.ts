const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/webp']
const MAX_SIZE_BYTES = 10 * 1024 * 1024 // 10MB

interface FileValidationInput {
  type: string
  size: number
}

interface FileValidationResult {
  valid: boolean
  error: string | null
}

export function validateFile(file: FileValidationInput): FileValidationResult {
  if (!file.type || !ALLOWED_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: 'Unsupported image format. Please use PNG, JPEG, or WEBP.',
    }
  }

  if (file.size > MAX_SIZE_BYTES) {
    return {
      valid: false,
      error: 'Image too large. Maximum size is 10MB.',
    }
  }

  return { valid: true, error: null }
}
