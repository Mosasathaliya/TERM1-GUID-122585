import { useEffect, useRef, useState } from 'react'

interface PerformanceMetrics {
  fcp: number | null
  lcp: number | null
  fid: number | null
  cls: number | null
  ttfb: number | null
}

export function usePerformance() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fcp: null,
    lcp: null,
    fid: null,
    cls: null,
    ttfb: null
  })
  
  const [isOnline, setIsOnline] = useState(true)
  const [connectionType, setConnectionType] = useState<string>('unknown')
  const observerRef = useRef<PerformanceObserver | null>(null)

  useEffect(() => {
    // Monitor online/offline status
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    
    // Monitor connection type
    if ('connection' in navigator) {
      const connection = (navigator as any).connection
      setConnectionType(connection.effectiveType || 'unknown')
      
      const handleConnectionChange = () => {
        setConnectionType(connection.effectiveType || 'unknown')
      }
      
      connection.addEventListener('change', handleConnectionChange)
    }

    // Performance monitoring
    if ('PerformanceObserver' in window) {
      try {
        // First Contentful Paint
        observerRef.current = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          entries.forEach((entry) => {
            if (entry.entryType === 'paint' && entry.name === 'first-contentful-paint') {
              setMetrics(prev => ({ ...prev, fcp: entry.startTime }))
            }
          })
        })
        observerRef.current.observe({ entryTypes: ['paint'] })

        // Largest Contentful Paint
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          const lastEntry = entries[entries.length - 1]
          if (lastEntry) {
            setMetrics(prev => ({ ...prev, lcp: lastEntry.startTime }))
          }
        })
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })

        // First Input Delay
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          entries.forEach((entry) => {
            setMetrics(prev => ({ ...prev, fid: entry.processingStart - entry.startTime }))
          })
        })
        fidObserver.observe({ entryTypes: ['first-input'] })

        // Cumulative Layout Shift
        const clsObserver = new PerformanceObserver((list) => {
          let clsValue = 0
          list.getEntries().forEach((entry: any) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value
            }
          })
          setMetrics(prev => ({ ...prev, cls: clsValue }))
        })
        clsObserver.observe({ entryTypes: ['layout-shift'] })

        // Time to First Byte
        const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
        if (navigationEntry) {
          setMetrics(prev => ({ ...prev, ttfb: navigationEntry.responseStart - navigationEntry.requestStart }))
        }

      } catch (error) {
        console.error('Performance monitoring error:', error)
      }
    }

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [])

  // Performance score calculation
  const getPerformanceScore = () => {
    let score = 100
    
    // FCP scoring (0-2.5s is good)
    if (metrics.fcp && metrics.fcp > 2500) score -= 20
    
    // LCP scoring (0-2.5s is good)
    if (metrics.lcp && metrics.lcp > 2500) score -= 25
    
    // FID scoring (0-100ms is good)
    if (metrics.fid && metrics.fid > 100) score -= 15
    
    // CLS scoring (0-0.1 is good)
    if (metrics.cls && metrics.cls > 0.1) score -= 20
    
    // TTFB scoring (0-600ms is good)
    if (metrics.ttfb && metrics.ttfb > 600) score -= 20
    
    return Math.max(0, score)
  }

  // Connection quality assessment
  const getConnectionQuality = () => {
    if (!isOnline) return 'offline'
    if (connectionType === '4g') return 'excellent'
    if (connectionType === '3g') return 'good'
    if (connectionType === '2g') return 'poor'
    if (connectionType === 'slow-2g') return 'very-poor'
    return 'unknown'
  }

  // Recommendations based on performance
  const getRecommendations = () => {
    const recommendations = []
    const score = getPerformanceScore()
    
    if (score < 50) {
      recommendations.push('تحسين سرعة التطبيق مطلوب')
    }
    
    if (metrics.fcp && metrics.fcp > 2500) {
      recommendations.push('تحسين وقت أول محتوى مرئي')
    }
    
    if (metrics.lcp && metrics.lcp > 2500) {
      recommendations.push('تحسين وقت أكبر محتوى مرئي')
    }
    
    if (metrics.fid && metrics.fid > 100) {
      recommendations.push('تحسين استجابة التفاعل')
    }
    
    if (metrics.cls && metrics.cls > 0.1) {
      recommendations.push('تحسين استقرار التخطيط')
    }
    
    if (!isOnline) {
      recommendations.push('استخدم المحتوى المحفوظ مسبقاً')
    }
    
    return recommendations
  }

  return {
    metrics,
    isOnline,
    connectionType,
    performanceScore: getPerformanceScore(),
    connectionQuality: getConnectionQuality(),
    recommendations: getRecommendations()
  }
}
