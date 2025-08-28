"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  BookOpen, 
  Play, 
  ChevronDown, 
  ChevronRight,
  Clock,
  Target,
  Star,
  Brain,
  Sparkles,
  GraduationCap
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { COURSE_STRUCTURE, Unit, Lesson } from '@/lib/lessons/course-structure'
import { cn } from '@/lib/utils'

export default function LearnPage() {
  const router = useRouter()
  const [expandedUnits, setExpandedUnits] = useState<Set<number>>(new Set())
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null)

  const toggleUnit = (unitId: number) => {
    const newExpanded = new Set(expandedUnits)
    if (newExpanded.has(unitId)) {
      newExpanded.delete(unitId)
    } else {
      newExpanded.add(unitId)
    }
    setExpandedUnits(newExpanded)
  }

  const handleLessonClick = (lesson: Lesson) => {
    setSelectedLesson(lesson)
    router.push(`/learn/${lesson.id}`)
  }

  const getUnitIcon = (unitId: number) => {
    const icons = ['🔤', '📚', '📝', '💬', '✏️', '🎯']
    return icons[unitId - 1] || '📖'
  }

  const getUnitColor = (unitId: number) => {
    const colors = [
      'from-blue-500 to-blue-600',
      'from-green-500 to-green-600',
      'from-purple-500 to-purple-600',
      'from-orange-500 to-orange-600',
      'from-pink-500 to-pink-600',
      'from-indigo-500 to-indigo-600'
    ]
    return colors[unitId - 1] || 'from-gray-500 to-gray-600'
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
      case 'advanced': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'alphabet': return '🔤'
      case 'vocabulary': return '📚'
      case 'grammar': return '📝'
      case 'dialogue': return '💬'
      case 'practice': return '✏️'
      case 'quiz': return '❓'
      default: return '📖'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center space-y-4">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <GraduationCap className="h-16 w-16 text-primary mx-auto mb-4" />
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl font-bold text-gray-900 dark:text-white"
            >
              English-Arabic Interactive Tutor
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
            >
              Master English with AI-powered interactive flashcards, personalized learning strategies, and comprehensive Arabic explanations
            </motion.p>

            {/* AI Features Highlight */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex items-center justify-center gap-6 text-sm text-muted-foreground"
            >
              <div className="flex items-center gap-2">
                <Brain className="h-4 w-4 text-primary" />
                <span>Smart AI Models</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <span>Interactive Cards</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-primary" />
                <span>Personalized Learning</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Course Structure */}
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {COURSE_STRUCTURE.map((unit, unitIndex) => (
            <motion.div
              key={unit.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: unitIndex * 0.1 }}
            >
              <Card className="border-0 shadow-lg overflow-hidden">
                {/* Unit Header */}
                <CardHeader 
                  className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  onClick={() => toggleUnit(unit.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-16 h-16 rounded-full flex items-center justify-center text-3xl text-white bg-gradient-to-r",
                        getUnitColor(unit.id)
                      )}>
                        {getUnitIcon(unit.id)}
                      </div>
                      
                      <div>
                        <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                          Unit {unit.id}: {unit.title}
                        </CardTitle>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                          {unit.arabicTitle}
                        </p>
                        <p className="text-sm text-muted-foreground mt-2">
                          {unit.description}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">Lessons</div>
                        <div className="text-2xl font-bold text-primary">
                          {unit.totalLessons}
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">Duration</div>
                        <div className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                          {unit.estimatedDuration}h
                        </div>
                      </div>
                      
                      <div className="text-center">
                        {expandedUnits.has(unit.id) ? (
                          <ChevronDown className="h-6 w-6 text-primary" />
                        ) : (
                          <ChevronRight className="h-6 w-6 text-primary" />
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>

                {/* Unit Lessons */}
                <AnimatePresence>
                  {expandedUnits.has(unit.id) && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <CardContent className="pt-0">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {unit.lessons.map((lesson, lessonIndex) => (
                            <motion.div
                              key={lesson.id}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.3, delay: lessonIndex * 0.1 }}
                            >
                              <Card 
                                className="cursor-pointer hover:shadow-lg transition-all duration-200 border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900"
                                onClick={() => handleLessonClick(lesson)}
                              >
                                <CardContent className="p-4">
                                  <div className="space-y-3">
                                    {/* Lesson Header */}
                                    <div className="flex items-start justify-between">
                                      <div className="flex items-center gap-2">
                                        <div className="text-2xl">
                                          {getCategoryIcon(lesson.category)}
                                        </div>
                                        <div>
                                          <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                                            Lesson {lesson.id}
                                          </h3>
                                          <p className="text-xs text-muted-foreground">
                                            {lesson.arabicTitle}
                                          </p>
                                        </div>
                                      </div>
                                      
                                      <Badge 
                                        variant="secondary" 
                                        className={getDifficultyColor(lesson.difficulty)}
                                      >
                                        {lesson.difficulty}
                                      </Badge>
                                    </div>

                                    {/* Lesson Title */}
                                    <h4 className="font-bold text-gray-900 dark:text-white text-base">
                                      {lesson.title}
                                    </h4>

                                    {/* Learning Goal */}
                                    <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                                      {lesson.learningGoal}
                                    </p>

                                    {/* Lesson Stats */}
                                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                                      <div className="flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        <span>{lesson.estimatedDuration}m</span>
                                      </div>
                                      
                                      <div className="flex items-center gap-1">
                                        <Target className="h-3 w-3" />
                                        <span>{lesson.teachingStrategy.replace('-', ' ')}</span>
                                      </div>
                                    </div>

                                    {/* AI Model Info */}
                                    <div className="flex items-center gap-2 text-xs text-primary bg-primary/10 rounded-full px-2 py-1 w-fit">
                                      <Brain className="h-3 w-3" />
                                      <span>{lesson.aiModels.textGeneration}</span>
                                    </div>

                                    {/* Start Button */}
                                    <Button 
                                      size="sm" 
                                      className="w-full bg-primary hover:bg-primary/90"
                                    >
                                      <Play className="h-3 w-3 mr-2" />
                                      Start Lesson
                                    </Button>
                                  </div>
                                </CardContent>
                              </Card>
                            </motion.div>
                          ))}
                        </div>
                      </CardContent>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Course Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-12 text-center"
        >
          <Card className="border-0 shadow-lg bg-gradient-to-r from-primary/5 to-primary/10">
            <CardContent className="p-8">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Complete Learning Journey
                </h2>
                <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                  Embark on a comprehensive English learning adventure with 6 units and 50 interactive lessons, 
                  each powered by intelligent AI models and designed for Arabic-speaking learners.
                </p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">6</div>
                    <div className="text-sm text-muted-foreground">Units</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">50</div>
                    <div className="text-sm text-muted-foreground">Lessons</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">15+</div>
                    <div className="text-sm text-muted-foreground">Hours</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">∞</div>
                    <div className="text-sm text-muted-foreground">Cards</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
