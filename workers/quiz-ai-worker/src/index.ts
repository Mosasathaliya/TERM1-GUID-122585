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

        // Generate quiz content using AI models
        const quizContent = await generateQuizContent(lesson, goal, env.AI);

        return new Response(JSON.stringify(quizContent), {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        });
      } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to generate quiz content' }), {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        });
      }
    }

    return new Response('Quiz AI Worker - Use POST /generate-quiz', {
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    });
  },
};

async function generateQuizContent(lesson: string, goal: string, ai: any) {
  try {
    // Generate quiz question using AI
    const prompt = `Generate 1 final quiz question for lesson: ${lesson}
    Learning goal: ${goal}
    
    Create a challenging but fair question with explanation.
    Format as JSON:
    {
      "question": "Question text?",
      "arabicQuestion": "نص السؤال؟",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "Option A",
      "explanation": "Why this is correct"
    }`;

    const response = await ai.run('@cf/meta/llama-3.3-70b-instruct', {
      prompt: prompt,
      max_tokens: 600,
      temperature: 0.7
    });

    // Parse AI response
    let quizData;
    try {
      quizData = JSON.parse(response.response);
    } catch {
      // Fallback quiz if AI fails
      quizData = {
        question: "What is the correct answer?",
        arabicQuestion: "ما هي الإجابة الصحيحة؟",
        options: ["A", "B", "C", "D"],
        correctAnswer: "A",
        explanation: "This is the correct answer because..."
      };
    }

    return quizData;
  } catch (error) {
    console.error('Error generating quiz content:', error);
    // Return fallback content
    return {
      question: "What is the correct answer?",
      arabicQuestion: "ما هي الإجابة الصحيحة؟",
      options: ["A", "B", "C", "D"],
      correctAnswer: "A",
      explanation: "This is the correct answer because..."
    };
  }
}

interface Env {
  AI: any;
}
