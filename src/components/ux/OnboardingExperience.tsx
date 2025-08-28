'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { 
  Heart, 
  Brain, 
  Target, 
  Star, 
  Sparkles, 
  BookOpen, 
  Play, 
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Globe,
  User,
  Trophy,
  Zap,
  Clock,
  Briefcase
} from 'lucide-react'

interface OnboardingStep {
  id: string
  title: string
  titleArabic: string
  description: string
  descriptionArabic: string
  icon: React.ElementType
  color: string
  bg: string
  content: React.ReactNode
}

interface UserPreferences {
  name: string
  language: 'ar' | 'en'
  level: 'beginner' | 'intermediate' | 'advanced'
  goals: string[]
  learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'mixed'
  dailyGoal: '15min' | '30min' | '1hour' | 'flexible'
}

export default function OnboardingExperience() {
  const [currentStep, setCurrentStep] = useState(0)
  const [userPreferences, setUserPreferences] = useState<UserPreferences>({
    name: '',
    language: 'ar',
    level: 'beginner',
    goals: [],
    learningStyle: 'mixed',
    dailyGoal: '30min'
  })
  const [showOnboarding, setShowOnboarding] = useState(true)

  const onboardingSteps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to Al-Dalil!',
      titleArabic: 'مرحباً بك في الدليل!',
      description: 'Your personal AI-powered English learning journey begins here',
      descriptionArabic: 'رحلة تعلم اللغة الإنجليزية بالذكاء الاصطناعي تبدأ من هنا',
      icon: Sparkles,
      color: 'text-purple-600',
      bg: 'bg-purple-50 dark:bg-purple-950/20',
      content: (
        <div className="text-center space-y-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
            className="w-24 h-24 mx-auto bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center"
          >
            <Sparkles className="w-12 h-12 text-white" />
          </motion.div>
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              مرحباً بك في الدليل!
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-md mx-auto">
              رحلة تعلم اللغة الإنجليزية بالذكاء الاصطناعي تبدأ من هنا
            </p>
            <p className="text-base text-gray-500 dark:text-gray-400 max-w-md mx-auto">
              Your personal AI-powered English learning journey begins here
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'personalization',
      title: 'Personalize Your Experience',
      titleArabic: 'خصّص تجربتك',
      description: 'Tell us about yourself to create your perfect learning path',
      descriptionArabic: 'أخبرنا عن نفسك لإنشاء مسار التعلم المثالي لك',
      icon: User,
      color: 'text-blue-600',
      bg: 'bg-blue-50 dark:bg-blue-950/20',
      content: (
        <div className="space-y-6">
          <div className="text-center space-y-4">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              خصّص تجربتك
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Tell us about yourself to create your perfect learning path
            </p>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-right">
                اسمك / Your Name
              </label>
              <input
                type="text"
                value={userPreferences.name}
                onChange={(e) => setUserPreferences(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-right"
                placeholder="أدخل اسمك / Enter your name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-right">
                اللغة المفضلة / Preferred Language
              </label>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant={userPreferences.language === 'ar' ? 'default' : 'outline'}
                  onClick={() => setUserPreferences(prev => ({ ...prev, language: 'ar' }))}
                  className="h-12"
                >
                  العربية
                </Button>
                <Button
                  variant={userPreferences.language === 'en' ? 'default' : 'outline'}
                  onClick={() => setUserPreferences(prev => ({ ...prev, language: 'en' }))}
                  className="h-12"
                >
                  English
                </Button>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'level-assessment',
      title: 'Assess Your Level',
      titleArabic: 'قيّم مستواك',
      description: 'Quick assessment to place you at the right starting point',
      descriptionArabic: 'تقييم سريع لوضعك في نقطة البداية الصحيحة',
      icon: Target,
      color: 'text-green-600',
      bg: 'bg-green-50 dark:bg-green-950/20',
      content: (
        <div className="space-y-6">
          <div className="text-center space-y-4">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              قيّم مستواك
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Quick assessment to place you at the right starting point
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              {[
                { id: 'beginner', label: 'مبتدئ', english: 'Beginner', description: 'أبدأ من الصفر / Start from scratch' },
                { id: 'intermediate', label: 'متوسط', english: 'Intermediate', description: 'أعرف الأساسيات / Know the basics' },
                { id: 'advanced', label: 'متقدم', english: 'Advanced', description: 'أريد التطوير / Want to improve' }
              ].map((level) => (
                <Button
                  key={level.id}
                  variant={userPreferences.level === level.id ? 'default' : 'outline'}
                  onClick={() => setUserPreferences(prev => ({ ...prev, level: level.id as any }))}
                  className="h-16 justify-start text-right"
                >
                  <div className="flex flex-col items-start space-y-1">
                    <span className="font-semibold">{level.label} / {level.english}</span>
                    <span className="text-sm opacity-80">{level.description}</span>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'learning-goals',
      title: 'Set Your Learning Goals',
      titleArabic: 'حدد أهداف التعلم',
      description: 'What do you want to achieve with English?',
      descriptionArabic: 'ماذا تريد أن تحقق باللغة الإنجليزية؟',
      icon: Trophy,
      color: 'text-yellow-600',
      bg: 'bg-yellow-50 dark:bg-yellow-950/20',
      content: (
        <div className="space-y-6">
          <div className="text-center space-y-4">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              حدد أهداف التعلم
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              What do you want to achieve with English?
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'travel', label: 'السفر', english: 'Travel', icon: Globe },
                { id: 'work', label: 'العمل', english: 'Work', icon: Briefcase },
                { id: 'study', label: 'الدراسة', english: 'Study', icon: BookOpen },
                { id: 'social', label: 'التواصل', english: 'Social', icon: Heart }
              ].map((goal) => {
                const GoalIcon = goal.icon
                return (
                  <Button
                    key={goal.id}
                    variant={userPreferences.goals.includes(goal.id) ? 'default' : 'outline'}
                    onClick={() => {
                      const newGoals = userPreferences.goals.includes(goal.id)
                        ? userPreferences.goals.filter(g => g !== goal.id)
                        : [...userPreferences.goals, goal.id]
                      setUserPreferences(prev => ({ ...prev, goals: newGoals }))
                    }}
                    className="h-20 flex-col space-y-2"
                  >
                    <GoalIcon className="w-6 h-6" />
                    <div className="text-center">
                      <div className="font-semibold">{goal.label}</div>
                      <div className="text-xs opacity-80">{goal.english}</div>
                    </div>
                  </Button>
                )
              })}
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'learning-style',
      title: 'Discover Your Learning Style',
      titleArabic: 'اكتشف أسلوب تعلمك',
      description: 'How do you learn best?',
      descriptionArabic: 'كيف تتعلم بشكل أفضل؟',
      icon: Brain,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50 dark:bg-indigo-950/20',
      content: (
        <div className="space-y-6">
          <div className="text-center space-y-4">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              اكتشف أسلوب تعلمك
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              How do you learn best?
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              {[
                { id: 'visual', label: 'بصري', english: 'Visual', description: 'أتعلم من الصور والفيديوهات / Learn from images and videos' },
                { id: 'auditory', label: 'سمعي', english: 'Auditory', description: 'أتعلم من الاستماع والتحدث / Learn from listening and speaking' },
                { id: 'kinesthetic', label: 'حركي', english: 'Kinesthetic', description: 'أتعلم من الممارسة والتفاعل / Learn from practice and interaction' },
                { id: 'mixed', label: 'مختلط', english: 'Mixed', description: 'مزيج من جميع الأساليب / Mix of all styles' }
              ].map((style) => (
                <Button
                  key={style.id}
                  variant={userPreferences.learningStyle === style.id ? 'default' : 'outline'}
                  onClick={() => setUserPreferences(prev => ({ ...prev, learningStyle: style.id as any }))}
                  className="h-16 justify-start text-right"
                >
                  <div className="flex flex-col items-start space-y-1">
                    <span className="font-semibold">{style.label} / {style.english}</span>
                    <span className="text-sm opacity-80">{style.description}</span>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'daily-commitment',
      title: 'Set Your Daily Commitment',
      titleArabic: 'حدد التزامك اليومي',
      description: 'How much time can you dedicate to learning?',
      descriptionArabic: 'كم من الوقت يمكنك تخصيصه للتعلم؟',
      icon: Clock,
      color: 'text-orange-600',
      bg: 'bg-orange-50 dark:bg-orange-950/20',
      content: (
        <div className="space-y-6">
          <div className="text-center space-y-4">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              حدد التزامك اليومي
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              How much time can you dedicate to learning?
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: '15min', label: '15 دقيقة', english: '15 minutes', description: 'مبتدئ / Beginner' },
                { id: '30min', label: '30 دقيقة', english: '30 minutes', description: 'مستحسن / Recommended' },
                { id: '1hour', label: 'ساعة واحدة', english: '1 hour', description: 'متقدم / Advanced' },
                { id: 'flexible', label: 'مرن', english: 'Flexible', description: 'حسب الوقت المتاح / As time allows' }
              ].map((time) => (
                <Button
                  key={time.id}
                  variant={userPreferences.dailyGoal === time.id ? 'default' : 'outline'}
                  onClick={() => setUserPreferences(prev => ({ ...prev, dailyGoal: time.id as any }))}
                  className="h-20 flex-col space-y-2"
                >
                  <div className="text-center">
                    <div className="font-semibold">{time.label}</div>
                    <div className="text-xs opacity-80">{time.english}</div>
                    <div className="text-xs opacity-60">{time.description}</div>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'completion',
      title: 'You\'re All Set!',
      titleArabic: 'أنت جاهز!',
      description: 'Your personalized learning journey is ready to begin',
      descriptionArabic: 'رحلة التعلم المخصصة جاهزة للبدء',
      icon: CheckCircle,
      color: 'text-green-600',
      bg: 'bg-green-50 dark:bg-green-950/20',
      content: (
        <div className="text-center space-y-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className="w-24 h-24 mx-auto bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center"
          >
            <CheckCircle className="w-12 h-12 text-white" />
          </motion.div>
          
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              أنت جاهز!
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Your personalized learning journey is ready to begin
            </p>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 space-y-3 text-right">
              <div className="flex justify-between items-center">
                <span className="text-gray-500 dark:text-gray-400">Name / الاسم:</span>
                <span className="font-semibold">{userPreferences.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 dark:text-gray-400">Level / المستوى:</span>
                <span className="font-semibold">{userPreferences.level}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 dark:text-gray-400">Daily Goal / الهدف اليومي:</span>
                <span className="font-semibold">{userPreferences.dailyGoal}</span>
              </div>
            </div>
            
            <p className="text-sm text-gray-500 dark:text-gray-400">
              We'll use this information to create your perfect learning experience
            </p>
          </div>
        </div>
      )
    }
  ]

  const nextStep = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const completeOnboarding = () => {
    setShowOnboarding(false)
    // Save user preferences to localStorage or backend
    localStorage.setItem('userPreferences', JSON.stringify(userPreferences))
    localStorage.setItem('onboardingCompleted', 'true')
  }

  const progress = ((currentStep + 1) / onboardingSteps.length) * 100

  if (!showOnboarding) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-2xl max-h-[90vh] overflow-hidden"
      >
        <Card className="h-full">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 space-x-reverse">
                <div className={`p-2 rounded-lg ${onboardingSteps[currentStep].bg}`}>
                  {(() => {
                    const IconComponent = onboardingSteps[currentStep].icon
                    return <IconComponent className={`w-6 h-6 ${onboardingSteps[currentStep].color}`} />
                  })()}
                </div>
                <div>
                  <CardTitle className="text-lg">{onboardingSteps[currentStep].titleArabic}</CardTitle>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{onboardingSteps[currentStep].title}</p>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  {currentStep + 1} من {onboardingSteps.length}
                </div>
                <Progress value={progress} className="w-24" />
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {onboardingSteps[currentStep].content}
              </motion.div>
            </AnimatePresence>
            
            <div className="flex justify-between pt-4">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 0}
                className="flex items-center space-x-2 space-x-reverse"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>السابق</span>
              </Button>
              
              {currentStep === onboardingSteps.length - 1 ? (
                <Button
                  onClick={completeOnboarding}
                  className="flex items-center space-x-2 space-x-reverse bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                >
                  <span>ابدأ التعلم!</span>
                  <Play className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  onClick={nextStep}
                  disabled={
                    (currentStep === 0 && !userPreferences.name) ||
                    (currentStep === 1 && userPreferences.level === '') ||
                    (currentStep === 2 && userPreferences.goals.length === 0) ||
                    (currentStep === 3 && userPreferences.learningStyle === '') ||
                    (currentStep === 4 && userPreferences.dailyGoal === '')
                  }
                  className="flex items-center space-x-2 space-x-reverse"
                >
                  <span>التالي</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
