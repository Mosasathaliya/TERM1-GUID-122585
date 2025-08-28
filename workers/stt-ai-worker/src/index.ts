export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    if (request.method === 'POST') {
      try {
        const body = await request.json();
        const { audio, lesson, goal } = body;

        // Convert speech to text using AI models
        const sttContent = await generateSTTContent(audio, lesson, goal, env.AI);

        return new Response(JSON.stringify(sttContent), {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        });
      } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to convert speech to text' }), {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        });
      }
    }

    return new Response('STT AI Worker - Use POST /generate-stt', {
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    });
  },
};

async function generateSTTContent(audio: string, lesson: string, goal: string, ai: any) {
  try {
    // Convert speech to text using AI
    const response = await ai.run('@cf/openai/whisper', {
      audio: audio,
      model: 'whisper-1',
      language: 'en' // Can be made dynamic based on lesson
    });

    return {
      text: response.text,
      language: response.language,
      lesson: lesson,
      goal: goal,
      confidence: response.confidence || 0.9
    };
  } catch (error) {
    console.error('Error converting speech to text:', error);
    // Return fallback content
    return {
      text: "Could not convert speech to text",
      language: "en",
      lesson: lesson,
      goal: goal,
      confidence: 0.0,
      fallback: "STT conversion failed"
    };
  }
}

interface Env {
  AI: any;
}
