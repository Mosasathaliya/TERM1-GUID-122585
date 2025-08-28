'use client'

import React, { useState } from 'react'
import { motion, PanInfo, useMotionValue, useTransform } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  ArrowLeft, 
  ArrowRight, 
  Home, 
  BookOpen, 
  Target, 
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  MousePointer,
  Hand
} from 'lucide-react'

interface NavigationItem {
  id: string
  title: string
  titleArabic: string
  icon: React.ElementType
  color: string
  bg: string
  path: string
}

interface GestureState {
  isSwiping: boolean
  direction: 'left' | 'right' | 'up' | 'down' | null
  distance: number
  velocity: number
}

export default function GestureNavigation() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [gestureState, setGestureState] = useState<GestureState>({
    isSwiping: false,
    direction: null,
    distance: 0,
    velocity: 0
  })
  
  const [showGestureGuide, setShowGestureGuide] = useState(false)
  const [lastGesture, setLastGesture] = useState<string>('')
  
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  
  const rotateY = useTransform(x, [-100, 0, 100], [-15, 0, 15])
  const scale = useTransform(x, [-100, 0, 100], [0.9, 1, 0.9])
  
  const navigationItems: NavigationItem[] = [
    {
      id: 'home',
      title: 'Home',
      titleArabic: 'الرئيسية',
      icon: Home,
      color: 'text-blue-600',
      bg: 'bg-blue-50 dark:bg-blue-950/20',
      path: '/'
    },
    {
      id: 'learn',
      title: 'Learn',
      titleArabic: 'تعلم',
      icon: BookOpen,
      color: 'text-green-600',
      bg: 'bg-green-50 dark:bg-green-950/20',
      path: '/learn'
    },
    {
      id: 'practice',
      title: 'Practice',
      titleArabic: 'تدريب',
      icon: Target,
      color: 'text-purple-600',
      bg: 'bg-purple-50 dark:bg-purple-950/20',
      path: '/practice'
    },
    {
      id: 'progress',
      title: 'Progress',
      titleArabic: 'التقدم',
      icon: BarChart3,
      color: 'text-orange-600',
      bg: 'bg-orange-50 dark:bg-orange-950/20',
      path: '/progress'
    },
    {
      id: 'settings',
      title: 'Settings',
      titleArabic: 'الإعدادات',
      icon: Settings,
      color: 'text-gray-600',
      bg: 'bg-gray-50 dark:bg-gray-950/20',
      path: '/settings'
    }
  ]

  const handlePan = (event: any, info: PanInfo) => {
    const { offset, velocity } = info
    
    setGestureState({
      isSwiping: true,
      direction: Math.abs(offset.x) > Math.abs(offset.y) 
        ? (offset.x > 0 ? 'right' : 'left')
        : (offset.y > 0 ? 'down' : 'up'),
      distance: Math.max(Math.abs(offset.x), Math.abs(offset.y)),
      velocity: Math.max(Math.abs(velocity.x), Math.abs(velocity.y))
    })
  }

  const handlePanEnd = (event: any, info: PanInfo) => {
    const { offset, velocity } = info
    const threshold = 100
    const velocityThreshold = 500
    
    // Horizontal swipe for navigation
    if (Math.abs(offset.x) > Math.abs(offset.y)) {
      if (offset.x > threshold || velocity.x > velocityThreshold) {
        // Swipe right - go to previous
        if (currentIndex > 0) {
          setCurrentIndex(currentIndex - 1)
          setLastGesture('Swipe Right → Previous')
        }
      } else if (offset.x < -threshold || velocity.x < -velocityThreshold) {
        // Swipe left - go to next
        if (currentIndex < navigationItems.length - 1) {
          setCurrentIndex(currentIndex + 1)
          setLastGesture('Swipe Left ← Next')
        }
      }
    }
    
    // Vertical swipe for actions
    if (Math.abs(offset.y) > Math.abs(offset.x)) {
      if (offset.y < -threshold || velocity.y < -velocityThreshold) {
        // Swipe up - quick action
        setLastGesture('Swipe Up ↑ Quick Action')
      } else if (offset.y > threshold || velocity.y > velocityThreshold) {
        // Swipe down - context menu
        setLastGesture('Swipe Down ↓ Context Menu')
      }
    }
    
    // Reset gesture state
    setGestureState({
      isSwiping: false,
      direction: null,
      distance: 0,
      velocity: 0
    })
    
    // Reset motion values
    x.set(0)
    y.set(0)
  }

  const handleTap = (item: NavigationItem) => {
    setCurrentIndex(navigationItems.findIndex(nav => nav.id === item.id))
    setLastGesture(`Tap → ${item.titleArabic}`)
  }

  const handleLongPress = (item: NavigationItem) => {
    setLastGesture(`Long Press → ${item.titleArabic} Options`)
    // Show context menu or quick actions
  }

  const getGestureInstructions = () => {
    return [
      { gesture: 'Swipe Left', action: 'Next Item', icon: ChevronRight, color: 'text-blue-600' },
      { gesture: 'Swipe Right', action: 'Previous Item', icon: ChevronLeft, color: 'text-green-600' },
      { gesture: 'Swipe Up', action: 'Quick Action', icon: ArrowLeft, color: 'text-purple-600' },
      { gesture: 'Swipe Down', action: 'Context Menu', icon: ArrowRight, color: 'text-orange-600' },
      { gesture: 'Tap', action: 'Select Item', icon: MousePointer, color: 'text-pink-600' },
      { gesture: 'Long Press', action: 'More Options', icon: Hand, color: 'text-indigo-600' }
    ]
  }

  const CurrentIcon = navigationItems[currentIndex].icon

  return (
    <div className="space-y-6">
      {/* Gesture Navigation Header */}
      <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20 border-2 border-indigo-200 dark:border-indigo-600">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <MousePointer className="h-8 w-8 text-indigo-600" />
            <h2 className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">
              التنقل بالإيماءات
            </h2>
            <Hand className="h-8 w-8 text-purple-600" />
          </div>
          <p className="text-gray-600 dark:text-gray-300">
            Gesture Navigation - Intuitive Touch Interactions
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Current Navigation Item */}
          <motion.div
            style={{ rotateY, scale }}
            className="relative"
          >
            <motion.div
              onPan={handlePan}
              onPanEnd={handlePanEnd}
              whileTap={{ scale: 0.95 }}
              onTap={() => handleTap(navigationItems[currentIndex])}
              className="touch-manipulation"
            >
              <Card 
                className={`${navigationItems[currentIndex].bg} border-2 border-current ${navigationItems[currentIndex].color} cursor-pointer select-none`}
              >
                <CardContent className="p-6 text-center">
                  <div className="flex items-center justify-center space-x-4 space-x-reverse mb-4">
                    <CurrentIcon className="h-12 w-12" />
                    <div>
                      <h3 className="text-2xl font-bold">
                        {navigationItems[currentIndex].titleArabic}
                      </h3>
                      <p className="text-lg opacity-80">
                        {navigationItems[currentIndex].title}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-sm opacity-70">
                    Swipe left/right to navigate • Tap to select • Long press for options
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          {/* Navigation Dots */}
          <div className="flex justify-center space-x-2 space-x-reverse">
            {navigationItems.map((_, index) => (
              <motion.button
                key={index}
                className={`w-4 h-4 rounded-full cursor-pointer transition-colors ${
                  index === currentIndex 
                    ? 'bg-indigo-600' 
                    : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                }`}
                onClick={() => setCurrentIndex(index)}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.8 }}
                aria-label={`Navigate to ${navigationItems[index].titleArabic}`}
              />
            ))}
          </div>

          {/* Gesture Status */}
          {gestureState.isSwiping && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-indigo-200 dark:border-indigo-600"
            >
              <div className="text-center space-y-2">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Swiping {gestureState.direction} • Distance: {Math.round(gestureState.distance)}px
                </div>
                <div className="text-xs text-gray-400 dark:text-gray-500">
                  Velocity: {Math.round(gestureState.velocity)}px/s
                </div>
              </div>
            </motion.div>
          )}

          {/* Last Gesture */}
          {lastGesture && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-lg p-4 border border-green-200 dark:border-green-600"
            >
              <div className="text-center">
                <div className="text-sm font-medium text-green-800 dark:text-green-300 mb-1">
                  آخر إيماءة / Last Gesture
                </div>
                <div className="text-green-700 dark:text-green-300">
                  {lastGesture}
                </div>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* Gesture Guide */}
      <Card className="bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-950/20 dark:to-amber-950/20 border-2 border-yellow-200 dark:border-yellow-600">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold text-yellow-900 dark:text-yellow-300">
              دليل الإيماءات / Gesture Guide
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowGestureGuide(!showGestureGuide)}
              className="border-yellow-300 text-yellow-700 dark:text-yellow-300 h-10 px-4"
            >
              {showGestureGuide ? 'إخفاء' : 'إظهار'} / {showGestureGuide ? 'Hide' : 'Show'}
            </Button>
          </div>
        </CardHeader>
        
        {showGestureGuide && (
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {getGestureInstructions().map((instruction, index) => {
                const InstructionIcon = instruction.icon
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center border border-yellow-200 dark:border-yellow-600"
                  >
                    <div className={`mx-auto mb-2 ${instruction.color}`}>
                      <InstructionIcon className="h-8 w-8" />
                    </div>
                    <div className="space-y-1">
                      <div className="font-semibold text-sm text-gray-900 dark:text-white">
                        {instruction.gesture}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        {instruction.action}
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </CardContent>
        )}
      </Card>

      {/* Quick Navigation Buttons */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-2 border-blue-200 dark:border-blue-600">
        <CardHeader>
          <CardTitle className="text-center text-blue-900 dark:text-blue-100">
            التنقل السريع / Quick Navigation
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {navigationItems.map((item, index) => {
              const ItemIcon = item.icon
              return (
                <Button
                  key={item.id}
                  variant={currentIndex === index ? 'default' : 'outline'}
                  onClick={() => handleTap(item)}
                  className="h-16 flex-col space-y-2 touch-manipulation"
                  aria-label={`Navigate to ${item.titleArabic}`}
                >
                  <ItemIcon className="h-5 w-5" />
                  <div className="text-center">
                    <div className="text-xs font-medium">{item.titleArabic}</div>
                    <div className="text-xs opacity-70">{item.title}</div>
                  </div>
                </Button>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
