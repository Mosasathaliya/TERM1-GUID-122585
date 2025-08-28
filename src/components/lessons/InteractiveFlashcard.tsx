"use client"

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Volume2, 
  Eye, 
  EyeOff, 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause,
  RotateCcw,
  CheckCircle,
  XCircle,
  Star,
  Lightbulb
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { LessonCard } from '@/lib/lessons/course-structure'
import ImageGenerator from './ImageGenerator'
import TTSGenerator from './TTSGenerator'

interface InteractiveFlashcardProps {
  card: LessonCard
  cardIndex: number
  totalCards: number
  onNext: () => void
  onPrevious: () => void
  onComplete: (score: number, totalQuestions: number) => void
  isLastCard: boolean
}

export default function InteractiveFlashcard({
  card,
  cardIndex,
  totalCards,
  onNext,
  onPrevious,
  onComplete,
  isLastCard
}: InteractiveFlashcardProps) {
  const [showArabic, setShowArabic] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [score, setScore] = useState(0)
  const [totalAnswered, setTotalAnswered] = useState(0)
  
  const audioRef = useRef<HTMLAudioElement>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)

  // Generate TTS audio when component mounts
  useEffect(() => {
    if (card.ttsText) {
      generateTTS(card.ttsText)
    }
  }, [card.ttsText])

  const generateTTS = async (text: string) => {
    try {
      // This would call your TTS service
      // For now, we'll use a placeholder
      console.log('Generating TTS for:', text)
      // setAudioUrl('generated-audio-url')
    } catch (error) {
      console.error('Error generating TTS:', error)
    }
  }

  const handlePlayAudio = () => {
    if (audioUrl && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
        setIsPlaying(false)
      } else {
        audioRef.current.play()
        setIsPlaying(true)
      }
    }
  }

  const handleAnswerSelect = (answer: string) => {
    if (selectedAnswer) return // Already answered
    
    setSelectedAnswer(answer)
    const correct = answer === card.correctAnswer
    setIsCorrect(correct)
    
    if (correct) {
      setScore(prev => prev + 1)
    }
    
    setTotalAnswered(prev => prev + 1)
    setShowExplanation(true)
  }

  const handleNext = () => {
    if (isLastCard) {
      onComplete(score, totalAnswered)
    } else {
      onNext()
    }
  }

  const resetCard = () => {
    setShowArabic(false)
    setSelectedAnswer(null)
    setIsCorrect(null)
    setShowExplanation(false)
  }

  const getCardTypeIcon = () => {
    switch (card.type) {
      case 'alphabet': return '🔤'
      case 'vocabulary': return '📚'
      case 'grammar': return '📝'
      case 'dialogue': return '💬'
      case 'practice': return '✏️'
      case 'quiz': return '❓'
      case 'matching': return '🔗'
      case 'fill-blank': return '⬜'
      default: return '📖'
    }
  }

  const getCardTypeColor = () => {
    switch (card.type) {
      case 'alphabet': return 'bg-blue-500'
      case 'vocabulary': return 'bg-green-500'
      case 'grammar': return 'bg-purple-500'
      case 'dialogue': return 'bg-orange-500'
      case 'practice': return 'bg-yellow-500'
      case 'quiz': return 'bg-red-500'
      case 'matching': return 'bg-indigo-500'
      case 'fill-blank': return 'bg-pink-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-muted-foreground">
            Card {cardIndex + 1} of {totalCards}
          </span>
          <span className="text-sm font-medium text-muted-foreground">
            {Math.round(((cardIndex + 1) / totalCards) * 100)}% Complete
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            className="h-2 bg-primary rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((cardIndex + 1) / totalCards) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Main Flashcard */}
      <motion.div
        key={card.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="w-full"
      >
        <Card className="relative overflow-hidden border-0 shadow-2xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
          {/* Card Header */}
          <CardHeader className="relative pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center text-2xl",
                  getCardTypeColor()
                )}>
                  {getCardTypeIcon()}
                </div>
                <div>
                  <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
                    {card.title}
                  </CardTitle>
                  <Badge variant="secondary" className="mt-1">
                    {card.type.toUpperCase()}
                  </Badge>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handlePlayAudio}
                  disabled={!audioUrl}
                  className="hover:bg-primary/10"
                >
                  {isPlaying ? (
                    <Pause className="h-5 w-5 text-primary" />
                  ) : (
                    <Play className="h-5 w-5 text-primary" />
                  )}
                </Button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowArabic(!showArabic)}
                  className="hover:bg-primary/10"
                >
                  {showArabic ? (
                    <EyeOff className="h-5 w-5 text-primary" />
                  ) : (
                    <Eye className="h-5 w-5 text-primary" />
                  )}
                </Button>
              </div>
            </div>
          </CardHeader>

          {/* Card Content */}
          <CardContent className="space-y-6">
            {/* Main Content */}
            <div className="text-center space-y-4">
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
                className="text-4xl font-bold text-primary mb-4"
              >
                {card.content}
              </motion.div>

              {/* TTS Button */}
              <div className="flex items-center justify-center gap-2">
                <Volume2 className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  [TTS: {card.ttsText}]
                </span>
              </div>

              {/* Arabic Translation */}
              <AnimatePresence>
                {showArabic && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-primary/10 rounded-lg p-4 border border-primary/20"
                  >
                    <p className="text-lg font-medium text-primary">
                      {card.arabicTranslation}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Image Suggestion */}
              {card.imageSuggestion && (
                <div className="text-center">
                  <div className="text-4xl mb-2">
                    {card.imageSuggestion}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Image suggestion
                  </p>
                </div>
              )}

              {/* AI Generation Tools */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                {/* Image Generator */}
                <ImageGenerator
                  prompt={card.imageSuggestion || `illustration for ${card.content}`}
                  lesson="Current Lesson"
                  goal="Visual Learning"
                />
                
                {/* TTS Generator */}
                <TTSGenerator
                  text={card.ttsText || card.content}
                  lesson="Current Lesson"
                  goal="Audio Learning"
                />
              </div>
            </div>

            {/* Interactive Elements */}
            {(card.type === 'quiz' || card.type === 'practice') && (
              <div className="space-y-4">
                {/* Question */}
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-2">
                    {card.content}
                  </h3>
                  {showArabic && (
                    <p className="text-muted-foreground">
                      {card.arabicTranslation}
                    </p>
                  )}
                </div>

                {/* Answer Options */}
                {card.options && (
                  <div className="grid gap-3 max-w-md mx-auto">
                    {card.options.map((option, index) => (
                      <motion.button
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        onClick={() => handleAnswerSelect(option)}
                        disabled={selectedAnswer !== null}
                        className={cn(
                          "p-4 rounded-lg border-2 text-left transition-all duration-200",
                          "hover:shadow-md active:scale-95",
                          selectedAnswer === option
                            ? isCorrect
                              ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                              : "border-red-500 bg-red-50 dark:bg-red-900/20"
                            : "border-gray-200 hover:border-primary/50",
                          selectedAnswer && selectedAnswer !== option && option === card.correctAnswer
                            ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                            : ""
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-bold",
                            selectedAnswer === option
                              ? isCorrect
                                ? "border-green-500 bg-green-500 text-white"
                                : "border-red-500 bg-red-500 text-white"
                              : "border-gray-300"
                          )}>
                            {String.fromCharCode(65 + index)}
                          </div>
                          <span className="font-medium">{option}</span>
                          {selectedAnswer === option && (
                            <div className="ml-auto">
                              {isCorrect ? (
                                <CheckCircle className="h-5 w-5 text-green-500" />
                              ) : (
                                <XCircle className="h-5 w-5 text-red-500" />
                              )}
                            </div>
                          )}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                )}

                {/* Explanation */}
                {showExplanation && card.explanation && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Lightbulb className="h-5 w-5 text-blue-500" />
                      <h4 className="font-semibold text-blue-700 dark:text-blue-300">
                        Explanation
                      </h4>
                    </div>
                    <p className="text-blue-700 dark:text-blue-300">
                      {card.explanation}
                    </p>
                  </motion.div>
                )}
              </div>
            )}

            {/* Score Display */}
            {(card.type === 'quiz' || card.type === 'practice') && (
              <div className="text-center">
                <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2">
                  <Star className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-primary">
                    Score: {score}/{totalAnswered}
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-8">
        <Button
          variant="outline"
          onClick={onPrevious}
          disabled={cardIndex === 0}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={resetCard}
            className="hover:bg-primary/10"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>

        <Button
          onClick={handleNext}
          className="flex items-center gap-2 bg-primary hover:bg-primary/90"
        >
          {isLastCard ? 'Complete Lesson' : 'Next'}
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Hidden Audio Element */}
      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          onEnded={() => setIsPlaying(false)}
          onPause={() => setIsPlaying(false)}
        />
      )}
    </div>
  )
}
