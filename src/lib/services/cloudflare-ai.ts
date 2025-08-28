export interface CloudflareAIResponse {
  success: boolean
  result: unknown
  error?: string
  method?: string
  fallbackModel?: string
  timestamp?: number
  performance?: {
    duration: number
    model: string
  }
}

interface CacheEntry {
  data: unknown
  timestamp: number
}

class CloudflareAIService {
  // ONE worker for ALL AI tasks
  private baseUrl = 'https://ai-gateway-worker.speedofmastry.workers.dev'
  private cache = new Map<string, CacheEntry>()
  private readonly CACHE_TTL = 5 * 60 * 1000 // 5 minutes

  constructor() {
    console.log('[CloudflareAI] Using ONE worker for ALL AI tasks:', this.baseUrl)
  }

  // Generate text content using ONE worker
  async generateText(prompt: string): Promise<CloudflareAIResponse> {
    return this.makeRequest('generate-vocabulary', { prompt, lesson: 'General', goal: 'Text generation' })
  }

  // Generate image using ONE worker
  async generateImage(prompt: string): Promise<CloudflareAIResponse> {
    return this.makeRequest('generate-image', { prompt, lesson: 'General', goal: 'Image generation' })
  }

  // Generate TTS using ONE worker
  async generateSpeech(text: string, lang: string = 'en'): Promise<CloudflareAIResponse> {
    return this.makeRequest('generate-tts', { text, lesson: 'General', goal: 'TTS generation' })
  }

  // Generate vocabulary using ONE worker
  async generateVocabulary(lesson: string, goal: string): Promise<CloudflareAIResponse> {
    return this.makeRequest('generate-vocabulary', { lesson, goal })
  }

  // Generate grammar using ONE worker
  async generateGrammar(lesson: string, goal: string): Promise<CloudflareAIResponse> {
    return this.makeRequest('generate-grammar', { lesson, goal })
  }

  // Generate dialogue using ONE worker
  async generateDialogue(lesson: string, goal: string): Promise<CloudflareAIResponse> {
    return this.makeRequest('generate-dialogue', { lesson, goal })
  }

  // Generate quiz using ONE worker
  async generateQuiz(lesson: string, goal: string): Promise<CloudflareAIResponse> {
    return this.makeRequest('generate-quiz', { lesson, goal })
  }

  // Generate alphabet using ONE worker
  async generateAlphabet(lesson: string, goal: string): Promise<CloudflareAIResponse> {
    return this.makeRequest('generate-alphabet', { lesson, goal })
  }

  // Generate complete lesson using ONE worker
  async generateCompleteLesson(lesson: string, goal: string): Promise<CloudflareAIResponse> {
    return this.makeRequest('generate-complete-lesson', { lesson, goal })
  }

  // Make request to ONE AI worker
  private async makeRequest(action: string, data: Record<string, unknown>): Promise<CloudflareAIResponse> {
    const startTime = performance.now()
    
    const cacheKey = `${action}:${JSON.stringify(data)}`
    
    // Check cache first
    const cached = this.cache.get(cacheKey)
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return {
        success: true,
        result: cached.data,
        method: action,
        timestamp: Date.now(),
        performance: {
          duration: Math.round(performance.now() - startTime),
          model: action
        }
      }
    }

    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action,
          ...data
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      // Handle different response types
      let result;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('image/')) {
        // Image response - convert to base64
        const blob = await response.blob();
        const reader = new FileReader();
        result = await new Promise((resolve) => {
          reader.onload = () => resolve(reader.result);
          reader.readAsDataURL(blob);
        });
      } else {
        // JSON response
        result = await response.json();
      }
      
      // Cache the successful response
      this.cache.set(cacheKey, {
        data: result,
        timestamp: Date.now()
      })
      
      // Clear expired cache entries
      this.clearExpiredCache()

      return {
        success: true,
        result,
        method: action,
        timestamp: Date.now(),
        performance: {
          duration: Math.round(performance.now() - startTime),
          model: action
        }
      }
    } catch (error) {
      console.error(`Error calling ${action}:`, error)
      
      return {
        success: false,
        result: null,
        error: error instanceof Error ? error.message : 'Unknown error',
        method: action,
        timestamp: Date.now(),
        performance: {
          duration: Math.round(performance.now() - startTime),
          model: action
        }
      }
    }
  }

  // Cache management
  private clearExpiredCache(): void {
    const now = Date.now()
    const entries = Array.from(this.cache.entries())
    for (const [key, value] of entries) {
      if (now - value.timestamp > this.CACHE_TTL) {
        this.cache.delete(key)
      }
    }
  }

  // Public method to get cache statistics
  getCacheStats(): { size: number, ttl: number } {
    return {
      size: this.cache.size,
      ttl: this.CACHE_TTL
    }
  }

  // Public method to clear all cache
  clearAllCache(): void {
    this.cache.clear()
    console.log('[CACHE] All cache cleared')
  }

  // Connection Test
  async testConnection(): Promise<CloudflareAIResponse> {
    try {
      const response = await fetch(this.baseUrl, { method: 'GET' });
      if (response.ok) {
        return {
          success: true,
          result: 'Worker is online and responding',
          method: 'connection-test',
          timestamp: Date.now(),
          performance: { duration: 0, model: 'connection-test' }
        };
      } else {
        throw new Error(`Worker responded with status: ${response.status}`);
      }
    } catch (error) {
      return {
        success: false,
        result: null,
        error: error instanceof Error ? error.message : 'Unknown error',
        method: 'connection-test',
        timestamp: Date.now(),
        performance: { duration: 0, model: 'connection-test' }
      };
    }
  }
}

export const cloudflareAI = new CloudflareAIService()
export default cloudflareAI
