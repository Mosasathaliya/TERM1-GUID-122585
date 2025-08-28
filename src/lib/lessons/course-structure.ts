// Complete Course Structure for English-Arabic Interactive Tutor
// 6 Units, 50 Lessons with proper categorization and AI model assignment

export interface LessonCard {
  id: string
  type: 'alphabet' | 'vocabulary' | 'grammar' | 'dialogue' | 'practice' | 'quiz' | 'matching' | 'fill-blank'
  title: string
  content: string
  arabicTranslation: string
  ttsText: string
  imageSuggestion?: string
  options?: string[]
  correctAnswer?: string
  explanation?: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  aiModel: string // Specific AI model for this card type
}

export interface Lesson {
  id: number
  title: string
  arabicTitle: string
  unit: number
  learningGoal: string
  arabicLearningGoal: string
  category: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  estimatedDuration: number // in minutes
  cards: LessonCard[]
  aiModels: {
    textGeneration: string
    imageGeneration: string
    audioGeneration: string
  }
  teachingStrategy: string
}

export interface Unit {
  id: number
  title: string
  arabicTitle: string
  description: string
  arabicDescription: string
  lessons: Lesson[]
  totalLessons: number
  estimatedDuration: number // in hours
}

// AI Model Assignment Strategy
export const AI_MODEL_STRATEGY = {
  textGeneration: {
    'alphabet': 'text',
    'vocabulary': 'mistral',
    'grammar': 'llama-3-3',
    'dialogue': 'mistral',
    'practice': 'text',
    'quiz': 'gpt-oss',
    'matching': 'mistral',
    'fill-blank': 'text'
  },
  imageGeneration: {
    'alphabet': 'image',
    'vocabulary': 'lightning',
    'grammar': 'image',
    'dialogue': 'lightning',
    'practice': 'dreamshaper',
    'quiz': 'image',
    'matching': 'lightning',
    'fill-blank': 'image'
  },
  audioGeneration: {
    'all': 'tts'
  }
}

// Complete Course Structure
export const COURSE_STRUCTURE: Unit[] = [
  {
    id: 1,
    title: 'English Alphabet & Sounds',
    arabicTitle: 'الأبجدية الإنجليزية والأصوات',
    description: 'Master the English alphabet with proper pronunciation and basic phonics',
    arabicDescription: 'أتقن الأبجدية الإنجليزية مع النطق الصحيح وأساسيات علم الأصوات',
    totalLessons: 5,
    estimatedDuration: 2.5,
    lessons: [
      {
        id: 1,
        title: 'Alphabet A–Z',
        arabicTitle: 'الأبجدية من أ إلى ي',
        unit: 1,
        learningGoal: 'Learn all 26 letters of the English alphabet with proper pronunciation',
        arabicLearningGoal: 'تعلم جميع الحروف الـ 26 من الأبجدية الإنجليزية مع النطق الصحيح',
        category: 'alphabet',
        difficulty: 'beginner',
        estimatedDuration: 30,
        aiModels: {
          textGeneration: AI_MODEL_STRATEGY.textGeneration.alphabet,
          imageGeneration: AI_MODEL_STRATEGY.imageGeneration.alphabet,
          audioGeneration: AI_MODEL_STRATEGY.audioGeneration.all
        },
        teachingStrategy: 'alphabet-cards',
        cards: [] // Will be populated by AI
      },
      {
        id: 2,
        title: 'Vowels (A, E, I, O, U)',
        arabicTitle: 'الحروف المتحركة (أ، إ، ي، و، ي)',
        unit: 1,
        learningGoal: 'Master the 5 vowel sounds and their variations',
        arabicLearningGoal: 'أتقن الأصوات المتحركة الخمسة وتنويعاتها',
        category: 'alphabet',
        difficulty: 'beginner',
        estimatedDuration: 25,
        aiModels: {
          textGeneration: AI_MODEL_STRATEGY.textGeneration.alphabet,
          imageGeneration: AI_MODEL_STRATEGY.imageGeneration.alphabet,
          audioGeneration: AI_MODEL_STRATEGY.audioGeneration.all
        },
        teachingStrategy: 'vowel-practice',
        cards: []
      },
      {
        id: 3,
        title: 'Consonants',
        arabicTitle: 'الحروف الساكنة',
        unit: 1,
        learningGoal: 'Learn consonant sounds and their combinations',
        arabicLearningGoal: 'تعلم أصوات الحروف الساكنة وتركيباتها',
        category: 'alphabet',
        difficulty: 'beginner',
        estimatedDuration: 30,
        aiModels: {
          textGeneration: AI_MODEL_STRATEGY.textGeneration.alphabet,
          imageGeneration: AI_MODEL_STRATEGY.imageGeneration.alphabet,
          audioGeneration: AI_MODEL_STRATEGY.audioGeneration.all
        },
        teachingStrategy: 'consonant-practice',
        cards: []
      },
      {
        id: 4,
        title: 'Letter Sounds (Phonics Basics)',
        arabicTitle: 'أصوات الحروف (أساسيات علم الأصوات)',
        unit: 1,
        learningGoal: 'Understand basic phonics and letter-sound relationships',
        arabicLearningGoal: 'فهم أساسيات علم الأصوات والعلاقة بين الحروف والأصوات',
        category: 'alphabet',
        difficulty: 'beginner',
        estimatedDuration: 35,
        aiModels: {
          textGeneration: AI_MODEL_STRATEGY.textGeneration.grammar,
          imageGeneration: AI_MODEL_STRATEGY.imageGeneration.grammar,
          audioGeneration: AI_MODEL_STRATEGY.audioGeneration.all
        },
        teachingStrategy: 'phonics-practice',
        cards: []
      },
      {
        id: 5,
        title: 'Writing Practice (Capital & Small)',
        arabicTitle: 'تدريب الكتابة (حروف كبيرة وصغيرة)',
        unit: 1,
        learningGoal: 'Practice writing both capital and lowercase letters',
        arabicLearningGoal: 'تدرب على كتابة الحروف الكبيرة والصغيرة',
        category: 'alphabet',
        difficulty: 'beginner',
        estimatedDuration: 30,
        aiModels: {
          textGeneration: AI_MODEL_STRATEGY.textGeneration.practice,
          imageGeneration: AI_MODEL_STRATEGY.imageGeneration.practice,
          audioGeneration: AI_MODEL_STRATEGY.audioGeneration.all
        },
        teachingStrategy: 'writing-practice',
        cards: []
      }
    ]
  },
  {
    id: 2,
    title: 'Basic Words & Greetings',
    arabicTitle: 'الكلمات الأساسية والتحيات',
    description: 'Essential vocabulary and greetings for daily communication',
    arabicDescription: 'المفردات الأساسية والتحيات للتواصل اليومي',
    totalLessons: 5,
    estimatedDuration: 2.0,
    lessons: [
      {
        id: 6,
        title: 'Greetings',
        arabicTitle: 'التحيات',
        unit: 2,
        learningGoal: 'Learn common greetings for different times of day',
        arabicLearningGoal: 'تعلم التحيات الشائعة لأوقات مختلفة من اليوم',
        category: 'vocabulary',
        difficulty: 'beginner',
        estimatedDuration: 20,
        aiModels: {
          textGeneration: AI_MODEL_STRATEGY.textGeneration.vocabulary,
          imageGeneration: AI_MODEL_STRATEGY.imageGeneration.vocabulary,
          audioGeneration: AI_MODEL_STRATEGY.audioGeneration.all
        },
        teachingStrategy: 'greeting-cards',
        cards: []
      },
      {
        id: 7,
        title: 'Introductions',
        arabicTitle: 'التعارف',
        unit: 2,
        learningGoal: 'Learn how to introduce yourself and others',
        arabicLearningGoal: 'تعلم كيفية التعريف بنفسك وبالآخرين',
        category: 'dialogue',
        difficulty: 'beginner',
        estimatedDuration: 25,
        aiModels: {
          textGeneration: AI_MODEL_STRATEGY.textGeneration.dialogue,
          imageGeneration: AI_MODEL_STRATEGY.imageGeneration.dialogue,
          audioGeneration: AI_MODEL_STRATEGY.audioGeneration.all
        },
        teachingStrategy: 'dialogue-practice',
        cards: []
      },
      {
        id: 8,
        title: 'Numbers 1–20',
        arabicTitle: 'الأرقام من 1 إلى 20',
        unit: 2,
        learningGoal: 'Count from 1 to 20 in English',
        arabicLearningGoal: 'عد من 1 إلى 20 باللغة الإنجليزية',
        category: 'vocabulary',
        difficulty: 'beginner',
        estimatedDuration: 20,
        aiModels: {
          textGeneration: AI_MODEL_STRATEGY.textGeneration.vocabulary,
          imageGeneration: AI_MODEL_STRATEGY.imageGeneration.vocabulary,
          audioGeneration: AI_MODEL_STRATEGY.audioGeneration.all
        },
        teachingStrategy: 'number-cards',
        cards: []
      },
      {
        id: 9,
        title: 'Colors',
        arabicTitle: 'الألوان',
        unit: 2,
        learningGoal: 'Learn basic colors and their names',
        arabicLearningGoal: 'تعلم الألوان الأساسية وأسمائها',
        category: 'vocabulary',
        difficulty: 'beginner',
        estimatedDuration: 20,
        aiModels: {
          textGeneration: AI_MODEL_STRATEGY.textGeneration.vocabulary,
          imageGeneration: AI_MODEL_STRATEGY.imageGeneration.vocabulary,
          audioGeneration: AI_MODEL_STRATEGY.audioGeneration.all
        },
        teachingStrategy: 'color-cards',
        cards: []
      },
      {
        id: 10,
        title: 'Classroom Objects',
        arabicTitle: 'أغراض الفصل الدراسي',
        unit: 2,
        learningGoal: 'Learn names of common classroom objects',
        arabicLearningGoal: 'تعلم أسماء الأغراض الشائعة في الفصل الدراسي',
        category: 'vocabulary',
        difficulty: 'beginner',
        estimatedDuration: 25,
        aiModels: {
          textGeneration: AI_MODEL_STRATEGY.textGeneration.vocabulary,
          imageGeneration: AI_MODEL_STRATEGY.imageGeneration.vocabulary,
          audioGeneration: AI_MODEL_STRATEGY.audioGeneration.all
        },
        teachingStrategy: 'object-cards',
        cards: []
      }
    ]
  },
  {
    id: 3,
    title: 'Basic Grammar Foundations',
    arabicTitle: 'أساسيات النحو الأساسية',
    description: 'Learn fundamental English grammar rules and structures',
    arabicDescription: 'تعلم قواعد النحو الإنجليزية الأساسية والتراكيب',
    totalLessons: 10,
    estimatedDuration: 5.0,
    lessons: [
      {
        id: 11,
        title: 'Nouns',
        arabicTitle: 'الأسماء',
        unit: 3,
        learningGoal: 'Understand what nouns are and how to use them',
        arabicLearningGoal: 'فهم ما هي الأسماء وكيفية استخدامها',
        category: 'grammar',
        difficulty: 'beginner',
        estimatedDuration: 25,
        aiModels: {
          textGeneration: AI_MODEL_STRATEGY.textGeneration.grammar,
          imageGeneration: AI_MODEL_STRATEGY.imageGeneration.grammar,
          audioGeneration: AI_MODEL_STRATEGY.audioGeneration.all
        },
        teachingStrategy: 'grammar-cards',
        cards: []
      },
      {
        id: 12,
        title: 'Pronouns',
        arabicTitle: 'الضمائر',
        unit: 3,
        learningGoal: 'Learn personal pronouns and their usage',
        arabicLearningGoal: 'تعلم الضمائر الشخصية واستخدامها',
        category: 'grammar',
        difficulty: 'beginner',
        estimatedDuration: 25,
        aiModels: {
          textGeneration: AI_MODEL_STRATEGY.textGeneration.grammar,
          imageGeneration: AI_MODEL_STRATEGY.imageGeneration.grammar,
          audioGeneration: AI_MODEL_STRATEGY.audioGeneration.all
        },
        teachingStrategy: 'grammar-cards',
        cards: []
      }
    ]
  },
  {
    id: 4,
    title: 'Building Sentences',
    arabicTitle: 'بناء الجمل',
    description: 'Learn to construct proper English sentences',
    arabicDescription: 'تعلم بناء الجمل الإنجليزية الصحيحة',
    totalLessons: 10,
    estimatedDuration: 4.5,
    lessons: [
      {
        id: 21,
        title: 'Sentence Structure (SVO)',
        arabicTitle: 'تركيب الجملة (فاعل + فعل + مفعول)',
        unit: 4,
        learningGoal: 'Understand Subject-Verb-Object sentence structure',
        arabicLearningGoal: 'فهم تركيب الجملة: فاعل + فعل + مفعول',
        category: 'grammar',
        difficulty: 'beginner',
        estimatedDuration: 30,
        aiModels: {
          textGeneration: AI_MODEL_STRATEGY.textGeneration.grammar,
          imageGeneration: AI_MODEL_STRATEGY.imageGeneration.grammar,
          audioGeneration: AI_MODEL_STRATEGY.audioGeneration.all
        },
        teachingStrategy: 'grammar-cards',
        cards: []
      }
    ]
  },
  {
    id: 5,
    title: 'Practical English',
    arabicTitle: 'الإنجليزية العملية',
    description: 'Real-world English for daily situations',
    arabicDescription: 'الإنجليزية العملية للمواقف اليومية',
    totalLessons: 10,
    estimatedDuration: 4.0,
    lessons: [
      {
        id: 31,
        title: 'Time (What time is it?)',
        arabicTitle: 'الوقت (كم الساعة؟)',
        unit: 5,
        learningGoal: 'Learn to tell time and ask for time in English',
        arabicLearningGoal: 'تعلم إخبار الوقت والسؤال عن الوقت بالإنجليزية',
        category: 'vocabulary',
        difficulty: 'beginner',
        estimatedDuration: 25,
        aiModels: {
          textGeneration: AI_MODEL_STRATEGY.textGeneration.vocabulary,
          imageGeneration: AI_MODEL_STRATEGY.imageGeneration.vocabulary,
          audioGeneration: AI_MODEL_STRATEGY.audioGeneration.all
        },
        teachingStrategy: 'vocabulary-cards',
        cards: []
      }
    ]
  },
  {
    id: 6,
    title: 'Beginner Grammar Extension',
    arabicTitle: 'توسيع النحو للمبتدئين',
    description: 'Advanced beginner grammar concepts and practice',
    arabicDescription: 'مفاهيم النحو المتقدمة للمبتدئين والتدريب',
    totalLessons: 10,
    estimatedDuration: 4.5,
    lessons: [
      {
        id: 41,
        title: 'Can / Can\'t',
        arabicTitle: 'يمكن / لا يمكن',
        unit: 6,
        learningGoal: 'Learn to express ability and inability',
        arabicLearningGoal: 'تعلم التعبير عن القدرة وعدم القدرة',
        category: 'grammar',
        difficulty: 'beginner',
        estimatedDuration: 25,
        aiModels: {
          textGeneration: AI_MODEL_STRATEGY.textGeneration.grammar,
          imageGeneration: AI_MODEL_STRATEGY.imageGeneration.grammar,
          audioGeneration: AI_MODEL_STRATEGY.audioGeneration.all
        },
        teachingStrategy: 'grammar-cards',
        cards: []
      }
    ]
  }
]

// Helper functions for AI model selection
export function getAIModelForCard(cardType: LessonCard['type'], task: 'text' | 'image' | 'audio'): string {
  switch (task) {
    case 'text':
      return AI_MODEL_STRATEGY.textGeneration[cardType] || AI_MODEL_STRATEGY.textGeneration.vocabulary
    case 'image':
      return AI_MODEL_STRATEGY.imageGeneration[cardType] || AI_MODEL_STRATEGY.imageGeneration.vocabulary
    case 'audio':
      return AI_MODEL_STRATEGY.audioGeneration.all
    default:
      return AI_MODEL_STRATEGY.textGeneration.vocabulary
  }
}

export function getTeachingStrategy(lessonId: number): string {
  const lesson = COURSE_STRUCTURE.flatMap(unit => unit.lessons).find(l => l.id === lessonId)
  return lesson?.teachingStrategy || 'vocabulary-cards'
}

export function getLessonById(lessonId: number): Lesson | undefined {
  return COURSE_STRUCTURE.flatMap(unit => unit.lessons).find(l => l.id === lessonId)
}

export function getUnitByLessonId(lessonId: number): Unit | undefined {
  return COURSE_STRUCTURE.find(unit => unit.lessons.some(l => l.id === lessonId))
}
