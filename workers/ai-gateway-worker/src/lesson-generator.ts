import { LessonOptions } from './types';

interface AIInterface {
  run(modelName: string, options: Record<string, unknown>): Promise<unknown>;
}

export interface WordInfo {
  word: string;
  translation: string;
  ttsAudio?: string;
  partOfSpeech?: string;
  example?: string;
  exampleTranslation?: string;
}

export interface InteractiveContent {
  arabic: string;
  english: string;
  words: WordInfo[];
  ttsAudio?: string;
}

export interface LessonSection {
  title: string;
  content: InteractiveContent;
  examples: InteractiveContent[];
  imagePrompt?: string;
  imageUrl?: string;
}

export interface LessonResponse {
  title: string;
  description: InteractiveContent;
  sections: LessonSection[];
  vocabulary: WordInfo[];
  practice: {
    question: InteractiveContent;
    options: InteractiveContent[];
    answer: string;
  };
  metadata: {
    level: string;
    language: string;
    createdAt: string;
  };
}

export async function generateLesson(
  topic: string,
  goal: string,
  ai: AIInterface,
  options: LessonOptions = {}
): Promise<LessonResponse> {
  try {
    const { level = 'beginner', language = 'ar' } = options;
    
    const prompt = `Create a bilingual lesson for Arabic-speaking students learning English about "${topic}".
    Learning Goal: ${goal}
    
    FORMAT REQUIREMENTS:
    1. All content must be in Arabic first, followed by English translations
    2. Include word-by-word translations for all English text
    3. Mark all proper nouns and technical terms with [T] for TTS
    
    Return as JSON with this structure:
    {
      "title": "Lesson Title in Arabic | English",
      "description": {
        "arabic": "Lesson description in Arabic",
        "english": "Lesson description in English",
        "words": [
          {
            "word": "English word",
            "translation": "Arabic translation",
            "partOfSpeech": "noun/verb/adjective",
            "example": "Example sentence in English",
            "exampleTranslation": "Example in Arabic"
          }
        ]
      },
      "sections": [
        {
          "title": "Section Title in Arabic | English",
          "content": {
            "arabic": "Main content in Arabic",
            "english": "Main content in English",
            "words": [/* word details */]
          },
          "examples": [
            {
              "arabic": "Example in Arabic",
              "english": "Example in English",
              "words": [/* word details */]
            }
          ],
          "imagePrompt": "Description for generating an image"
        }
      ],
      "vocabulary": [
        {
          "word": "English word",
          "translation": "Arabic translation",
          "partOfSpeech": "part of speech",
          "example": "Example sentence",
          "exampleTranslation": "Example translation"
        }
      ],
      "practice": {
        "question": {
          "arabic": "Question in Arabic",
          "english": "Question in English",
          "words": [/* word details */]
        },
        "options": [
          {
            "arabic": "Option in Arabic",
            "english": "Option in English",
            "words": [/* word details */]
          }
        ],
        "answer": "Correct option text in English"
      },
      "metadata": {
        "level": "${level}",
        "language": "${language}",
        "createdAt": "${new Date().toISOString()}"
      }
    }`;

    const response = await ai.run('@meta/llama-3.3-70b-instruct-fp8-fast', {
      prompt,
      max_tokens: 4000,
      temperature: 0.5,
    });

    if (typeof response !== 'string') {
      throw new Error('Unexpected response format from AI model');
    }

    const parsed = JSON.parse(response);
    if (typeof parsed !== 'object' || parsed === null) {
      throw new Error('AI response is not a valid JSON object');
    }

    return parsed;
  } catch (error) {
    console.error('Error generating lesson:', error);
    throw error;
  }
}

export async function generateVocabulary(
  topic: string,
  goal: string,
  ai: AIInterface,
  _options: LessonOptions = {}
): Promise<unknown[]> {
  try {
    const prompt = `Generate a vocabulary list for topic: ${topic}
    Learning Goal: ${goal}
    Include 10-15 words with:
    - English word
    - Arabic translation
    - Example sentence in English
    - Example sentence in Arabic
    - Part of speech
    - Pronunciation guide
    
    Format as JSON array of word objects.`;

    const response = await ai.run('@meta/llama-3.2-11b-vision-instruct', {
      prompt,
      max_tokens: 1500,
      temperature: 0.5,
    });

    if (typeof response !== 'string') {
      throw new Error('Unexpected response format from AI model');
    }

    const parsed = JSON.parse(response);
    if (!Array.isArray(parsed)) {
      throw new Error('Expected an array of vocabulary items');
    }

    return parsed;
  } catch (error) {
    console.error('Error generating vocabulary:', error);
    throw error;
  }
}

// Helper function to generate TTS audio for words
async function generateWordTTS(word: string, ai: AIInterface): Promise<string> {
  try {
    const audio = await ai.run('@myshell-ai/melotts', {
      text: word,
      voice: 'en-US-Wavenet-D',
    });

    if (!(audio instanceof Uint8Array)) {
      throw new Error('Expected Uint8Array for audio data');
    }

    // Convert Uint8Array to base64
    let binary = '';
    const bytes = new Uint8Array(audio);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return `data:audio/mp3;base64,${btoa(binary)}`;
  } catch (error) {
    console.error(`Error generating TTS for word "${word}":`, error);
    return '';
  }
}

// Add TTS audio for all words in the lesson
async function addTTSForLesson(lesson: LessonResponse, ai: AIInterface): Promise<void> {
  const wordSet = new Set<string>();
  const wordPromises: Array<Promise<void>> = [];

  // Process all words in the lesson
  const processWords = (words: WordInfo[]) => {
    words.forEach(wordInfo => {
      if (!wordSet.has(wordInfo.word)) {
        wordSet.add(wordInfo.word);
        wordPromises.push(
          generateWordTTS(wordInfo.word, ai).then(audio => {
            wordInfo.ttsAudio = audio;
          })
        );
      }
    });
  };

  // Process description words
  if (lesson.description.words) {
    processWords(lesson.description.words);
  }

  // Process section content and examples
  lesson.sections.forEach(section => {
    if (section.content.words) {
      processWords(section.content.words);
    }
    section.examples.forEach(example => {
      if (example.words) {
        processWords(example.words);
      }
    });
  });

  // Process practice section
  if (lesson.practice?.question?.words) {
    processWords(lesson.practice.question.words);
  }
  lesson.practice?.options?.forEach(option => {
    if (option.words) {
      processWords(option.words);
    }
  });

  // Process vocabulary
  if (lesson.vocabulary) {
    processWords(lesson.vocabulary);
  }

  // Wait for all TTS generations to complete
  await Promise.all(wordPromises);
}

export async function generateGrammar(
  topic: string,
  goal: string,
  ai: AIInterface,
  options: LessonOptions = {}
): Promise<Record<string, unknown>> {
  try {
    const prompt = `Create a grammar lesson about: ${topic}
    Learning Goal: ${goal}
    Include:
    - Clear explanation in English and Arabic
    - Formula/structure
    - 5-7 example sentences in English with Arabic translations
    - Common mistakes to avoid
    - Practice exercises with answers
    
    Format as structured JSON.`;

    const response = await ai.run('@meta/llama-3.2-11b-vision-instruct', {
      prompt,
      max_tokens: 2000,
      temperature: 0.6,
    });

    if (typeof response !== 'string') {
      throw new Error('Unexpected response format from AI model');
    }

    const parsed = JSON.parse(response);
    if (typeof parsed !== 'object' || parsed === null) {
      throw new Error('AI response is not a valid JSON object');
    }

    return parsed;
  } catch (error) {
    console.error('Error generating grammar lesson:', error);
    throw error;
  }
}

export async function generateMathProblem(
  topic: string,
  goal: string,
  ai: AIInterface,
  _options: LessonOptions = {}
): Promise<Record<string, unknown>> {
  try {
    const prompt = `Generate a math problem about: ${topic}
    Learning Goal: ${goal}
    Include:
    - Problem statement in English and Arabic
    - Step-by-step solution
    - Final answer
    - 2-3 similar practice problems
    
    Format as structured JSON.`;

    const response = await ai.run('@deepseek-ai/deepseek-math-7b-instruct', {
      prompt,
      max_tokens: 1500,
      temperature: 0.3,
    });

    if (typeof response !== 'string') {
      throw new Error('Unexpected response format from AI model');
    }

    const parsed = JSON.parse(response);
    if (typeof parsed !== 'object' || parsed === null) {
      throw new Error('AI response is not a valid JSON object');
    }

    return parsed;
  } catch (error) {
    console.error('Error generating math problem:', error);
    throw error;
  }
}

export async function transcribeAudio(
  audioData: string,
  ai: AIInterface,
  options: Record<string, unknown> = {}
): Promise<unknown> {
  try {
    const response = await ai.run('@openai/whisper-large-v3-turbo', {
      audio: audioData,
      ...options
    });
    return response;
  } catch (error) {
    console.error('Error transcribing audio:', error);
    throw error;
  }
}

export async function moderateContent(
  text: string,
  ai: AIInterface
): Promise<{ isSafe: boolean; details: string }> {
  try {
    const response = await ai.run('@meta/llama-guard-3-8b', {
      text,
      max_tokens: 100,
      temperature: 0.1,
    });
    
    if (typeof response !== 'string') {
      throw new Error('Unexpected response format from content moderation');
    }
    
    return {
      isSafe: !response.toLowerCase().includes('unsafe'),
      details: response
    } as const;
  } catch (error) {
    console.error('Error moderating content:', error);
    throw error;
  }
}
