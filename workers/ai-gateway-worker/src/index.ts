// Helper function to create consistent responses
function createResponse<T>(data: T, status = 200, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      ...headers
    }
  });
};

// Helper function to handle errors
const handleError = (error: Error, status = 500): Response => {
  console.error('Error in worker:', error);
  return createResponse(
    { success: false, error: error.message, timestamp: Date.now() },
    status
  );
};

// Import types only to avoid conflicts with local functions
import type { LessonRequest } from './types';

// Import only the functions we need that don't conflict with local ones
import { generateLesson, transcribeAudio, moderateContent } from './lesson-generator';

// Generate images using Cloudflare AI
async function generateImage(
  prompt: string,
  lesson: string,
  goal: string,
  ai: { run: (model: string, options: Record<string, unknown>) => Promise<unknown> },
  options: Record<string, unknown> = {}
): Promise<Response> {
  try {
    const imagePrompt = `Educational illustration for lesson: ${lesson}
    Learning goal: ${goal}
    Style: Clean, colorful, and educational
    Content: ${prompt}
    Don't include any text in the image.`;

    const image = await ai.run('@stabilityai/stable-diffusion-xl-base-1.0', {
      prompt: imagePrompt,
      ...options
    });

    if (!(image instanceof Uint8Array)) {
      throw new Error('Expected Uint8Array for image data');
    }

    // Convert Uint8Array to base64 safely
    let binary = '';
    const bytes = new Uint8Array(image);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    const base64Image = btoa(binary);

    return createResponse({
      success: true,
      data: {
        image: `data:image/png;base64,${base64Image}`,
        timestamp: Date.now()
      }
    });
  } catch (error) {
    return handleError(error as Error);
  }
}

// Generate TTS audio
async function generateTTS(
  text: string,
  ai: { run: (model: string, options: Record<string, unknown>) => Promise<unknown> },
  options: Record<string, unknown> = {}
): Promise<Response> {
  try {
    const audio = await ai.run('@myshell-ai/melotts', {
      text,
      voice: 'en-US-Wavenet-D',
      ...options
    });

    if (!(audio instanceof Uint8Array)) {
      throw new Error('Expected Uint8Array for audio data');
    }

    // Convert Uint8Array to base64 safely
    let binary = '';
    const bytes = new Uint8Array(audio);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    const base64Audio = btoa(binary);

    return createResponse({
      success: true,
      data: {
        audio: `data:audio/mp3;base64,${base64Audio}`,
        timestamp: Date.now()
      }
    });
  } catch (error) {
    return handleError(error as Error);
  }
}

// Main worker handler
const worker = {
  async fetch(request: Request, env: Env): Promise<Response> {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Max-Age': '86400',
        },
      });
    }

    // Handle GET requests (health check and info)
    if (request.method === 'GET') {
      return createResponse({
        status: 'operational',
        message: 'Al-Dalil AI Worker - English-Arabic Learning Assistant',
        models: [
          'llama-3.3-70b-instruct-fp8-fast (Main Lesson Generation)',
          'llama-3.2-11b-vision (Bilingual Content)',
          'deepseek-math-7b-instruct (Math & Logic)',
          'stable-diffusion-xl-base-1.0 (Image Generation)',
          'whisper-large-v3-turbo (Speech Recognition)',
          'melotts (Text-to-Speech)',
          'llama-guard-3-8b (Content Safety)'
        ],
        timestamp: Date.now()
      });
    }

    if (request.method === 'POST') {
      try {
        const body: LessonRequest = await request.json();
        const { action, lesson, goal, prompt, text, audio, options } = body;

        console.log(`Processing action: ${action} for lesson: ${lesson}`);

        switch (action) {
          case 'generate-lesson':
            const lessonContent = await generateLesson(lesson, goal, env.AI, options);
            return createResponse({
              success: true,
              data: lessonContent,
              timestamp: Date.now()
            });
            
          case 'generate-vocabulary':
          case 'generate-grammar':
          case 'generate-math':
            // These actions are handled by the lesson generator
            const specificLessonContent = await generateLesson(lesson, goal, env.AI, {
              ...options,
              type: action.replace('generate-', '')
            });
            return createResponse({
              success: true,
              data: specificLessonContent,
              timestamp: Date.now()
            });
            
          case 'generate-image':
            if (!prompt) {
              return createResponse(
                { success: false, error: 'Prompt is required for image generation' },
                400
              );
            }
            return await generateImage(prompt, lesson, goal, env.AI, options);
            
          case 'generate-speech':
            if (!text) {
              return createResponse(
                { success: false, error: 'Text is required for TTS generation' },
                400
              );
            }
            return await generateTTS(text, env.AI, options);
            
          case 'transcribe-audio':
            if (!audio) {
              return createResponse(
                { success: false, error: 'Audio data is required for transcription' },
                400
              );
            }
            const transcription = await transcribeAudio(audio, env.AI, options);
            return createResponse({
              success: true,
              data: transcription,
              timestamp: Date.now()
            });
            
          case 'moderate-content':
            if (!text) {
              return createResponse(
                { success: false, error: 'Text is required for content moderation' },
                400
              );
            }
            const moderation = await moderateContent(text, env.AI);
            return createResponse({
              success: true,
              data: moderation,
              timestamp: Date.now()
            });
            
          default:
            return createResponse({
              success: false,
              error: 'Unknown action',
              availableActions: [
                'generate-lesson',
                'generate-vocabulary',
                'generate-grammar',
                'generate-math',
                'generate-image',
                'generate-speech',
                'transcribe-audio',
                'moderate-content'
              ]
            }, 400);
        }
      } catch (error) {
        return handleError(error as Error);
      }
    }

    return new Response('Method not allowed', { status: 405 });
  }
};

export default worker;

interface Env {
  AI: {
    run: (model: string, options: Record<string, unknown>) => Promise<unknown>;
  };
}
