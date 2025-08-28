'use client'

import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { 
  Heart, 
  Smile, 
  Languages,
  Volume2,
  MessageCircle,
  Loader2,
  Zap,
  Send
} from 'lucide-react'
import { cloudflareAI } from '@/lib/services/cloudflare-ai'

interface MoodData {
  arabic: string
  english: string
  emoji: string
  description: string
  aiPersonality: string
  englishStyle: string
}

const commonMoods: MoodData[] = [
  { 
    arabic: 'سعيد', 
    english: 'Happy', 
    emoji: '😊', 
    description: 'Feeling joyful and content',
    aiPersonality: 'cheerful, enthusiastic, and positive',
    englishStyle: 'Use happy expressions, exclamation marks, and upbeat language'
  },
  { 
    arabic: 'حزين', 
    english: 'Sad', 
    emoji: '😢', 
    description: 'Feeling down or sorrowful',
    aiPersonality: 'gentle, supportive, and comforting',
    englishStyle: 'Use gentle words, supportive phrases, and warm language'
  },
  { 
    arabic: 'غاضب', 
    english: 'Angry', 
    emoji: '😠', 
    description: 'Feeling mad or furious',
    aiPersonality: 'strong, direct, and assertive',
    englishStyle: 'Use strong words, direct statements, and firm language'
  },
  { 
    arabic: 'متحمس', 
    english: 'Excited', 
    emoji: '🤩', 
    description: 'Feeling enthusiastic and eager',
    aiPersonality: 'energetic, motivational, and inspiring',
    englishStyle: 'Use energetic words, motivational phrases, and inspiring language'
  },
  { 
    arabic: 'قلق', 
    english: 'Anxious', 
    emoji: '😰', 
    description: 'Feeling worried or nervous',
    aiPersonality: 'calming, reassuring, and patient',
    englishStyle: 'Use calming words, reassuring phrases, and patient language'
  },
  { 
    arabic: 'مرتاح', 
    english: 'Relaxed', 
    emoji: '😌', 
    description: 'Feeling calm and peaceful',
    aiPersonality: 'peaceful, serene, and tranquil',
    englishStyle: 'Use peaceful words, serene phrases, and tranquil language'
  },
  { 
    arabic: 'مشتاق', 
    english: 'Nostalgic', 
    emoji: '🥺', 
    description: 'Feeling sentimental or longing',
    aiPersonality: 'warm, nostalgic, and reflective',
    englishStyle: 'Use warm words, nostalgic phrases, and reflective language'
  },
  { 
    arabic: 'متفائل', 
    english: 'Optimistic', 
    emoji: '😄', 
    description: 'Feeling positive about the future',
    aiPersonality: 'hopeful, encouraging, and bright',
    englishStyle: 'Use hopeful words, encouraging phrases, and bright language'
  },
  { 
    arabic: 'محبط', 
    english: 'Frustrated', 
    emoji: '😤', 
    description: 'Feeling annoyed or discouraged',
    aiPersonality: 'understanding, encouraging, and solution-focused',
    englishStyle: 'Use understanding words, encouraging phrases, and solution-focused language'
  },
  { 
    arabic: 'ممتن', 
    english: 'Grateful', 
    emoji: '🙏', 
    description: 'Feeling thankful and appreciative',
    aiPersonality: 'warm, appreciative, and humble',
    englishStyle: 'Use warm words, appreciative phrases, and humble language'
  }
]

export default function MoodTranslator() {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedMood, setSelectedMood] = useState<MoodData | null>(null)
  const [customMood, setCustomMood] = useState('')
  const [userMessage, setUserMessage] = useState('')
  const [aiResponse, setAiResponse] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [conversationHistory, setConversationHistory] = useState<Array<{user: string, ai: string, mood: string}>>([])

  const handleMoodSelect = (mood: MoodData) => {
    setSelectedMood(mood)
    setCustomMood('')
    setAiResponse('')
    setConversationHistory([])
  }

  const handleCustomMood = () => {
    setSelectedMood(null)
    setAiResponse('')
    setConversationHistory([])
  }

  const generateMoodBasedResponse = async () => {
    if (!userMessage.trim() || (!selectedMood && !customMood.trim())) return

    setIsGenerating(true)
    try {
      const currentMood = selectedMood || { 
        arabic: customMood.trim(), 
        english: 'Custom', 
        emoji: '💭',
        description: 'Custom mood',
        aiPersonality: 'neutral and helpful',
        englishStyle: 'Use appropriate language for the context'
      }

      const prompt = `You are an English teacher helping an Arabic speaker learn English. The student is currently feeling ${currentMood.arabic} (${currentMood.english}) and wants to practice English conversation.

Your personality should be: ${currentMood.aiPersonality}
Your English style should: ${currentMood.englishStyle}

Student's message: "${userMessage}"

Respond in English with the appropriate mood and personality. Keep your response helpful for learning, but match the emotional tone. Use natural, conversational English that would be appropriate for someone feeling this way.

Make sure your response demonstrates how to express this mood in English naturally.`

      const response = await cloudflareAI.generateText(prompt)
      
      if (response.success && response.result) {
        let aiReply = ''
        
        // ROBUST RESPONSE HANDLING - PREVENT REACT ERROR #31
        if (typeof response.result === 'string') {
          aiReply = response.result.trim()
        } else if (response.result && typeof response.result === 'object') {
          // Extract text from nested object structures safely
          const resultObj = response.result as any
          if (resultObj.text && typeof resultObj.text === 'string') {
            aiReply = resultObj.text.trim()
          } else if (resultObj.result && typeof resultObj.result === 'string') {
            aiReply = resultObj.result.trim()
          } else if (resultObj.translated_text && typeof resultObj.translated_text === 'string') {
            aiReply = resultObj.translated_text.trim()
          } else if (resultObj.message && typeof resultObj.message === 'string') {
            aiReply = resultObj.message.trim()
          } else if (resultObj.content && typeof resultObj.content === 'string') {
            aiReply = resultObj.content.trim()
          } else if (resultObj.response && typeof resultObj.response === 'string') {
            aiReply = resultObj.response.trim()
          } else {
            // Last resort: try to extract any string value
            const stringValues = Object.values(resultObj).filter(val => typeof val === 'string')
            if (stringValues.length > 0) {
              aiReply = stringValues[0].trim()
            } else {
              // Convert object to readable string
              aiReply = 'AI response received but could not extract text content.'
            }
          }
        } else {
          // Fallback for any other type
          aiReply = String(response.result)
        }
        
        // Ensure we have a valid string
        if (!aiReply || aiReply.trim() === '') {
          aiReply = 'Sorry, I could not generate a response. Please try again.'
        }
        
        setAiResponse(aiReply)
        
        // Add to conversation history
        setConversationHistory(prev => [...prev, {
          user: userMessage,
          ai: aiReply,
          mood: currentMood.arabic
        }])
        
        setUserMessage('')
      } else {
        setAiResponse('Sorry, I could not generate a response. Please try again.')
      }
    } catch (error) {
      console.error('AI response generation error:', error)
      setAiResponse('Sorry, there was an error. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const generateAudio = async (text: string) => {
    try {
      console.log('🎵 Starting TTS generation for:', text)
      
      const response = await cloudflareAI.generateSpeech(text, 'en')
      console.log('🎵 TTS Response received:', response)
      
      if (response.success && response.result) {
        console.log('🎵 TTS successful, result type:', typeof response.result)
        console.log('🎵 Result length:', typeof response.result === 'string' ? response.result.length : 'N/A')
        
        const audio = new Audio(`data:audio/wav;base64,${response.result}`)
        console.log('🎵 Audio element created')
        
        audio.play()
        console.log('🎵 Audio play() called')
      } else {
        console.error('🎵 TTS failed:', response.error || 'Unknown error')
        console.error('🎵 Full response:', response)
      }
    } catch (error) {
      console.error('🎵 TTS generation error:', error)
      if (error instanceof Error) {
        console.error('🎵 Error details:', {
          name: error.name,
          message: error.message,
          stack: error.stack
        })
      } else {
        console.error('🎵 Unknown error type:', typeof error)
      }
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center space-x-2 space-x-reverse text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg px-3 py-2 transition-colors"
        >
          <Heart className="h-4 w-4 text-red-500" />
          <span className="hidden sm:inline">مترجم المزاج</span>
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-2xl font-bold text-center">
            <Heart className="h-6 w-6 text-red-500" />
            <span>مترجم المزاج - تعلم الإنجليزية حسب مزاجك</span>
            <MessageCircle className="h-6 w-6 text-blue-500" />
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground">
            اختر مزاجك وتحدث مع AI يتكيف مع مشاعرك لتعلم الإنجليزية
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Mood Selection */}
          <Card className="bg-gradient-to-r from-pink-50 to-red-50 border-2 border-pink-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-pink-800">
                <Smile className="h-5 w-5" />
                <span>اختر مزاجك للتعلم</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
                {commonMoods.map((mood) => (
                  <Button
                    key={mood.arabic}
                    variant={selectedMood?.arabic === mood.arabic ? "default" : "outline"}
                    onClick={() => handleMoodSelect(mood)}
                    className="flex flex-col items-center space-y-2 h-auto py-4 px-3 text-center"
                  >
                    <span className="text-2xl">{mood.emoji}</span>
                    <span className="text-xs font-medium">{mood.arabic}</span>
                    <span className="text-xs text-muted-foreground">{mood.english}</span>
                  </Button>
                ))}
              </div>
              
              <div className="space-y-3">
                <Textarea
                  placeholder="أو اكتب مزاجك الخاص..."
                  value={customMood}
                  onChange={(e) => setCustomMood(e.target.value)}
                  className="min-h-[80px] text-right"
                  dir="rtl"
                />
                <Button
                  onClick={handleCustomMood}
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  استخدام النص المخصص
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Selected Mood Info */}
          {selectedMood && (
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-blue-800">
                  <span>مزاجك المختار للتعلم</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-3">
                  <div className="text-4xl">{selectedMood.emoji}</div>
                  <h3 className="text-2xl font-bold text-blue-900">{selectedMood.arabic}</h3>
                  <p className="text-blue-700">{selectedMood.description}</p>
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>AI Personality:</strong> {selectedMood.aiPersonality}
                    </p>
                    <p className="text-sm text-blue-800">
                      <strong>English Style:</strong> {selectedMood.englishStyle}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Conversation Interface */}
          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-green-800">
                <MessageCircle className="h-5 w-5" />
                <span>تحدث مع AI حسب مزاجك</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Conversation History */}
                {conversationHistory.length > 0 && (
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {conversationHistory.map((conv, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-start space-x-2 space-x-reverse">
                          <div className="bg-blue-100 p-2 rounded-lg">
                            <p className="text-sm text-blue-800">أنت (مزاج: {conv.mood})</p>
                            <p className="text-sm">{conv.user}</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-2 space-x-reverse justify-end">
                          <div className="bg-green-100 p-2 rounded-lg max-w-xs">
                            <p className="text-sm text-green-800">AI</p>
                            <p className="text-sm">{conv.ai}</p>
                            <Button
                              onClick={() => generateAudio(conv.ai)}
                              size="sm"
                              variant="ghost"
                              className="h-6 w-6 p-0 mt-1"
                            >
                              <Volume2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Input Area */}
                <div className="space-y-3">
                  <Textarea
                    placeholder="اكتب رسالتك هنا... (Write your message here...)"
                    value={userMessage}
                    onChange={(e) => setUserMessage(e.target.value)}
                    className="min-h-[100px]"
                    dir="auto"
                  />
                  <Button
                    onClick={generateMoodBasedResponse}
                    disabled={isGenerating || !userMessage.trim() || (!selectedMood && !customMood.trim())}
                    size="lg"
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 w-full"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="h-5 w-5 ml-2 animate-spin" />
                        جاري إنشاء الرد...
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5 ml-2" />
                        تحدث مع AI حسب مزاجك
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* How It Works */}
          <Card className="bg-gradient-to-r from-yellow-50 to-amber-50 border-2 border-yellow-200">
            <CardContent className="p-4">
              <div className="text-center space-y-2">
                <div className="text-2xl">💡</div>
                <h4 className="font-semibold text-yellow-800">كيف يعمل مترجم المزاج؟</h4>
                <ul className="text-sm text-yellow-700 space-y-1 text-right" dir="rtl">
                  <li>• اختر مزاجك (سعيد، حزين، غاضب، إلخ)</li>
                  <li>• AI يتغير شخصيته ليتناسب مع مزاجك</li>
                  <li>• تعلم كيف تتحدث الإنجليزية بطرق مختلفة</li>
                  <li>• مارس المحادثة مع ردود مناسبة للمزاج</li>
                  <li>• استمع للنطق الصحيح لكل رد</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
