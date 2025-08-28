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

        // Generate grammar content using AI models
        const grammarContent = await generateGrammarContent(lesson, goal, env.AI);

        return new Response(JSON.stringify(grammarContent), {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        });
      } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to generate grammar content' }), {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        });
      }
    }

    return new Response('Grammar AI Worker - Use POST /generate-grammar', {
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    });
  },
};

async function generateGrammarContent(lesson: string, goal: string, ai: any) {
  try {
    // Generate grammar explanation using AI
    const explanationPrompt = `Explain the grammar rule for lesson: ${lesson}
    Learning goal: ${goal}
    
    Provide clear explanation in English and Arabic.
    Format as JSON:
    {
      "explanation": {
        "english": "English explanation",
        "arabic": "شرح بالعربية"
      }
    }`;

    const explanationResponse = await ai.run('@cf/meta/llama-3.3-70b-instruct', {
      prompt: explanationPrompt,
      max_tokens: 800,
      temperature: 0.7
    });

    // Generate grammar examples using AI
    const examplesPrompt = `Generate 3 grammar examples for lesson: ${lesson}
    Learning goal: ${goal}
    
    Provide examples in English and Arabic.
    Format as JSON:
    {
      "examples": {
        "english": "Example 1\nExample 2\nExample 3",
        "arabic": "مثال 1\nمثال 2\nمثال 3"
      }
    }`;

    const examplesResponse = await ai.run('@cf/meta/llama-3.3-70b-instruct', {
      prompt: examplesPrompt,
      max_tokens: 600,
      temperature: 0.7
    });

    // Parse AI responses
    let explanationData, examplesData;
    try {
      explanationData = JSON.parse(explanationResponse.response);
      examplesData = JSON.parse(examplesResponse.response);
    } catch {
      // Fallback content if AI fails
      explanationData = {
        explanation: {
          english: "Grammar rule explanation",
          arabic: "شرح قاعدة النحو"
        }
      };
      examplesData = {
        examples: {
          english: "Example sentence 1\nExample sentence 2\nExample sentence 3",
          arabic: "جملة مثال 1\nجملة مثال 2\nجملة مثال 3"
        }
      };
    }

    return {
      explanation: explanationData.explanation,
      examples: examplesData.examples
    };
  } catch (error) {
    console.error('Error generating grammar content:', error);
    // Return fallback content
    return {
      explanation: {
        english: "Grammar rule explanation",
        arabic: "شرح قاعدة النحو"
      },
      examples: {
        english: "Example sentence 1\nExample sentence 2\nExample sentence 3",
        arabic: "جملة مثال 1\nجملة مثال 2\nجملة مثال 3"
      }
    };
  }
}

interface Env {
  AI: any;
}
