// Cloudflare AI API Service - Using Worker Proxy
// This service calls our Cloudflare Worker which handles CORS and AI API access

export interface CloudflareAIResponse {
  success: boolean
  result: unknown
  error?: string
  method?: string
  truncated?: boolean
  message?: string
  originalSize?: number
}

export interface CloudflareAIRequest {
  prompt: string
  [key: string]: unknown
}

class CloudflareAIService {
  private baseUrl = process.env.NEXT_PUBLIC_WORKER_URL || 'https://al-dalil-ai-worker.speedofmastry.workers.dev'

  private getModelFromEndpoint(endpoint: string): string {
    const modelMap: Record<string, string> = {
      '/ai/text': 'Llama 3.1 8B',
      '/ai/translate': 'M2M100 1.2B',
      '/ai/tts': 'MeloTTS',
      '/ai/image': 'Stable Diffusion XL',
      '/ai/analyze': 'Llama Vision 3.2',
      '/ai/test': 'Connection Test'
    }
    return modelMap[endpoint] || 'Unknown Model'
  }

  private async makeRequest(endpoint: string, data: Record<string, unknown>): Promise<CloudflareAIResponse> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      
      return {
        success: true,
        result,
        method: this.getModelFromEndpoint(endpoint)
      }
    } catch (error) {
      console.error(`Error calling ${endpoint}:`, error)
      
      return {
        success: false,
        result: null,
        error: error instanceof Error ? error.message : 'Unknown error',
        method: this.getModelFromEndpoint(endpoint)
      }
    }
  }

  // Text Generation with Llama
  async generateText(prompt: string): Promise<CloudflareAIResponse> {
    return this.makeRequest('/ai/text', { prompt })
  }

  // Translation with M2M100
  async translateText(text: string, targetLang: string = 'ar'): Promise<CloudflareAIResponse> {
    return this.makeRequest('/ai/translate', { text, targetLang })
  }

  // Creative Text Generation with Flux
  async generateCreativeText(prompt: string): Promise<CloudflareAIResponse> {
    return this.makeRequest('/ai/text', { prompt })
  }

  // Text-to-Speech with MeloTTS
  async generateSpeech(text: string, lang: string = 'en'): Promise<CloudflareAIResponse> {
    return this.makeRequest('/ai/tts', { text, lang })
  }

  // Image Generation with Stable Diffusion
  async generateImage(prompt: string): Promise<CloudflareAIResponse> {
    return this.makeRequest('/ai/image', { prompt })
  }

  // Lightning Fast Image Generation with SDXL-Lightning
  async generateLightningImage(prompt: string): Promise<CloudflareAIResponse> {
    return this.makeRequest('/ai/lightning', { prompt })
  }

  // Dreamshaper Image Generation (Photorealistic)
  async generateDreamshaperImage(prompt: string): Promise<CloudflareAIResponse> {
    return this.makeRequest('/ai/dreamshaper', { prompt })
  }

  // Story Analysis
  async analyzeStory(story: string): Promise<CloudflareAIResponse> {
    return this.makeRequest('/ai/analyze', { story })
  }

  // Test API connection
  async testConnection(): Promise<CloudflareAIResponse> {
    return this.makeRequest('/ai/test', {})
  }

  // Fallback to browser TTS if AI fails
  async fallbackTTS(text: string, lang: string = 'en'): Promise<CloudflareAIResponse> {
    try {
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text)
        utterance.lang = lang === 'en' ? 'en-US' : 'ar-SA'
        utterance.rate = 0.8
        utterance.pitch = 1.0
        utterance.volume = 1.0
        
        window.speechSynthesis.speak(utterance)
        
        return {
          success: true,
          result: 'Browser TTS activated successfully',
          method: 'Browser TTS'
        }
      } else {
        throw new Error('Speech synthesis not supported')
      }
    } catch (error) {
      return {
        success: false,
        result: null,
        error: error instanceof Error ? error.message : 'Browser TTS failed',
        method: 'Browser TTS'
      }
    }
  }
}

export default CloudflareAIService
