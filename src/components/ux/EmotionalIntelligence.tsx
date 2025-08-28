'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Heart, 
  Smile, 
  Frown, 
  Meh, 
  Zap, 
  Coffee, 
  Moon, 
  Sun,
  Brain,
  Sparkles,
  Target,
  TrendingUp,
  Activity,
  Clock,
  Star
} from 'lucide-react'

interface MoodState {
  id: string
  name: string
  nameArabic: string
  emoji: string
  color: string
  bg: string
  energy: number
  focus: number
  aiPersonality: string
  aiPersonalityArabic: string
  learningStyle: string
  recommendedActivities: string[]
}

interface EmotionalContext {
  currentMood: MoodState
  energyLevel: number
  focusLevel: number
  stressLevel: number
  motivationLevel: number
  lastMoodChange: Date
  moodHistory: Array<{ mood: string; timestamp: Date; context: string }>
}

export default function EmotionalIntelligence() {
  const [emotionalContext, setEmotionalContext] = useState<EmotionalContext>({
    currentMood: defaultMoods[0],
    energyLevel: 7,
    focusLevel: 6,
    stressLevel: 3,
    motivationLevel: 8,
    lastMoodChange: new Date(),
    moodHistory: []
  })
  const [showMoodSelector, setShowMoodSelector] = useState(false)
  const [currentActivity, setCurrentActivity] = useState<string>('')
  const [aiResponse, setAiResponse] = useState<string>('')

  const defaultMoods: MoodState[] = [
    {
      id: 'energetic',
      name: 'Energetic & Motivated',
      nameArabic: 'نشيط ومتحمس',
      emoji: '⚡',
      color: 'text-yellow-600',
      bg: 'bg-yellow-50 dark:bg-yellow-950/20',
      energy: 9,
      focus: 8,
      aiPersonality: 'Enthusiastic, encouraging, and high-energy',
      aiPersonalityArabic: 'متحمس، مشجع، وعالي الطاقة',
      learningStyle: 'Fast-paced, interactive, challenging',
      recommendedActivities: ['Complex grammar exercises', 'Speed reading', 'Advanced vocabulary games']
    },
    {
      id: 'focused',
      name: 'Focused & Calm',
      nameArabic: 'مركّز وهادئ',
      emoji: '🎯',
      color: 'text-blue-600',
      bg: 'bg-blue-50 dark:bg-blue-950/20',
      energy: 6,
      focus: 9,
      aiPersonality: 'Patient, analytical, and detail-oriented',
      aiPersonalityArabic: 'صبور، محلل، ومركز على التفاصيل',
      learningStyle: 'Structured, methodical, comprehensive',
      recommendedActivities: ['Grammar deep-dives', 'Writing exercises', 'Pronunciation practice']
    },
    {
      id: 'relaxed',
      name: 'Relaxed & Open',
      nameArabic: 'مسترخي ومنفتح',
      emoji: '😌',
      color: 'text-green-600',
      bg: 'bg-green-50 dark:bg-green-950/20',
      energy: 5,
      focus: 7,
      aiPersonality: 'Gentle, supportive, and nurturing',
      aiPersonalityArabic: 'لطيف، داعم، ومربي',
      learningStyle: 'Conversational, story-based, gentle',
      recommendedActivities: ['Conversation practice', 'Story reading', 'Casual vocabulary']
    },
    {
      id: 'tired',
      name: 'Tired but Willing',
      nameArabic: 'متعب لكن مستعد',
      emoji: '😴',
      color: 'text-purple-600',
      bg: 'bg-purple-50 dark:bg-purple-950/20',
      energy: 3,
      focus: 4,
      aiPersonality: 'Understanding, gentle, and encouraging',
      aiPersonalityArabic: 'فهم، لطيف، ومشجع',
      learningStyle: 'Light, review-based, confidence-building',
      recommendedActivities: ['Review sessions', 'Easy listening', 'Confidence exercises']
    },
    {
      id: 'stressed',
      name: 'Stressed & Overwhelmed',
      nameArabic: 'متوتر ومتعب',
      emoji: '😰',
      color: 'text-red-600',
      bg: 'bg-red-50 dark:bg-red-950/20',
      energy: 4,
      focus: 3,
      aiPersonality: 'Calming, reassuring, and stress-reducing',
      aiPersonalityArabic: 'مهدئ، مطمئن، ومقلل للتوتر',
      learningStyle: 'Simple, stress-free, achievement-focused',
      recommendedActivities: ['Basic review', 'Simple conversations', 'Achievement activities']
    },
    {
      id: 'excited',
      name: 'Excited & Curious',
      nameArabic: 'متحمس ومتسائل',
      emoji: '🤩',
      color: 'text-pink-600',
      bg: 'bg-pink-50 dark:bg-pink-950/20',
      energy: 8,
      focus: 7,
      aiPersonality: 'Excited, curious, and discovery-focused',
      aiPersonalityArabic: 'متحمس، متسائل، ومركز على الاكتشاف',
      learningStyle: 'Exploratory, discovery-based, fun',
      recommendedActivities: ['New topics exploration', 'Interactive games', 'Creative exercises']
    }
  ]

  const updateMood = (mood: MoodState) => {
    const newContext: EmotionalContext = {
      ...emotionalContext,
      currentMood: mood,
      energyLevel: mood.energy,
      focusLevel: mood.focus,
      lastMoodChange: new Date(),
      moodHistory: [
        ...emotionalContext.moodHistory,
        {
          mood: mood.name,
          timestamp: new Date(),
          context: currentActivity || 'Mood change'
        }
      ]
    }
    
    setEmotionalContext(newContext)
    setShowMoodSelector(false)
    
    // Generate AI response based on new mood
    generateAIResponse(mood)
  }

  const generateAIResponse = (mood: MoodState) => {
    const responses = {
      energetic: `مرحباً! أرى أنك نشيط ومتحمس اليوم! 🚀 هذا وقت مثالي لتعلم شيء جديد ومتقدم. سأكون متحمساً معك وسأقدم تحديات مثيرة لتحافظ على طاقتك العالية!`,
      focused: `أهلاً! أنت تبدو مركّزاً وهادئاً اليوم 🎯 هذا مثالي للتعلم العميق والتفصيلي. سأكون صبوراً معك وسأركز على التفاصيل المهمة.`,
      relaxed: `مرحباً! أرى أنك مسترخي ومنفتح اليوم 😌 هذا وقت رائع للتعلم المريح والمحادثات الودية. سأكون لطيفاً معك وسأركز على بناء ثقتك.`,
      tired: `أهلاً! أرى أنك متعب لكن مستعد للتعلم 😴 هذا رائع! سأكون لطيفاً معك وسأركز على المراجعة البسيطة لبناء ثقتك.`,
      stressed: `مرحباً! أرى أنك متوتر اليوم 😰 لا تقلق، سأكون هادئاً معك وسأركز على التعلم البسيط والمريح. سنأخذ الأمور خطوة بخطوة.`,
      excited: `مرحباً! أنت تبدو متحمساً ومتسائلاً اليوم! 🤩 هذا رائع! سأكون متحمساً معك وسأركز على الاكتشاف والتعلم الممتع!`
    }
    
    setAiResponse(responses[mood.id as keyof typeof responses] || 'مرحباً! كيف حالك اليوم؟')
  }

  const getRecommendedActivity = () => {
    const mood = emotionalContext.currentMood
    if (mood.recommendedActivities.length > 0) {
      return mood.recommendedActivities[Math.floor(Math.random() * mood.recommendedActivities.length)]
    }
    return 'Personalized lesson based on your mood'
  }

  const getMoodInsights = () => {
    const mood = emotionalContext.currentMood
    const insights = {
      energy: `طاقتك: ${mood.energy}/10`,
      focus: `تركيزك: ${mood.focus}/10`,
      style: `أسلوب التعلم: ${mood.learningStyle}`,
      personality: `شخصية AI: ${mood.aiPersonalityArabic}`
    }
    return insights
  }

  return (
    <div className="space-y-6">
      {/* Emotional Intelligence Header */}
      <Card className="bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-950/20 dark:to-rose-950/20 border-2 border-pink-200 dark:border-pink-600">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Heart className="h-8 w-8 text-pink-600" />
            <h2 className="text-2xl font-bold text-pink-900 dark:text-pink-100">
              الذكاء العاطفي
            </h2>
            <Brain className="h-8 w-8 text-purple-600" />
          </div>
          <p className="text-gray-600 dark:text-gray-300">
            Emotional Intelligence - AI Adapts to Your Mood
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Current Mood Display */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 border-2 border-current text-center"
            style={{ borderColor: emotionalContext.currentMood.color.replace('text-', '') }}
          >
            <div className="text-6xl mb-4">{emotionalContext.currentMood.emoji}</div>
            <h3 className="text-2xl font-bold mb-2">
              {emotionalContext.currentMood.nameArabic}
            </h3>
            <p className="text-lg opacity-80 mb-4">
              {emotionalContext.currentMood.name}
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {emotionalContext.energyLevel}/10
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">الطاقة / Energy</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {emotionalContext.focusLevel}/10
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">التركيز / Focus</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {emotionalContext.stressLevel}/10
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">التوتر / Stress</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {emotionalContext.motivationLevel}/10
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">الدافع / Motivation</div>
              </div>
            </div>
            
            <Button
              onClick={() => setShowMoodSelector(true)}
              className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white h-12 px-8"
              size="lg"
            >
              تغيير المزاج / Change Mood
            </Button>
          </motion.div>

          {/* AI Personality Response */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20 rounded-lg p-6 border-2 border-purple-200 dark:border-purple-600"
          >
            <div className="flex items-center space-x-3 space-x-reverse mb-4">
              <Sparkles className="h-6 w-6 text-purple-600" />
              <h3 className="text-xl font-bold text-purple-900 dark:text-purple-100">
                شخصية الذكاء الاصطناعي / AI Personality
              </h3>
            </div>
            
            <div className="space-y-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  Arabic / العربية
                </div>
                <div className="text-purple-800 dark:text-purple-300">
                  {emotionalContext.currentMood.aiPersonalityArabic}
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  English / الإنجليزية
                </div>
                <div className="text-purple-800 dark:text-purple-300">
                  {emotionalContext.currentMood.aiPersonality}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Recommended Activities */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-lg p-6 border-2 border-green-200 dark:border-green-600"
          >
            <div className="flex items-center space-x-3 space-x-reverse mb-4">
              <Target className="h-6 w-6 text-green-600" />
              <h3 className="text-xl font-bold text-green-900 dark:text-green-100">
                الأنشطة الموصى بها / Recommended Activities
              </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {emotionalContext.currentMood.recommendedActivities.map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-green-200 dark:border-green-600"
                >
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <Star className="h-5 w-5 text-green-600" />
                    <span className="text-green-800 dark:text-green-300">{activity}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </CardContent>
      </Card>

      {/* Mood Selector Modal */}
      <AnimatePresence>
        {showMoodSelector && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 rounded-lg shadow-xl"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    اختر مزاجك / Choose Your Mood
                  </h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowMoodSelector(false)}
                    className="h-10 w-10 p-0"
                  >
                    ×
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {defaultMoods.map((mood) => (
                    <motion.div
                      key={mood.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Card 
                        className={`${mood.bg} border-2 border-current ${mood.color} cursor-pointer hover:shadow-lg transition-all duration-300`}
                        onClick={() => {
                          setEmotionalContext(prev => ({
                            ...prev,
                            currentMood: mood,
                            lastMoodChange: new Date()
                          }))
                          setShowMoodSelector(false)
                        }}
                      >
                        <CardContent className="p-6 text-center">
                          <div className="text-4xl mb-3">{mood.emoji}</div>
                          <h4 className="text-lg font-bold mb-2">
                            {mood.nameArabic}
                          </h4>
                          <p className="text-sm opacity-80 mb-3">
                            {mood.name}
                          </p>
                          
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                              <div className="font-semibold">الطاقة / Energy</div>
                              <div className="opacity-80">{mood.energy}/10</div>
                            </div>
                            <div>
                              <div className="font-semibold">التركيز / Focus</div>
                              <div className="opacity-80">{mood.focus}/10</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
