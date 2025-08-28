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
        const body = await request.json() as { text: string; lesson: string; goal: string };
        const { text, lesson, goal } = body;

        // Generate TTS using AI models with proper fallback
        const ttsContent = await generateTTSContent(text, lesson, goal, env.AI);

        return new Response(JSON.stringify(ttsContent), {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return new Response(JSON.stringify({ 
          success: false,
          error: 'Failed to generate TTS content',
          details: errorMessage 
        }), {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        });
      }
    }

    return new Response('TTS AI Worker - Use POST /generate-tts', {
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    });
  },
};

async function generateTTSContent(text: string, lesson: string, goal: string, ai: any) {
  try {
    // Try different TTS models in order with proper error handling
    let response;
    let modelUsed = '';
    
    console.log('Starting TTS generation for text:', text);
    
    try {
      // First try: MeloTTS (high-quality multi-lingual)
      console.log('Trying MeloTTS...');
      response = await ai.run('@cf/myshell-ai/melotts', { 
        text: text || "Hello",
        voice: "en_female_1" // English female voice
      });
      modelUsed = 'MeloTTS';
      console.log('MeloTTS response:', response);
      
      // Check if we have audio data
      if (response && (response.audio || response.audio_url || response.audio_data)) {
        console.log('MeloTTS success, audio found');
        return {
          success: true,
          audioUrl: response.audio || response.audio_url || response.audio_data,
          text: text,
          lesson: lesson,
          goal: goal,
          model: modelUsed
        };
      } else {
        console.log('MeloTTS no audio in response');
      }
    } catch (error) {
      console.log('MeloTTS failed:', error);
    }

    try {
      // Second try: Aura-1 (context-aware TTS)
      console.log('Trying Aura-1...');
      response = await ai.run('@cf/deepgram/aura-1', { 
        text: text || "Hello",
        voice: "nova" // Natural voice
      });
      modelUsed = 'Aura-1';
      console.log('Aura-1 response:', response);
      
      if (response && (response.audio || response.audio_url || response.audio_data)) {
        console.log('Aura-1 success, audio found');
        return {
          success: true,
          audioUrl: response.audio || response.audio_url || response.audio_data,
          text: text,
          lesson: lesson,
          goal: goal,
          model: modelUsed
        };
      } else {
        console.log('Aura-1 no audio in response');
      }
    } catch (error) {
      console.log('Aura-1 failed:', error);
    }

    // If all models fail, return detailed error
    console.error('All TTS models failed to generate audio');
    return {
      success: false,
      audioUrl: null,
      text: text,
      lesson: lesson,
      goal: goal,
      error: 'All TTS models failed to generate audio',
      details: 'No working TTS model found',
      models_tried: ['MeloTTS', 'Aura-1'],
      fallback: `TTS generation failed for: ${text}`
    };

  } catch (error) {
    console.error('TTS generation error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return {
      success: false,
      audioUrl: null,
      text: text,
      lesson: lesson,
      goal: goal,
      error: errorMessage,
      fallback: `TTS generation failed for: ${text}`
    };
  }
}

interface Env {
  AI: any;
}
