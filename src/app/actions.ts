'use server'

export async function createArt(
  prevState: { success: boolean } | null,
  formData: FormData
) {
  // Simulate generation time (Phase 2 will do real work)
  await new Promise(resolve => setTimeout(resolve, 3000))
  return { success: true }
}