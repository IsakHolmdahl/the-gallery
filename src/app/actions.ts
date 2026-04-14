"use server";

import OpenAI from "openai";
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
import { env } from "@/lib/env";
import { maxDuration } from "./config";

const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });
const elevenlabs = new ElevenLabsClient({ apiKey: env.ELEVEN_LABS_API_KEY });

const DOCENT_SYSTEM_PROMPT = `You are the distinguished curator of a renowned art museum. 
Write a formal docent narration (30-60 seconds when spoken aloud) that introduces and 
explains an artwork to gallery visitors. Use formal, elegant language. Focus on artistic 
technique, historical context, and emotional impact. Begin immediately - no preamble.
Include the intent of the artist, the emotions the artwork evokes, and any relevant historical or cultural context.`;

async function collectStream(
  stream: ReadableStream<Uint8Array>,
): Promise<string> {
  const reader = stream.getReader();
  const chunks: Buffer[] = [];
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(Buffer.from(value));
  }
  const buffer = Buffer.concat(chunks);
  return buffer.toString("base64");
}

export async function createArt(
  formData: FormData,
): Promise<{
  success: boolean;
  imageUrl?: string;
  audioBase64?: string;
  script?: string;
  error?: string;
}> {
  try {
    const prompt = formData.get("prompt") as string;

    if (!prompt || prompt.trim().length === 0) {
      return {
        success: false,
        error: "Please enter a prompt to generate artwork.",
      };
    }

    // Step 1: Generate image (sequential - first)
    const imageResponse = await openai.images.generate({
      model: env.OPENAI_IMAGE_MODEL,
      prompt,
      n: 1,
      size: "1792x1024",
    });

    // Handle both URL and base64 response formats
    const imageData = imageResponse.data?.[0];
    if (!imageData) {
      return {
        success: false,
        error: "Failed to generate image. No image data returned.",
      };
    }
    const imageUrl =
      imageData.url || `data:image/png;base64,${imageData.b64_json}`;

    if (!imageUrl) {
      return {
        success: false,
        error: "Failed to generate image. Please try again.",
      };
    }

    // Step 2: Generate script (sequential - after image completes)
    const scriptResponse = await openai.chat.completions.create({
      model: env.OPENAI_SCRIPT_MODEL,
      messages: [
        { role: "system", content: DOCENT_SYSTEM_PROMPT },
        { role: "user", content: `Describe this artwork: ${prompt}` },
      ],
      max_completion_tokens: 500,
    });
    const script = scriptResponse.choices[0].message.content;

    if (!script) {
      return {
        success: false,
        error: "Failed to generate narration script. Please try again.",
      };
    }

    // Step 3: Generate voice (sequential - after script)
    const audioStream = await elevenlabs.textToSpeech.stream(
      env.ELEVEN_LABS_VOICE_ID,
      {
        text: script,
        modelId: "eleven_multilingual_v2",
        outputFormat: "mp3_44100_128",
      },
    );

    const audioBase64 = await collectStream(audioStream);

    return { success: true, imageUrl, audioBase64, script };
  } catch (error) {
    console.error("createArt error:", error);
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred.";
    return { success: false, error: `Generation failed: ${message}` };
  }
}
