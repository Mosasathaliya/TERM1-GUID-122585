"use client"

import React, { useState, useEffect, useCallback } from 'react'
import { motion, useMotionValue, useTransform, useSpring, useAnimation } from 'framer-motion'
import { useTheme } from 'next-themes'

interface FloatingElement {
  id: number
  x: number
  y: number
  size: number
  color: string
  speed: number
  delay: number
}

export default function AnimatedBackground() {
  const { theme } = useTheme()
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const [floatingElements, setFloatingElements] = useState<FloatingElement[]>([])
  
  // Mouse tracking for interactive effects
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  
  // Smooth spring animations for mouse following
  const springConfig = { damping: 25, stiffness: 700 }
  const mouseXSpring = useSpring(mouseX, springConfig)
  const mouseYSpring = useSpring(mouseY, springConfig)
  
  // Transform mouse position to background effects
  const backgroundX = useTransform(mouseXSpring, [-100, 100], [-20, 20])
  const backgroundY = useTransform(mouseYSpring, [-100, 100], [-20, 20])
  const backgroundScale = useTransform(mouseXSpring, [-100, 100], [0.98, 1.02])
  
  // Animation controls
  const mainAnimation = useAnimation()
  const particleAnimation = useAnimation()
  const gridAnimation = useAnimation()

  // Generate floating elements
  useEffect(() => {
    const elements: FloatingElement[] = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 60 + 20,
      color: getRandomColor(theme),
      speed: Math.random() * 30 + 20,
      delay: Math.random() * 5,
    }))
    setFloatingElements(elements)
  }, [theme])

  // Mouse move handler
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const { clientX, clientY } = e
    const { innerWidth, innerHeight } = window
    
    // Calculate normalized mouse position (-100 to 100)
    const x = ((clientX / innerWidth) * 2 - 1) * 100
    const y = ((clientY / innerHeight) * 2 - 1) * 100
    
    setMousePosition({ x: clientX, y: clientY })
    mouseX.set(x)
    mouseY.set(y)
    
    // Trigger hover effects
    if (!isHovering) {
      setIsHovering(true)
      mainAnimation.start({
        scale: 1.05,
        transition: { duration: 0.3, ease: "easeOut" }
      })
    }
  }, [mouseX, mouseY, isHovering, mainAnimation])

  // Mouse leave handler
  const handleMouseLeave = useCallback(() => {
    setIsHovering(false)
    mainAnimation.start({
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    })
  }, [mainAnimation])

  // Get random color based on theme
  const getRandomColor = (currentTheme: string | undefined) => {
    if (currentTheme === 'dark') {
      const darkColors = [
        'rgba(59, 130, 246, 0.15)',   // Blue
        'rgba(147, 51, 234, 0.15)',   // Purple
        'rgba(236, 72, 153, 0.15)',   // Pink
        'rgba(16, 185, 129, 0.15)',   // Emerald
        'rgba(245, 158, 11, 0.15)',   // Amber
        'rgba(239, 68, 68, 0.15)',    // Red
      ]
      return darkColors[Math.floor(Math.random() * darkColors.length)]
    } else {
      const lightColors = [
        'rgba(59, 130, 246, 0.08)',   // Blue
        'rgba(147, 51, 234, 0.08)',   // Purple
        'rgba(236, 72, 153, 0.08)',   // Pink
        'rgba(16, 185, 129, 0.08)',   // Emerald
        'rgba(245, 158, 11, 0.08)',   // Amber
        'rgba(239, 68, 68, 0.08)',    // Red
      ]
      return lightColors[Math.floor(Math.random() * lightColors.length)]
    }
  }

  // Start animations
  useEffect(() => {
    const startAnimations = async () => {
      await mainAnimation.start({
        opacity: 1,
        transition: { duration: 1, ease: "easeOut" }
      })
      
      await particleAnimation.start({
        opacity: [0, 1],
        scale: [0, 1],
        transition: { duration: 0.8, ease: "easeOut" }
      })
      
      await gridAnimation.start({
        opacity: [0, 0.1],
        transition: { duration: 1.2, ease: "easeOut" }
      })
    }
    
    startAnimations()
  }, [mainAnimation, particleAnimation, gridAnimation])

  return (
    <div 
      className="fixed inset-0 -z-10 overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Enhanced gradient background with mouse interaction */}
      <motion.div 
        className="absolute inset-0"
        style={{
          x: backgroundX,
          y: backgroundY,
          scale: backgroundScale,
        }}
        animate={mainAnimation}
      >
        {/* Dynamic gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900" />
        
        {/* Secondary gradient layer */}
        <div className="absolute inset-0 bg-gradient-to-tl from-emerald-50/30 via-transparent to-pink-50/30 dark:from-emerald-900/20 dark:via-transparent dark:to-pink-900/20" />
        
        {/* Accent gradient layer */}
        <div className="absolute inset-0 bg-gradient-to-bl from-amber-50/20 via-transparent to-cyan-50/20 dark:from-amber-900/15 dark:via-transparent dark:to-cyan-900/15" />
      </motion.div>

      {/* Enhanced floating geometric shapes */}
      {floatingElements.map((element) => (
        <motion.div
          key={element.id}
          className="absolute rounded-full blur-xl"
          style={{
            left: `${element.x}%`,
            top: `${element.y}%`,
            width: element.size,
            height: element.size,
            backgroundColor: element.color,
          }}
          animate={{
            x: [0, Math.random() * 100 - 50, 0],
            y: [0, Math.random() * 100 - 50, 0],
            scale: [1, Math.random() * 0.5 + 0.8, 1],
            rotate: [0, 360],
          }}
          transition={{
            duration: element.speed,
            repeat: Infinity,
            ease: "easeInOut",
            delay: element.delay,
          }}
          whileHover={{
            scale: 1.5,
            filter: "blur(8px)",
            transition: { duration: 0.3 }
          }}
        />
      ))}

      {/* Interactive floating particles */}
      <motion.div animate={particleAnimation}>
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              backgroundColor: theme === 'dark' 
                ? 'rgba(59, 130, 246, 0.6)' 
                : 'rgba(59, 130, 246, 0.4)',
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 1, 0.3],
              scale: [1, 2, 1],
              x: [0, Math.random() * 20 - 10, 0],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 3,
            }}
            whileHover={{
              scale: 3,
              backgroundColor: theme === 'dark' 
                ? 'rgba(59, 130, 246, 0.9)' 
                : 'rgba(59, 130, 246, 0.7)',
              transition: { duration: 0.2 }
            }}
          />
        ))}
      </motion.div>

      {/* Enhanced grid pattern with animation */}
      <motion.div 
        className="absolute inset-0"
        animate={gridAnimation}
      >
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }} />
        
        {/* Secondary grid layer */}
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(147, 51, 234, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(147, 51, 234, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px'
        }} />
      </motion.div>

      {/* Interactive light rays effect */}
      <motion.div
        className="absolute inset-0 overflow-hidden"
        animate={{
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-px h-full bg-gradient-to-b from-transparent via-blue-200/20 to-transparent dark:via-blue-400/20"
            style={{
              left: `${20 + i * 20}%`,
              transform: `rotate(${15 + i * 5}deg)`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scaleY: [0, 1, 0],
            }}
            transition={{
              duration: 6 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5,
            }}
          />
        ))}
      </motion.div>

      {/* Floating orbs with glow effects */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-16 h-16"
        animate={{
          y: [0, -20, 0],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-400/20 to-purple-400/20 dark:from-blue-500/30 dark:to-purple-500/30 blur-sm" />
        <div className="absolute inset-2 rounded-full bg-gradient-to-br from-blue-300/30 to-purple-300/30 dark:from-blue-400/40 dark:to-purple-400/40 blur-md" />
      </motion.div>

      <motion.div
        className="absolute bottom-1/4 right-1/4 w-20 h-20"
        animate={{
          y: [0, 20, 0],
          rotate: [360, 180, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div className="w-full h-full rounded-full bg-gradient-to-br from-emerald-400/20 to-cyan-400/20 dark:from-emerald-500/30 dark:to-cyan-500/30 blur-sm" />
        <div className="absolute inset-2 rounded-full bg-gradient-to-br from-emerald-300/30 to-cyan-300/30 dark:from-emerald-400/40 dark:to-cyan-400/40 blur-md" />
      </motion.div>

      {/* Enhanced overlay for content readability */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-br from-background/70 via-background/50 to-background/70 dark:from-background/85 dark:via-background/75 dark:to-background/85"
        animate={{
          opacity: isHovering ? 0.3 : 0.6,
        }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Interactive cursor follower */}
      <motion.div
        className="fixed pointer-events-none w-96 h-96 rounded-full opacity-20"
        style={{
          x: mouseXSpring,
          y: mouseYSpring,
          background: `radial-gradient(circle, ${theme === 'dark' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)'} 0%, transparent 70%)`,
        }}
        animate={{
          scale: isHovering ? 1.5 : 1,
        }}
        transition={{ duration: 0.3 }}
      />
    </div>
  )
}
