// REVOLUTIONARY AI-Powered Lesson Generator Service
// Uses MULTIPLE SPECIALIZED WORKERS + ALL 30 AI MODELS for REAL content

import { GeneratedCard, LessonGenerationRequest } from '@/types/lesson'

interface AIGenerationConfig {
  aiModels: {
    textGeneration: string
    imageGeneration: string
    audioGeneration: string
  }
}

// ONE AI Gateway Worker for ALL AI operations
const AI_GATEWAY_URL = 'https://ai-gateway-worker.speedofmastry.workers.dev'

class AILessonGenerator {
  
  // Generate complete lesson with ONE worker
  async generateLesson(request: LessonGenerationRequest): Promise<GeneratedCard[]> {
    try {
      console.log(`🚀 ONE-WORKER lesson generation: ${request.lessonTitle}`)
      
      const cards: GeneratedCard[] = []
      
      // Generate cards based on teaching strategy using ONE worker
      switch (request.teachingStrategy) {
        case 'alphabet-cards':
          cards.push(...await this.generateAlphabetCards(request))
          break
        case 'vocabulary-cards':
          cards.push(...await this.generateVocabularyCards(request))
          break
        case 'grammar-cards':
          cards.push(...await this.generateGrammarCards(request))
          break
        case 'dialogue-cards':
          cards.push(...await this.generateDialogueCards(request))
          break
        case 'practice-cards':
          cards.push(...await this.generatePracticeCards(request))
          break
        default:
          cards.push(...await this.generateVocabularyCards(request))
      }
      
      // Add practice/quiz card using ONE worker
      cards.push(await this.generateQuizCard(request))
      
      console.log(`⚡ Generated ${cards.length} cards using ONE WORKER for lesson ${request.lessonTitle}`)
      return cards
      
    } catch (error) {
      console.error('💥 Error in ONE worker lesson generation:', error)
      throw error
    }
  }

  // Generate content using ONE AI Gateway Worker
  private async generateWithGateway(action: string, lesson: string, goal: string, data?: any): Promise<any> {
    try {
      console.log(`[Gateway] Calling ONE worker for action: ${action}, lesson: ${lesson}`);
      
      const response = await fetch(AI_GATEWAY_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action,
          lesson,
          goal,
          ...data
        })
      });

      if (!response.ok) {
        throw new Error(`Worker responded with status: ${response.status}`);
      }

      const result = await response.json();
      console.log(`[Gateway] Successfully generated content:`, result);
      
      if (result && typeof result === 'object' && 'success' in result && result.success && 'data' in result) {
        return (result as any).data;
      } else {
        throw new Error(`Worker failed: ${result && typeof result === 'object' && 'error' in result ? (result as any).error : 'Unknown error'}`);
      }
    } catch (error) {
      console.error(`[Gateway] Failed to call worker:`, error);
      throw error;
    }
  }

  // Generate alphabet cards using ONE worker
  private async generateAlphabetCards(request: LessonGenerationRequest): Promise<GeneratedCard[]> {
    try {
      console.log('🎯 Generating alphabet cards with ONE worker...');
      
      const alphabetData = await this.generateWithGateway(
        'generate-alphabet',
        request.lessonTitle,
        request.learningGoal
      );

      const cards: GeneratedCard[] = [];
      
      // Process alphabet data from ONE worker
      if (alphabetData && typeof alphabetData === 'object') {
        Object.entries(alphabetData).forEach(([letter, data]: [string, any]) => {
          if (data && typeof data === 'object') {
            cards.push({
              id: `alphabet-${letter}`,
              type: 'alphabet',
              content: {
                letter: letter.toUpperCase(),
                english: data.english || `Word starting with ${letter}`,
                arabic: data.arabic || `كلمة تبدأ بحرف ${letter}`,
                pronunciation: data.pronunciation || '',
                imageSuggestion: data.imageSuggestion || `illustration for ${data.english || letter}`,
                example: data.example || ''
              },
              metadata: {
                lessonId: request.lessonId,
                difficulty: 'beginner',
                tags: ['alphabet', 'basic']
              }
            });
          }
        });
      }

      console.log(`✅ Generated ${cards.length} alphabet cards using ONE worker`);
      return cards;
      
    } catch (error) {
      console.error('❌ Failed to generate alphabet cards:', error);
      throw error;
    }
  }

  // Generate vocabulary cards using ONE worker
  private async generateVocabularyCards(request: LessonGenerationRequest): Promise<GeneratedCard[]> {
    try {
      console.log('📚 Generating vocabulary cards with ONE worker...');
      
      const vocabularyData = await this.generateWithGateway(
        'generate-vocabulary',
        request.lessonTitle,
        request.learningGoal
      );

      const cards: GeneratedCard[] = [];
      
      // Process vocabulary data from ONE worker
      if (Array.isArray(vocabularyData)) {
        vocabularyData.forEach((item: any, index: number) => {
          if (item && typeof item === 'object') {
            cards.push({
              id: `vocabulary-${index}`,
              type: 'vocabulary',
              content: {
                english: item.english || 'Vocabulary word',
                arabic: item.arabic || 'كلمة مفردات',
                pronunciation: item.pronunciation || '',
                imageSuggestion: item.imageSuggestion || 'illustration',
                partOfSpeech: item.partOfSpeech || 'noun',
                example: item.example || ''
              },
              metadata: {
                lessonId: request.lessonId,
                difficulty: 'beginner',
                tags: ['vocabulary', 'basic']
              }
            });
          }
        });
      }

      console.log(`✅ Generated ${cards.length} vocabulary cards using ONE worker`);
      return cards;
      
    } catch (error) {
      console.error('❌ Failed to generate vocabulary cards:', error);
      throw error;
    }
  }

  // Generate grammar cards using ONE worker
  private async generateGrammarCards(request: LessonGenerationRequest): Promise<GeneratedCard[]> {
    try {
      console.log('📖 Generating grammar cards with ONE worker...');
      
      const grammarData = await this.generateWithGateway(
        'generate-grammar',
        request.lessonTitle,
        request.learningGoal
      );

      const cards: GeneratedCard[] = [];
      
      // Process grammar data from ONE worker
      if (grammarData && typeof grammarData === 'object') {
        cards.push({
          id: 'grammar-main',
          type: 'grammar',
          content: {
            rule: grammarData.rule || 'Grammar rule',
            arabicRule: grammarData.arabicRule || 'قاعدة نحوية',
            examples: grammarData.examples || [],
            practice: grammarData.practice || 'Practice exercise',
            tips: grammarData.tips || 'Learning tips'
          },
          metadata: {
            lessonId: request.lessonId,
            difficulty: 'intermediate',
            tags: ['grammar', 'rules']
          }
        });
      }

      console.log(`✅ Generated grammar cards using ONE worker`);
      return cards;
      
    } catch (error) {
      console.error('❌ Failed to generate grammar cards:', error);
      throw error;
    }
  }

  // Generate dialogue cards using ONE worker
  private async generateDialogueCards(request: LessonGenerationRequest): Promise<GeneratedCard[]> {
    try {
      console.log('💬 Generating dialogue cards with ONE worker...');
      
      const dialogueData = await this.generateWithGateway(
        'generate-dialogue',
        request.lessonTitle,
        request.learningGoal
      );

      const cards: GeneratedCard[] = [];
      
      // Process dialogue data from ONE worker
      if (dialogueData && typeof dialogueData === 'object') {
        cards.push({
          id: 'dialogue-main',
          type: 'dialogue',
          content: {
            title: dialogueData.title || 'Dialogue',
            context: dialogueData.context || 'Conversation context',
            lines: dialogueData.lines || [],
            vocabulary: dialogueData.vocabulary || [],
            culturalNotes: dialogueData.culturalNotes || ''
          },
          metadata: {
            lessonId: request.lessonId,
            difficulty: 'intermediate',
            tags: ['dialogue', 'conversation']
          }
        });
      }

      console.log(`✅ Generated dialogue cards using ONE worker`);
      return cards;
      
    } catch (error) {
      console.error('❌ Failed to generate dialogue cards:', error);
      throw error;
    }
  }

  // Generate practice cards using ONE worker
  private async generatePracticeCards(request: LessonGenerationRequest): Promise<GeneratedCard[]> {
    try {
      console.log('🎯 Generating practice cards with ONE worker...');
      
      const practiceData = await this.generateWithGateway(
        'generate-quiz',
        request.lessonTitle,
        request.learningGoal
      );

      const cards: GeneratedCard[] = [];
      
      // Process practice data from ONE worker
      if (practiceData && typeof practiceData === 'object') {
        cards.push({
          id: 'practice-main',
          type: 'practice',
          content: {
            question: practiceData.question || 'Practice question',
            arabicQuestion: practiceData.arabicQuestion || 'سؤال تدريبي',
            options: practiceData.options || [],
            correctAnswer: practiceData.correctAnswer || 'A',
            explanation: practiceData.explanation || 'Explanation',
            arabicExplanation: practiceData.arabicExplanation || 'شرح',
            difficulty: practiceData.difficulty || 'Easy'
          },
          metadata: {
            lessonId: request.lessonId,
            difficulty: 'intermediate',
            tags: ['practice', 'quiz']
          }
        });
      }

      console.log(`✅ Generated practice cards using ONE worker`);
      return cards;
      
    } catch (error) {
      console.error('❌ Failed to generate practice cards:', error);
      throw error;
    }
  }

  // Generate quiz card using ONE worker
  private async generateQuizCard(request: LessonGenerationRequest): Promise<GeneratedCard> {
    try {
      console.log('🧠 Generating quiz card with ONE worker...');
      
      const quizData = await this.generateWithGateway(
        'generate-quiz',
        request.lessonTitle,
        request.learningGoal
      );

      return {
        id: 'quiz-main',
        type: 'quiz',
        content: {
          question: quizData.question || 'Quiz question',
          arabicQuestion: quizData.arabicQuestion || 'سؤال اختبار',
          options: quizData.options || [],
          correctAnswer: quizData.correctAnswer || 'A',
          explanation: quizData.explanation || 'Explanation',
          arabicExplanation: quizData.arabicExplanation || 'شرح',
          difficulty: quizData.difficulty || 'Easy'
        },
        metadata: {
          lessonId: request.lessonId,
          difficulty: 'intermediate',
          tags: ['quiz', 'assessment']
        }
      };
      
    } catch (error) {
      console.error('❌ Failed to generate quiz card:', error);
      throw error;
    }
  }

  // Test connection to ONE worker
  async testWorkerConnection(): Promise<boolean> {
    try {
      const response = await fetch(AI_GATEWAY_URL, { method: 'GET' });
      return response.ok;
    } catch (error) {
      console.error('❌ Worker connection test failed:', error);
      return false;
    }
  }
}

// Export singleton instance
export const aiLessonGenerator = new AILessonGenerator()
