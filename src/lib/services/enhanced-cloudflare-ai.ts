// Enhanced Cloudflare AI Service
// Provides access to all AI models with intelligent model selection

import { getBestModelForTask, getModelById, AIModel, AIModelResponse } from './ai-models'

export interface EnhancedAIRequest {
  prompt: string
  task: string
  priority?: 'speed' | 'quality' | 'cost'
  specificModel?: string
  options?: {
    maxTokens?: number
    temperature?: number
    topP?: number
    frequencyPenalty?: number
    presencePenalty?: number
  }
}

export interface EnhancedImageRequest {
  prompt: string
  priority?: 'speed' | 'quality' | 'cost'
  specificModel?: string
  options?: {
    width?: number
    height?: number
    steps?: number
    cfgScale?: number
    seed?: number
  }
}

export interface EnhancedAudioRequest {
  text: string
  voice?: string
  speed?: number
  options?: {
    format?: 'mp3' | 'wav' | 'flac'
    quality?: 'low' | 'medium' | 'high'
  }
}

class EnhancedCloudflareAI {
  private baseUrl: string
  private apiKey: string

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_CLOUDFLARE_AI_WORKER_URL || 'https://al-dalil-ai-worker.speedofmastry.workers.dev'
    this.apiKey = process.env.NEXT_PUBLIC_CLOUDFLARE_AI_API_KEY || ''
  }

  // Enhanced text generation with intelligent model selection
  async generateText(request: EnhancedAIRequest): Promise<AIModelResponse> {
    const startTime = Date.now()
    
    try {
      // Select the best model for the task
      const selectedModel = request.specificModel 
        ? getModelById(request.specificModel)
        : getBestModelForTask(request.task, request.priority)
      
      if (!selectedModel) {
        throw new Error('No suitable model found for the task')
      }

      console.log(`🤖 Using model: ${selectedModel.name} for task: ${request.task}`)

      // Make the API call
      const response = await fetch(`${this.baseUrl}/ai/${selectedModel.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          prompt: request.prompt,
          options: request.options
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      const duration = Date.now() - startTime

      return {
        success: true,
        result: result,
        model: selectedModel.id,
        timestamp: Date.now(),
        performance: {
          duration,
          tokensUsed: result.tokensUsed
        }
      }

    } catch (error) {
      console.error(`Error with model ${request.specificModel || 'auto-selected'}:`, error)
      
      // Fallback to default model
      if (!request.specificModel) {
        console.log('🔄 Falling back to default model...')
        return this.generateText({
          ...request,
          specificModel: 'text'
        })
      }
      
      throw error
    }
  }

  // Enhanced image generation with intelligent model selection
  async generateImage(request: EnhancedImageRequest): Promise<AIModelResponse> {
    const startTime = Date.now()
    
    try {
      // Select the best image model for the task
      const selectedModel = request.specificModel 
        ? getModelById(request.specificModel)
        : getBestModelForTask('image generation', request.priority)
      
      if (!selectedModel || !selectedModel.capabilities.includes('image-generation')) {
        throw new Error('No suitable image generation model found')
      }

      console.log(`🎨 Using image model: ${selectedModel.name}`)

      // Make the API call
      const response = await fetch(`${this.baseUrl}/ai/${selectedModel.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          prompt: request.prompt,
          options: request.options
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      const duration = Date.now() - startTime

      return {
        success: true,
        result: result,
        model: selectedModel.id,
        timestamp: Date.now(),
        performance: {
          duration
        }
      }

    } catch (error) {
      console.error(`Error with image model ${request.specificModel || 'auto-selected'}:`, error)
      
      // Fallback to stable-diffusion
      if (!request.specificModel) {
        console.log('🔄 Falling back to stable-diffusion...')
        return this.generateImage({
          ...request,
          specificModel: 'image'
        })
      }
      
      throw error
    }
  }

  // Enhanced audio generation (TTS)
  async generateAudio(request: EnhancedAudioRequest): Promise<AIModelResponse> {
    const startTime = Date.now()
    
    try {
      console.log(`🔊 Generating audio with TTS model`)

      // Make the API call
      const response = await fetch(`${this.baseUrl}/ai/tts-1`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          text: request.text,
          voice: request.voice || 'alloy',
          speed: request.speed || 1.0,
          options: request.options
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      const duration = Date.now() - startTime

      return {
        success: true,
        result: result,
        model: 'tts-1',
        timestamp: Date.now(),
        performance: {
          duration
        }
      }

    } catch (error) {
      console.error('Error generating audio:', error)
      throw error
    }
  }

  // Generate Speech-to-Text using AI
  async generateSTT(audio: string, lesson: string, goal: string): Promise<any> {
    try {
      console.log(`[EnhancedCloudflareAI] Generating STT for lesson: ${lesson}`);
      
      // For STT, we need to use the base Cloudflare AI worker
      const response = await fetch(`${this.baseUrl}/ai/whisper`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          audio: audio,
          model: 'whisper-1',
          language: 'en'
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log(`[EnhancedCloudflareAI] STT generated successfully:`, result);
      
      return {
        text: result.text,
        language: result.language || 'en',
        lesson: lesson,
        goal: goal,
        confidence: result.confidence || 0.9
      };
    } catch (error) {
      console.error(`[EnhancedCloudflareAI] Error generating STT:`, error);
      throw error;
    }
  }

  // Batch processing for multiple tasks
  async processBatch(requests: EnhancedAIRequest[]): Promise<AIModelResponse[]> {
    const results: AIModelResponse[] = []
    
    for (const request of requests) {
      try {
        const result = await this.generateText(request)
        results.push(result)
      } catch (error) {
        console.error(`Error processing batch request:`, error)
        results.push({
          success: false,
          result: '' as string | object,
          model: 'unknown',
          timestamp: Date.now()
        })
      }
    }
    
    return results
  }

  // Get available models for a specific task
  getAvailableModels(task: string): AIModel[] {
    return getModelsByCapability(task)
  }

  // Get model information
  getModelInfo(modelId: string): AIModel | undefined {
    return getModelById(modelId)
  }
}

// Export singleton instance
export const enhancedCloudflareAI = new EnhancedCloudflareAI()
