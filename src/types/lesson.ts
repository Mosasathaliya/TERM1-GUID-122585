export type CardType = 'alphabet' | 'vocabulary' | 'grammar' | 'dialogue' | 'quiz' | 'matching' | 'practice' | 'fill-blank';

export interface MediaContent {
  imagePrompt?: string;
  imageUrl?: string;
  ttsText?: string;
  audioUrl?: string;
}

export interface BaseGeneratedCard {
  id: string;
  type: CardType;
  content: Record<string, unknown>;
  media?: MediaContent;
  metadata: {
    lessonId: number;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    tags: string[];
    aiModel?: string;
  };
}

export interface AlphabetCard extends BaseGeneratedCard {
  type: 'alphabet';
  content: {
    letter: string;
    english: string;
    arabic: string;
    exampleWord: string;
    exampleTranslation: string;
  };
}

export interface VocabularyCard extends BaseGeneratedCard {
  type: 'vocabulary';
  content: {
    english: string;
    arabic: string;
    partOfSpeech: string;
    example: string;
    exampleTranslation: string;
  };
}

export interface GrammarCard extends BaseGeneratedCard {
  type: 'grammar';
  content: {
    rule: string;
    explanation: string;
    arabicRule: string;
    arabicExplanation: string;
    examples: string[];
    exampleTranslations: string[];
  };
}

export interface DialogueCard extends BaseGeneratedCard {
  type: 'dialogue';
  content: {
    context: string;
    arabicContext: string;
    lines: Array<{
      speaker: string;
      text: string;
      translation: string;
    }>;
  };
}

export interface QuizCard extends BaseGeneratedCard {
  type: 'quiz';
  content: {
    question: string;
    arabicQuestion: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
    arabicExplanation: string;
  };
}

export interface MatchingCard extends BaseGeneratedCard {
  type: 'matching';
  content: {
    instruction: string;
    arabicInstruction: string;
    pairs: Array<{
      id: string;
      english: string;
      arabic: string;
    }>;
  };
}

export interface FillCard extends BaseGeneratedCard {
  type: 'fill-blank';
  content: {
    instruction: string;
    arabicInstruction: string;
    text: string;
    arabicText: string;
    blanks: Array<{
      id: string;
      correctAnswer: string;
      options: string[];
    }>;
  };
}

export type GeneratedCard = 
  | AlphabetCard
  | VocabularyCard
  | GrammarCard
  | DialogueCard
  | QuizCard
  | MatchingCard
  | FillCard;

export interface LessonCard {
  id: string;
  type: CardType;
  title: string;
  content: string; // Changed from string | string[] to match course-structure.ts
  arabicTranslation: string;
  ttsText: string;
  imageSuggestion?: string;
  options?: string[];
  correctAnswer?: string;
  explanation?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  aiModel: string;
  // Additional properties for our implementation
  audioUrl?: string;
  arabicHint?: string;
  choices?: string[]; // Alias for options
}

export interface LessonGenerationRequest {
  lessonId: number;
  lessonTitle: string;
  learningGoal: string;
  teachingStrategy: string;
  locale?: 'en' | 'ar';
}

export interface WorkerResponse<T = unknown> {
  success: boolean;
  data: T;
  metadata?: {
    modelTried: string;
    fallbackUsed?: boolean;
    cached?: boolean;
    cacheKey?: string;
  };
  error?: {
    message: string;
    code?: string;
  };
}

export interface TTSResponse {
  audioUrl: string;
  text: string;
  language: string;
}

export interface ImageResponse {
  imageUrl: string;
  prompt: string;
  model: string;
}

export interface STTResponse {
  text: string;
  language: string;
  duration: number;
}
