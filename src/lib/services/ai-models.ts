// AI Models Service - Comprehensive Model Management
// This service provides access to all available AI models for different tasks

export interface AIModel {
  id: string
  name: string
  provider: string
  description: string
  capabilities: string[]
  bestFor: string[]
  maxTokens?: number
  cost?: string
}

export interface AIModelResponse {
  success: boolean
  result: unknown
  model: string
  timestamp: number
  performance?: {
    duration: number
    tokensUsed?: number
  }
}

// Text Generation Models - Updated to match actual worker endpoints
export const TEXT_MODELS: AIModel[] = [
  {
    id: 'text', // This maps to /ai/text endpoint
    name: 'Llama 2 7B Chat',
    provider: 'Meta',
    description: 'Fast, efficient chat model for general conversations',
    capabilities: ['text-generation', 'chat', 'instruction-following'],
    bestFor: ['general-chat', 'simple-tasks', 'fast-responses'],
    maxTokens: 4096
  },
  {
    id: 'llama-3-3', // This maps to /ai/llama-3-3 endpoint
    name: 'Llama 3.3 70B',
    provider: 'Meta',
    description: 'High-performance model for complex reasoning',
    capabilities: ['text-generation', 'reasoning', 'analysis', 'creative-writing'],
    bestFor: ['complex-tasks', 'analysis', 'creative-content', 'reasoning'],
    maxTokens: 8192
  },
  {
    id: 'mistral', // This maps to /ai/mistral endpoint
    name: 'Mistral 7B Instruct',
    provider: 'Mistral AI',
    description: 'Efficient instruction-following model',
    capabilities: ['instruction-following', 'text-generation', 'task-completion'],
    bestFor: ['instructions', 'task-execution', 'structured-outputs'],
    maxTokens: 4096
  },
  {
    id: 'gpt-oss', // This maps to /ai/gpt-oss endpoint
    name: 'GPT-OSS 120B',
    provider: 'Open Source',
    description: 'Large-scale open source language model',
    capabilities: ['text-generation', 'reasoning', 'analysis', 'creative-writing'],
    bestFor: ['complex-reasoning', 'analysis', 'creative-content', 'research'],
    maxTokens: 16384
  }
]

// Image Generation Models - Updated to match actual worker endpoints
export const IMAGE_MODELS: AIModel[] = [
  {
    id: 'image', // This maps to /ai/image endpoint
    name: 'Stable Diffusion XL',
    provider: 'Stability AI',
    description: 'High-quality image generation with artistic control',
    capabilities: ['image-generation', 'artistic-styles', 'detailed-images'],
    bestFor: ['artistic-images', 'detailed-scenes', 'creative-visuals'],
    cost: 'Low'
  },
  {
    id: 'lightning', // This maps to /ai/lightning endpoint
    name: 'SDXL Lightning',
    provider: 'Stability AI',
    description: 'Ultra-fast image generation with good quality',
    capabilities: ['fast-generation', 'image-generation', 'quick-iterations'],
    bestFor: ['quick-prototypes', 'fast-iterations', 'real-time-generation'],
    cost: 'Very Low'
  },
  {
    id: 'dreamshaper', // This maps to /ai/dreamshaper endpoint
    name: 'Dreamshaper 8 LCM',
    provider: 'Stability AI',
    description: 'Photorealistic image generation',
    capabilities: ['image-generation', 'photorealistic', 'high-quality'],
    bestFor: ['realistic-images', 'high-quality-visuals', 'professional-content'],
    cost: 'Medium'
  }
]

// Audio Models - Updated to match actual worker endpoints
export const AUDIO_MODELS: AIModel[] = [
  {
    id: 'tts', // This maps to /ai/tts endpoint
    name: 'MeloTTS',
    provider: 'Open Source',
    description: 'High-quality text-to-speech conversion',
    capabilities: ['text-to-speech', 'voice-synthesis', 'multiple-voices'],
    bestFor: ['audio-content', 'voice-overs', 'accessibility'],
    cost: 'Medium'
  }
]

// Function to get best model for specific task
export function getBestModelForTask(task: string, priority: 'speed' | 'quality' | 'cost' = 'quality'): AIModel {
  const taskLower = task.toLowerCase()
  
  // Text generation tasks
  if (taskLower.includes('chat') || taskLower.includes('conversation')) {
    return priority === 'speed' ? TEXT_MODELS[0] : TEXT_MODELS[1]
  }
  
  if (taskLower.includes('reasoning') || taskLower.includes('analysis')) {
    return TEXT_MODELS[2] // Mistral for reasoning
  }
  
  if (taskLower.includes('creative') || taskLower.includes('writing')) {
    return TEXT_MODELS[1] // Llama 3.3 for creative tasks
  }
  
  if (taskLower.includes('instruction') || taskLower.includes('task')) {
    return TEXT_MODELS[2] // Mistral for instructions
  }
  
  // Image generation tasks
  if (taskLower.includes('image') || taskLower.includes('visual')) {
    return priority === 'speed' ? IMAGE_MODELS[1] : IMAGE_MODELS[0]
  }
  
  // Default fallback
  return TEXT_MODELS[0]
}

// Function to get all models for a specific capability
export function getModelsByCapability(capability: string): AIModel[] {
  const allModels = [...TEXT_MODELS, ...IMAGE_MODELS, ...AUDIO_MODELS]
  return allModels.filter(model => 
    model.capabilities.some(cap => cap.toLowerCase().includes(capability.toLowerCase()))
  )
}

// Function to get model by ID
export function getModelById(id: string): AIModel | undefined {
  const allModels = [...TEXT_MODELS, ...IMAGE_MODELS, ...AUDIO_MODELS]
  return allModels.find(model => model.id === id)
}

// Function to get models by provider
export function getModelsByProvider(provider: string): AIModel[] {
  const allModels = [...TEXT_MODELS, ...IMAGE_MODELS, ...AUDIO_MODELS]
  return allModels.filter(model => 
    model.provider.toLowerCase().includes(provider.toLowerCase())
  )
}
