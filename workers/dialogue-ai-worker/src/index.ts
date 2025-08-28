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
        const { lesson, goal, aiModels } = body;

        // Generate dialogue content using AI models
        const dialogueContent = await generateDialogueContent(lesson, goal, env.AI);

        return new Response(JSON.stringify(dialogueContent), {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        });
      } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to generate dialogue content' }), {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        });
      }
    }

    return new Response('Dialogue AI Worker - Use POST /generate-dialogue', {
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    });
  },
};

async function generateDialogueContent(lesson: string, goal: string, ai: any) {
  try {
    // Generate dialogue using AI
    const prompt = `Generate a short dialogue (4-6 lines) for lesson: ${lesson}
    Learning goal: ${goal}
    
    Create natural conversation in English and Arabic.
    Format as JSON:
    {
      "lines": [
        {
          "english": "Line 1",
          "arabic": "سطر 1"
        },
        {
          "english": "Line 2", 
          "arabic": "سطر 2"
        }
      ]
    }`;

    const response = await ai.run('@cf/meta/llama-3.3-70b-instruct', {
      prompt: prompt,
      max_tokens: 800,
      temperature: 0.7
    });

    // Parse AI response
    let dialogueData;
    try {
      dialogueData = JSON.parse(response.response);
    } catch {
      // Fallback dialogue if AI fails
      dialogueData = {
        lines: [
          { english: "Hello, how are you?", arabic: "مرحبا، كيف حالك؟" },
          { english: "I'm fine, thank you. And you?", arabic: "أنا بخير، شكرا. وأنت؟" },
          { english: "I'm good too. What's your name?", arabic: "أنا بخير أيضا. ما اسمك؟" },
          { english: "My name is Ahmed. Nice to meet you.", arabic: "اسمي أحمد. تشرفت بمقابلتك." }
        ]
      };
    }

    return dialogueData;
  } catch (error) {
    console.error('Error generating dialogue:', error);
    // Return fallback content
    return {
      lines: [
        { english: "Hello, how are you?", arabic: "مرحبا، كيف حالك؟" },
        { english: "I'm fine, thank you.", arabic: "أنا بخير، شكرا لك." }
      ]
    };
  }
}

interface Env {
  AI: any;
}
