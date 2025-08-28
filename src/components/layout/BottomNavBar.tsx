"use client"

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, BookOpen, Target, BarChart3 } from 'lucide-react'
import { cn } from '@/lib/utils'



export default function BottomNavBar() {
  const pathname = usePathname()

  const navItems = [
    {
      href: '/',
      label: 'الرئيسية',
      icon: Home,
      ariaLabel: 'الرئيسية - الصفحة الرئيسية'
    },
    {
      href: '/learn',
      label: 'تعلم',
      icon: BookOpen,
      ariaLabel: 'تعلم - دروس اللغة الإنجليزية'
    },
    {
      href: '/practice',
      label: 'تدرب',
      icon: Target,
      ariaLabel: 'تدرب - تمارين وتطبيقات'
    },

    {
      href: '/progress',
      label: 'التقدم',
      icon: BarChart3,
      ariaLabel: 'التقدم - تتبع التعلم'
    }
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t border-border shadow-lg z-50 safe-area-inset-bottom">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || 
                          (item.href !== '/' && pathname.startsWith(item.href))
          
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-label={item.ariaLabel}
              title={item.ariaLabel}
              className={cn(
                "flex flex-col items-center justify-center px-4 sm:px-5 py-3 sm:py-2 rounded-xl sm:rounded-lg transition-all duration-200 min-h-[60px] sm:min-h-0 touch-target",
                isActive
                  ? 'text-primary bg-primary/10 shadow-lg shadow-primary/20 scale-105'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50 active:scale-95'
              )}
            >
              <Icon className="h-7 w-7 sm:h-6 sm:w-6" />
              <span className="text-xs mt-1 hidden sm:block font-medium">{item.label}</span>
            </Link>
          )
        })}
        

        

      </div>
    </nav>
  )
}
