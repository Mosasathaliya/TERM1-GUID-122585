"use client"

import * as React from 'react'
import BottomNavBar from './BottomNavBar'
import { ThemeSwitcher } from './ThemeSwitcher'
import PerformanceDashboard from '../PerformanceDashboard'



interface AppLayoutProps {
  children: React.ReactNode
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex min-h-screen flex-col">
        {/* Header with Theme Switcher - Mobile Optimized */}
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 sm:h-14 max-w-screen-2xl items-center justify-between px-4 sm:px-6">
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <h1 className="text-lg sm:text-xl font-bold font-cairo text-primary">
                الدليل
              </h1>
            </div>
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <ThemeSwitcher />
            </div>
          </div>
        </header>

        {/* Main Content - Mobile Optimized */}
        <main className="flex-1 container mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 pb-28 sm:pb-24">
          {children}
        </main>

        {/* Bottom Navigation */}
        <BottomNavBar />
        
        {/* Performance Dashboard - Development Only */}
        {process.env.NODE_ENV === 'development' && <PerformanceDashboard />}
      </div>
    </div>
  )
}
