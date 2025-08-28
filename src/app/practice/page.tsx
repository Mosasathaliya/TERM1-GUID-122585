"use client"

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  Heart, 
  BookOpen, 
  Mic, 
  Play, 
  Volume2, 
  Brain,
  Gamepad2,
  Target,
  Sparkles
} from 'lucide-react'
import MoodTranslator from '@/components/practice/MoodTranslator'
import VocabVenture from '@/components/practice/VocabVenture'
import EchoChamber from '@/components/practice/EchoChamber'

interface Game {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType; // Lucide icon component
  color: string;
  bg: string;
  component: React.ElementType; // Component to render
}

export default function PracticePage() {
  const [selectedTool, setSelectedTool] = useState<Game | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentGame, setCurrentGame] = useState<Game | null>(null)
  const [gameHistory, setGameHistory] = useState<Game[]>([])
  const [showGameDialog, setShowGameDialog] = useState(false)

  const practiceTools = [
    {
      id: 'mood-translator',
      title: 'مترجم المزاج',
      description: 'ترجم رسائلك بأسلوب مختلف حسب مزاجك المختار',
      icon: Heart,
      color: 'text-pink-600',
      bg: 'bg-pink-50 dark:bg-pink-950/20',
      component: MoodTranslator
    },
    {
      id: 'vocab-venture',
      title: 'مغامرة المفردات',
      description: 'انطلق في مغامرة خيالية وتعلم مفردات جديدة',
      icon: BookOpen,
      color: 'text-blue-600',
      bg: 'bg-blue-50 dark:bg-blue-950/20',
      component: VocabVenture
    },
    {
      id: 'echo-chamber',
      title: 'غرفة الصدى',
      description: 'تدرب على النطق وحسن لهجتك الإنجليزية',
      icon: Mic,
      color: 'text-green-600',
      bg: 'bg-green-50 dark:bg-green-950/20',
      component: EchoChamber
    }
  ]

  const handleToolClick = (tool: Game) => {
    setSelectedTool(tool)
    setIsDialogOpen(true)
  }

  const handleGameClick = (game: Game) => {
    setCurrentGame(game)
    setShowGameDialog(true)
    
    // Add to history
    setGameHistory(prev => {
      const filtered = prev.filter(g => g.id !== game.id)
      return [game, ...filtered].slice(0, 10) // Keep last 10 games
    })
  }

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
          تدرب على اللغة الإنجليزية
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-muted-foreground font-tajawal px-2">
          استخدم أدوات التدريب الذكية لتحسين مهاراتك
        </p>
      </motion.div>

      {/* AI Tools Introduction - Mobile Optimized */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mx-2 sm:mx-0"
      >
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-4 sm:p-6 rounded-lg border border-primary/20">
          <div className="flex items-center gap-3 mb-4">
            <Brain className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
            <h2 className="text-xl sm:text-2xl font-bold font-cairo text-primary">
              أدوات التدريب الذكية
            </h2>
          </div>
          <p className="text-muted-foreground font-tajawal text-sm sm:text-base leading-relaxed">
            استخدم الذكاء الاصطناعي لإنشاء تجارب تعليمية مخصصة ومتطورة. 
            كل أداة مصممة لمساعدتك في تطوير مهارات محددة بطريقة ممتعة وتفاعلية.
          </p>
        </div>
      </motion.div>

      {/* Practice Tools Grid - Mobile Optimized */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mx-2 sm:mx-0"
      >
        <h2 className="text-xl sm:text-2xl font-bold font-cairo mb-4 sm:mb-6">أدوات التدريب</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {practiceTools.map((tool, index) => {
            const IconComponent = tool.icon
            
            return (
              <motion.div
                key={tool.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card 
                  className={`cursor-pointer hover:shadow-lg transition-all duration-300 ${tool.bg} hover:scale-105 active:scale-95 h-full`}
                  onClick={() => handleToolClick(tool)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 sm:p-3 rounded-lg ${tool.bg}`}>
                        <IconComponent className={`h-6 w-6 sm:h-8 sm:w-8 ${tool.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg sm:text-xl line-clamp-2 leading-tight">{tool.title}</CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <p className="text-muted-foreground text-xs sm:text-sm line-clamp-3 mb-4 leading-relaxed">
                      {tool.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Sparkles className="h-3 w-3" />
                        <span className="hidden sm:inline">مدعوم بالذكاء الاصطناعي</span>
                        <span className="sm:hidden">ذكي</span>
                      </div>
                      <Button className="bg-primary hover:bg-primary/90 h-9 sm:h-10 text-sm">
                        <Play className="h-3 w-3 sm:h-4 sm:w-4 ml-2" />
                        ابدأ
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      {/* Additional Practice Options - Mobile Optimized */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="mx-2 sm:mx-0"
      >
        <h2 className="text-xl sm:text-2xl font-bold font-cairo mb-4 sm:mb-6">خيارات تدريب إضافية</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20 border-purple-200 dark:border-purple-800">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-purple-800 dark:text-purple-200 text-base sm:text-lg">
                <Gamepad2 className="h-5 w-5 sm:h-6 sm:w-6" />
                ألعاب تعليمية
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-muted-foreground text-sm sm:text-base mb-4 leading-relaxed">
                العب ألعاب تعليمية مصممة خصيصاً لتحسين مهاراتك اللغوية
              </p>
              <Button variant="outline" className="border-purple-300 text-purple-700 hover:bg-purple-50 h-9 sm:h-10 w-full sm:w-auto">
                استكشف الألعاب
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-950/20 dark:to-yellow-950/20 border-orange-200 dark:border-orange-800">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-orange-800 dark:text-orange-200 text-base sm:text-lg">
                <Target className="h-5 w-5 sm:h-6 sm:w-6" />
                اختبارات سريعة
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-muted-foreground text-sm sm:text-base mb-4 leading-relaxed">
                اختبر معرفتك من خلال اختبارات قصيرة وسريعة
              </p>
              <Button variant="outline" className="border-orange-300 text-orange-700 hover:bg-orange-50 h-9 sm:h-10 w-full sm:w-auto">
                ابدأ الاختبار
              </Button>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Tool Dialog - Mobile Optimized */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-6xl max-h-[90vh] w-full overflow-hidden mx-2 sm:mx-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base sm:text-lg">
              {selectedTool && (
                <>
                  <selectedTool.icon className="h-4 w-4 sm:h-6 sm:w-6" />
                  {selectedTool.title}
                </>
              )}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4 h-full">
            {selectedTool && React.createElement(selectedTool.component)}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
