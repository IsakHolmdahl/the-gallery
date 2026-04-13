import { z } from 'zod'

export const envSchema = z.object({
  OPENAI_API_KEY: z.string().min(1, 'OPENAI_API_KEY is required'),
  OPENAI_IMAGE_MODEL: z.string().default('dall-e-3'),
  OPENAI_SCRIPT_MODEL: z.string().default('gpt-4o'),
  ELEVEN_LABS_API_KEY: z.string().min(1, 'ELEVEN_LABS_API_KEY is required'),
  ELEVEN_LABS_VOICE_ID: z.string().default('azo'),
})

// Parse and validate at startup — throws if invalid
export const env = envSchema.parse(process.env)