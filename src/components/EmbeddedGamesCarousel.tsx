"use client"

import React, { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Gamepad2, ChevronLeft, ChevronRight, Play, ExternalLink } from 'lucide-react'

interface Game {
  id: number
  title: string
  description: string
  thumbnail: string
  gameUrl: string
  category: string
  difficulty: string
  estimatedTime: string
}

// Mock data for embedded games
const games: Game[] = [
  {
    id: 1,
    title: "لعبة المطابقة",
    description: "طابق الكلمات مع معانيها",
    thumbnail: "https://picsum.photos/300/200?random=6",
    gameUrl: "https://example.com/game1",
    category: "مطابقة",
    difficulty: "مبتدئ",
    estimatedTime: "5 دقائق"
  },
  {
    id: 2,
    title: "لعبة الذاكرة",
    description: "تذكر مواقع الكلمات وتطابقها",
    thumbnail: "https://picsum.photos/300/200?random=7",
    gameUrl: "https://example.com/game2",
    category: "ذاكرة",
    difficulty: "مبتدئ",
    estimatedTime: "8 دقائق"
  },
  {
    id: 3,
    title: "لعبة النطق",
    description: "تعلم النطق الصحيح للكلمات الإنجليزية",
    thumbnail: "https://picsum.photos/300/200?random=8",
    gameUrl: "https://example.com/game3",
    category: "نطق",
    difficulty: "متوسط",
    estimatedTime: "10 دقائق"
  },
  {
    id: 4,
    title: "لعبة القواعد",
    description: "تمرن على قواعد اللغة الإنجليزية",
    thumbnail: "https://picsum.photos/300/200?random=9",
    gameUrl: "https://example.com/game4",
    category: "قواعد",
    difficulty: "متوسط",
    estimatedTime: "12 دقائق"
  },
  {
    id: 5,
    title: "لعبة المفردات",
    description: "وسع مفرداتك الإنجليزية",
    thumbnail: "https://picsum.photos/300/200?random=10",
    gameUrl: "https://example.com/game5",
    category: "مفردات",
    difficulty: "متقدم",
    estimatedTime: "15 دقائق"
  }
];

export default function EmbeddedGamesCarousel() {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' })
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' })
    }
  }

  const handleGameClick = (game: Game) => {
    setSelectedGame(game)
    setIsDialogOpen(true)
  }

  const handleGameClose = () => {
    setIsDialogOpen(false)
    setSelectedGame(null)
  }

  const openGameInNewTab = (gameUrl: string) => {
    window.open(gameUrl, '_blank')
  }

  return (
    <div className="relative group">
      {/* Navigation Buttons - Hidden on mobile, visible on hover */}
      <button
        onClick={scrollLeft}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm border border-border/40 rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-background/90 hidden sm:flex items-center justify-center"
        aria-label="Scroll left"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      <button
        onClick={scrollRight}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm border border-border/40 rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-background/90 hidden sm:flex items-center justify-center"
        aria-label="Scroll right"
      >
        <ChevronRight className="h-4 w-4" />
      </button>

      {/* Scrollable Container - Mobile Optimized */}
      <div 
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4 -mx-2 px-2 sm:mx-0 sm:px-0"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
        {games.map((game, index) => (
          <motion.div
            key={game.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="flex-shrink-0 w-72 sm:w-80 snap-start"
          >
            <Card 
              className="cursor-pointer hover:shadow-lg transition-all duration-300 active:scale-95 h-full"
              onClick={() => handleGameClick(game)}
            >
              <div className="relative">
                <img
                  src={game.thumbnail}
                  alt={game.title}
                  className="w-full h-40 sm:h-48 object-cover rounded-t-lg"
                />
                <div className="absolute inset-0 bg-black/20 rounded-t-lg" />
                <div className="absolute top-2 right-2 bg-primary/90 text-white text-xs px-2 py-1 rounded">
                  {game.category}
                </div>
                <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  {game.difficulty}
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                    <Gamepad2 className="h-8 w-8 text-white" />
                  </div>
                </div>
              </div>
              
              <CardHeader className="pb-3">
                <CardTitle className="text-base sm:text-lg line-clamp-2 leading-tight">
                  {game.title}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="pt-0">
                <p className="text-muted-foreground text-xs sm:text-sm line-clamp-2 leading-relaxed mb-3">
                  {game.description}
                </p>
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                  <span>الوقت: {game.estimatedTime}</span>
                  <span>المستوى: {game.difficulty}</span>
                </div>
                <Button className="w-full h-9 sm:h-10 text-sm">
                  <Play className="h-3 w-3 sm:h-4 sm:w-4 ml-2" />
                  ابدأ اللعبة
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Game Dialog - Mobile Optimized */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-4xl max-h-[90vh] overflow-y-auto mx-2 sm:mx-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Gamepad2 className="h-4 w-4 sm:h-5 sm:w-5" />
              {selectedGame?.title}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            {selectedGame && (
              <>
                <div className="aspect-video w-full bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Gamepad2 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">معاينة اللعبة</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold">{selectedGame.title}</h3>
                  <p className="text-muted-foreground">{selectedGame.description}</p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <p className="font-medium">الفئة</p>
                      <p className="text-muted-foreground">{selectedGame.category}</p>
                    </div>
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <p className="font-medium">المستوى</p>
                      <p className="text-muted-foreground">{selectedGame.difficulty}</p>
                    </div>
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <p className="font-medium">الوقت المتوقع</p>
                      <p className="text-muted-foreground">{selectedGame.estimatedTime}</p>
                    </div>
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <p className="font-medium">النوع</p>
                      <p className="text-muted-foreground">لعبة تفاعلية</p>
                    </div>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <Button 
                      className="flex-1 h-11"
                      onClick={() => openGameInNewTab(selectedGame.gameUrl)}
                    >
                      <Play className="h-4 w-4 ml-2" />
                      ابدأ اللعبة
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-11"
                      onClick={() => openGameInNewTab(selectedGame.gameUrl)}
                    >
                      <ExternalLink className="h-4 w-4 ml-2" />
                      فتح في تبويب جديد
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Mobile Scroll Indicator */}
      <div className="flex justify-center mt-4 sm:hidden">
        <div className="flex gap-2">
          {games.map((_, index) => (
            <div
              key={index}
              className="w-2 h-2 rounded-full bg-muted-foreground/30"
            />
          ))}
        </div>
      </div>
    </div>
  )
}
