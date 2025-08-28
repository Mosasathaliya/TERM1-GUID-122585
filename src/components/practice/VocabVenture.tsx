"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  BookOpen, 
  Lightbulb, 
  Volume2, 
  Copy,
  RotateCcw,
  Sparkles,
  Map,
  Sword,
  Shield,
  Heart
} from 'lucide-react'

interface AdventureScene {
  id: string
  title: string
  description: string
  image: string
  vocabulary: Array<{
    word: string
    translation: string
    example: string
  }>
  choices: Array<{
    id: string
    text: string
    description: string
  }>
}

const mockScenes: AdventureScene[] = [
  {
    id: '1',
    title: 'بداية المغامرة',
    description: 'أنت في غابة سحرية مليئة بالأشجار العالية والألوان الزاهية. الشمس تشرق من خلال الأوراق الخضراء، وتسمع أصوات الطيور الجميلة.',
    image: 'https://picsum.photos/400/300?random=12',
    vocabulary: [
      { word: 'Forest', translation: 'غابة', example: 'The forest is full of trees' },
      { word: 'Magical', translation: 'سحري', example: 'This is a magical place' },
      { word: 'Beautiful', translation: 'جميل', example: 'What a beautiful day!' }
    ],
    choices: [
      { id: 'explore', text: 'استكشف الغابة', description: 'توجه أعمق في الغابة لاكتشاف أسرارها' },
      { id: 'climb', text: 'تسلق شجرة', description: 'تسلق شجرة عالية لرؤية ما وراء الغابة' }
    ]
  },
  {
    id: '2',
    title: 'القلعة القديمة',
    description: 'وجدت قلعة قديمة مهجورة. جدرانها رمادية وحجرية، والنوافذ مغلقة بإحكام. يبدو أنها تخفي أسراراً كثيرة.',
    image: 'https://picsum.photos/400/300?random=13',
    vocabulary: [
      { word: 'Castle', translation: 'قلعة', example: 'The castle is very old' },
      { word: 'Ancient', translation: 'قديم', example: 'This is an ancient building' },
      { word: 'Secrets', translation: 'أسرار', example: 'The castle holds many secrets' }
    ],
    choices: [
      { id: 'enter', text: 'ادخل القلعة', description: 'ادخل القلعة لاستكشاف داخلها' },
      { id: 'search', text: 'ابحث حول القلعة', description: 'ابحث في المنطقة المحيطة بالقلعة' }
    ]
  }
]

export default function VocabVenture() {
  const [currentScene, setCurrentScene] = useState<AdventureScene>(mockScenes[0])
  const [sceneHistory, setSceneHistory] = useState<AdventureScene[]>([mockScenes[0]])
  const [isGenerating, setIsGenerating] = useState(false)
  const [showVocabulary, setShowVocabulary] = useState(false)

  const handleChoice = async (choiceId: string) => {
    setIsGenerating(true)
    
    // Simulate AI generating next scene
    setTimeout(() => {
      const nextScene = mockScenes.find(scene => scene.id !== currentScene.id) || mockScenes[0]
      setCurrentScene(nextScene)
      setSceneHistory(prev => [...prev, nextScene])
      setIsGenerating(false)
      setShowVocabulary(false)
    }, 3000)
  }

  const handleSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'ar-SA'
      utterance.rate = 0.8
      speechSynthesis.speak(utterance)
    }
  }

  const handleReset = () => {
    setCurrentScene(mockScenes[0])
    setSceneHistory([mockScenes[0]])
    setShowVocabulary(false)
  }

  return (
    <div className="h-full w-full bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 p-6 overflow-y-auto">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-2"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <BookOpen className="h-8 w-8 text-primary" />
            <h2 className="text-3xl font-bold font-cairo text-primary">مغامرة المفردات</h2>
          </div>
          <p className="text-muted-foreground">
            انطلق في مغامرة خيالية وتعلم مفردات جديدة مع كل خطوة
          </p>
        </motion.div>

        {/* Current Scene */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScene.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="overflow-hidden">
              <div className="relative">
                <img
                  src={currentScene.image}
                  alt={currentScene.title}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute top-4 right-4 bg-primary/90 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {currentScene.id} / {mockScenes.length}
                </div>
              </div>
              
              <CardHeader>
                <CardTitle className="text-2xl text-center">{currentScene.title}</CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <p className="text-lg leading-relaxed text-center text-muted-foreground">
                  {currentScene.description}
                </p>

                {/* Vocabulary Section */}
                <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-4 rounded-lg border border-primary/20">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-primary flex items-center gap-2">
                      <Lightbulb className="h-5 w-5" />
                      مفردات جديدة
                    </h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowVocabulary(!showVocabulary)}
                    >
                      {showVocabulary ? 'إخفاء' : 'إظهار'}
                    </Button>
                  </div>
                  
                  <AnimatePresence>
                    {showVocabulary && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-3"
                      >
                        {currentScene.vocabulary.map((vocab, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-background/80 p-3 rounded-lg border"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-semibold text-lg">{vocab.word}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleSpeak(vocab.word)}
                              >
                                <Volume2 className="h-4 w-4" />
                              </Button>
                            </div>
                            <p className="text-muted-foreground mb-1">{vocab.translation}</p>
                            <p className="text-sm italic">{vocab.example}</p>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Choices */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-center mb-4">اختر مسارك</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {currentScene.choices.map((choice) => (
                      <motion.button
                        key={choice.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleChoice(choice.id)}
                        disabled={isGenerating}
                        className="p-4 bg-background/80 hover:bg-background border border-border rounded-lg text-right transition-all duration-200 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <h5 className="font-semibold mb-2">{choice.text}</h5>
                        <p className="text-sm text-muted-foreground">{choice.description}</p>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Generating Indicator */}
                {isGenerating && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-4"
                  >
                    <div className="flex items-center justify-center gap-2 text-primary">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                      <span>جاري إنشاء المشهد التالي...</span>
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <Button
            variant="outline"
            onClick={handleReset}
            className="flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            بدء مغامرة جديدة
          </Button>
        </div>

        {/* Progress */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            المشاهد المكتشفة: {sceneHistory.length} / {mockScenes.length}
          </p>
        </div>
      </div>
    </div>
  )
}
