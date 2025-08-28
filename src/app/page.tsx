"use client"

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Play, Gamepad2, BookOpen, Star } from 'lucide-react'

import EmbeddedGamesCarousel from '@/components/EmbeddedGamesCarousel'

export default function HomePage() {
  const [inspirationalMessage, setInspirationalMessage] = useState('')
  const [reviewLesson] = useState({
    title: 'الأبجدية الإنجليزية',
    description: 'تعلم الحروف الإنجليزية بطريقة تفاعلية',
    progress: 85
  })

  useEffect(() => {
    // Generate inspirational message (in a real app, this would come from AI)
    const messages = [
      'كل يوم خطوة جديدة نحو إتقان اللغة الإنجليزية',
      'التعلم المستمر هو مفتاح النجاح',
      'لا تستسلم، كل خطأ هو درس جديد',
      'أنت قادر على تحقيق أحلامك'
    ]
    setInspirationalMessage(messages[Math.floor(Math.random() * messages.length)])
  }, [])

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header - Mobile Optimized */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-3 sm:space-y-4"
      >
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold font-cairo text-primary leading-tight">
          مرحباً بك في الدليل!
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-muted-foreground font-tajawal px-2">
          ابدأ رحلتك في تعلم اللغة الإنجليزية
        </p>
      </motion.div>

      {/* Inspirational Message - Mobile Optimized */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="bg-gradient-to-r from-primary/10 to-primary/5 p-4 sm:p-6 rounded-lg border border-primary/20 mx-2 sm:mx-0"
      >
        <p className="text-base sm:text-lg text-center font-tajawal text-primary leading-relaxed">
          &ldquo;{inspirationalMessage}&rdquo;
        </p>
      </motion.div>

      {/* Review Card - Mobile Optimized */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mx-2 sm:mx-0"
      >
        <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200 dark:from-amber-950/20 dark:to-orange-950/20 dark:border-amber-800">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-amber-800 dark:text-amber-200 text-base sm:text-lg">
              <Star className="h-5 w-5" />
              مراجعة الدرس السابق
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              <h3 className="font-semibold text-base sm:text-lg">{reviewLesson.title}</h3>
              <p className="text-muted-foreground text-sm sm:text-base">{reviewLesson.description}</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-amber-200 dark:bg-amber-800 rounded-full h-2.5 sm:h-2">
                  <div 
                    className="bg-amber-600 dark:bg-amber-400 h-2.5 sm:h-2 rounded-full transition-all duration-500"
                    style={{ width: `${reviewLesson.progress}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-amber-800 dark:text-amber-200">
                  {reviewLesson.progress}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Next Lesson Card - Mobile Optimized */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="mx-2 sm:mx-0"
      >
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-primary text-base sm:text-lg">
              <BookOpen className="h-5 w-5" />
              الدرس التالي
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              <h3 className="font-semibold text-base sm:text-lg">الأرقام والألوان</h3>
              <p className="text-muted-foreground text-sm sm:text-base">
                تعلم الأرقام من 1 إلى 20 والألوان الأساسية
              </p>
              <Button className="w-full h-11 sm:h-10 text-base sm:text-sm">
                ابدأ التعلم
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Video Learning Carousel - Mobile Optimized */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="mx-2 sm:mx-0"
      >
        <h2 className="text-xl sm:text-2xl font-bold font-cairo mb-4 flex items-center gap-2">
          <Play className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
          دروس الفيديو
        </h2>

      </motion.div>

      {/* Embedded Games Carousel - Mobile Optimized */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.0 }}
        className="mx-2 sm:mx-0"
      >
        <h2 className="text-xl sm:text-2xl font-bold font-cairo mb-4 flex items-center gap-2">
          <Gamepad2 className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
          ألعاب تفاعلية
        </h2>
        <EmbeddedGamesCarousel />
      </motion.div>
    </div>
  )
}
