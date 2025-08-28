// Mock AI Service for Testing
// This simulates Cloudflare AI responses when the real API is not working

export interface MockAIResponse {
  success: boolean
  result: unknown
  error?: string
  method?: string
}

class MockAIService {
  private delay = 1000 // Simulate API delay

  // Text Generation
  async generateText(prompt: string): Promise<MockAIResponse> {
    await this.simulateDelay()
    
    const responses = {
      "Hello world": "Hello! Welcome to the world of English learning.",
      "How are you": "I'm doing great! How about you?",
      "Good morning": "Good morning! It's a beautiful day to learn English.",
      "Thank you": "You're welcome! Learning together is wonderful.",
      "Goodbye": "Goodbye! Keep practicing your English skills."
    }
    
    const response = (responses as Record<string, string>)[prompt] || `Generated response for: ${prompt}`
    
    return {
      success: true,
      result: response,
      method: 'Mock Text Generation'
    }
  }

  // Translation
  async translateText(text: string, targetLang: string): Promise<MockAIResponse> {
    await this.simulateDelay()
    
    const translations = {
      "Hello world": "مرحباً بالعالم",
      "How are you": "كيف حالك",
      "Good morning": "صباح الخير",
      "Thank you": "شكراً لك",
      "Goodbye": "مع السلامة"
    }
    
    const translation = (translations as Record<string, string>)[text] || `ترجمة: ${text} (باللغة العربية)`
    
    return {
      success: true,
      result: translation,
      method: 'Mock Translation'
    }
  }

  // Text-to-Speech
  async generateSpeech(text: string, lang: string): Promise<MockAIResponse> {
    await this.simulateDelay()
    
    // Return a mock audio data URL
    const mockAudioData = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT'
    
    return {
      success: true,
      result: mockAudioData,
      method: 'Mock TTS'
    }
  }

  // Image Generation
  async generateImage(prompt: string): Promise<MockAIResponse> {
    await this.simulateDelay()
    
    // Return a mock image data URL
    const mockImageData = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzE0YTM2MCIvPjx0ZXh0IHg9IjE1MCIgeT0iMTAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5Nb2NrIEltYWdlPC90ZXh0Pjwvc3ZnPg=='
    
    return {
      success: true,
      result: mockImageData,
      method: 'Mock Image Generation'
    }
  }

  // Story Analysis
  async analyzeStory(story: string): Promise<MockAIResponse> {
    await this.simulateDelay()
    
    const analysis = `تحليل القصة: "${story}"
    
    النقاط الرئيسية:
    1. القصة تتحدث عن ${story.substring(0, 20)}...
    2. يمكن استخدام هذه القصة لتعلم المفردات الجديدة
    3. القصة مناسبة للمستوى المتوسط
    
    التوصيات:
    - ركز على الكلمات الجديدة
    - تدرب على النطق
    - اكتب ملخص للقصة`
    
    return {
      success: true,
      result: analysis,
      method: 'Mock Story Analysis'
    }
  }

  // Connection Test
  async testConnection(): Promise<MockAIResponse> {
    await this.simulateDelay()
    
    return {
      success: true,
      result: 'Mock AI service is working correctly',
      method: 'Mock Connection Test'
    }
  }

  private async simulateDelay(): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, this.delay))
  }
}
