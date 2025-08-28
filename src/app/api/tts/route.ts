import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { text, voice = 'en-US-Neural2-F' } = await request.json();

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    // Check if API key is available
    const apiKey = process.env.CLOUDFLARE_API_KEY || 'VDFyQyM2GDJ9L4cTQf8kXMjSp4VoiueUonsObued';
    
    if (!apiKey) {
      return NextResponse.json({ error: 'Cloudflare API key not configured' }, { status: 500 });
    }

    console.log('TTS Request:', { text, voice, apiKey: apiKey.substring(0, 10) + '...' });

    // Use a known working Cloudflare AI model for text generation first
    // Then we'll implement a fallback TTS solution
    let response;
    let endpointUsed = '';
    
    try {
      // Try using a known working model first to test the API connection
      endpointUsed = 'Text generation test';
      response = await fetch('https://api.cloudflare.com/client/v4/ai/run/@cf/meta/llama-3.1-8b-instruct', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: `Convert this text to simple English pronunciation: "${text}"`,
          max_tokens: 50,
          temperature: 0.1
        }),
      });
      
      if (response.ok) {
        console.log('Success with text generation model');
        const result = await response.json();
        console.log('Text generation result:', result);
        
        // For now, return the text result since TTS model might not be available
        return NextResponse.json({ 
          success: true, 
          text: result.result?.response || text,
          message: 'Text generated successfully. TTS model not available yet.',
          endpoint: endpointUsed
        });
        
      } else {
        throw new Error(`Text generation failed: ${response.status}`);
      }
    } catch (error) {
      console.log('Text generation failed:', error);
      
      // Try alternative endpoint format
      try {
        endpointUsed = 'Alternative endpoint';
        response = await fetch('https://api.cloudflare.com/ai/run/@cf/meta/llama-3.1-8b-instruct', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt: `Convert this text to simple English pronunciation: "${text}"`,
            max_tokens: 50,
            temperature: 0.1
          }),
        });
        
        if (response.ok) {
          console.log('Success with alternative endpoint');
          const result = await response.json();
          return NextResponse.json({ 
            success: true, 
            text: result.result?.response || text,
            message: 'Text generated successfully with alternative endpoint.',
            endpoint: endpointUsed
          });
        } else {
          throw new Error(`Alternative endpoint failed: ${response.status}`);
        }
      } catch (error2) {
        console.log('All endpoints failed:', error2);
        
        // Return a helpful error message
        return NextResponse.json({ 
          error: 'Cloudflare AI API connection failed. Please check your API key and account setup.',
          details: 'Try visiting https://dash.cloudflare.com/profile/api-tokens to verify your API token',
          status: 'failed',
          endpoint: endpointUsed
        }, { status: 500 });
      }
    }

  } catch (error) {
    console.error('TTS Error:', error);
    return NextResponse.json(
      { error: 'Failed to process request', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
