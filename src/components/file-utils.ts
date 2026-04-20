const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/webp']
const MAX_SIZE_BYTES = 10 * 1024 * 1024 // 10MB

export const COMPRESSION_THRESHOLD = 4 * 1024 * 1024 // 4MB

const MAX_DIMENSION = 2048
const JPEG_QUALITY = 0.85

/**
 * Compresses an image file using the Canvas API.
 * Scales down to max 2048px on the longer side and encodes as JPEG at 0.85 quality.
 * Returns a new File with the compressed image.
 */
export async function compressImage(file: File): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const objectUrl = URL.createObjectURL(file)

    img.onload = () => {
      URL.revokeObjectURL(objectUrl)

      let { width, height } = img
      if (width <= MAX_DIMENSION && height <= MAX_DIMENSION) {
        // No resize needed, just re-encode
      } else if (width > height) {
        height = Math.round((height / width) * MAX_DIMENSION)
        width = MAX_DIMENSION
      } else {
        width = Math.round((width / height) * MAX_DIMENSION)
        height = MAX_DIMENSION
      }

      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        reject(new Error('Failed to get canvas context'))
        return
      }
      ctx.drawImage(img, 0, 0, width, height)

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Canvas toBlob failed'))
            return
          }
          const compressedFile = new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), {
            type: 'image/jpeg',
            lastModified: Date.now(),
          })
          resolve(compressedFile)
        },
        'image/jpeg',
        JPEG_QUALITY
      )
    }

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      reject(new Error('Failed to load image for compression'))
    }

    img.src = objectUrl
  })
}

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
