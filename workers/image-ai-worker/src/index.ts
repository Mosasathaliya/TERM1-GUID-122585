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
        const body = await request.json() as { prompt: string; lesson: string; goal: string };
        const { prompt, lesson, goal } = body;

        // Enhanced prompt for better image generation
        const imagePrompt = `Educational illustration for lesson: ${lesson}
        Learning goal: ${goal}
        Description: ${prompt}
        
        Simple, clear, beginner-friendly drawing. High quality, colorful, engaging.`;

        console.log('Generating image with prompt:', imagePrompt);

        // Try multiple models with proper response handling
        let response;
        let modelUsed = '';
        
        try {
          // First try: Stability AI (most reliable)
          console.log('Trying Stability AI...');
          response = await env.AI.run('@cf/stabilityai/stable-diffusion-xl-base-1.0', {
            prompt: imagePrompt,
            num_steps: 20,
            guidance_scale: 7.5
          });
          modelUsed = 'Stability AI';
          
          // Check if we have a valid image response
          if (response && response.images && response.images[0]) {
            console.log('Stability AI success, image size:', response.images[0].length);
            return new Response(response.images[0], {
              headers: {
                'content-type': 'image/png',
                'Access-Control-Allow-Origin': '*',
              },
            });
          }
        } catch (error) {
          console.log('Stability AI failed:', error);
        }

        try {
          // Second try: Bytedance alternative
          console.log('Trying Bytedance...');
          response = await env.AI.run('@cf/bytedance/stable-diffusion-xl-base-1.0', {
            prompt: imagePrompt,
            num_steps: 20,
            guidance_scale: 7.5
          });
          modelUsed = 'Bytedance';
          
          if (response && response.images && response.images[0]) {
            console.log('Bytedance success, image size:', response.images[0].length);
            return new Response(response.images[0], {
              headers: {
                'content-type': 'image/png',
                'Access-Control-Allow-Origin': '*',
              },
            });
          }
        } catch (error) {
          console.log('Bytedance failed:', error);
        }

        try {
          // Third try: Dreamshaper
          console.log('Trying Dreamshaper...');
          response = await env.AI.run('@cf/lykon/dreamshaper-8', {
            prompt: imagePrompt,
            num_steps: 20,
            guidance_scale: 7.5
          });
          modelUsed = 'Dreamshaper';
          
          if (response && response.images && response.images[0]) {
            console.log('Dreamshaper success, image size:', response.images[0].length);
            return new Response(response.images[0], {
              headers: {
                'content-type': 'image/png',
                'Access-Control-Allow-Origin': '*',
              },
            });
          }
        } catch (error) {
          console.log('Dreamshaper failed:', error);
        }

        // If all models fail, return detailed error
        console.error('All image models failed');
        return new Response(JSON.stringify({ 
          success: false,
          error: 'All image generation models failed',
          details: 'No working image model found',
          models_tried: ['Stability AI', 'Bytedance', 'Dreamshaper'],
          prompt: imagePrompt
        }), {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        });
      } catch (error) {
        console.error('Image generation error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return new Response(JSON.stringify({ 
          success: false,
          error: 'Failed to generate image content',
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

    return new Response('Image AI Worker - Use POST /generate-image', {
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    });
  },
};

interface Env {
  AI: any;
}
