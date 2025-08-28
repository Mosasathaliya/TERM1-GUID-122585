"use client"

import React, { Suspense, lazy, ComponentType } from 'react'
import { LoadingSpinner } from './LoadingSpinner'
import { cn } from '@/lib/utils'

interface LazyLoadProps {
  component: () => Promise<{ default: ComponentType<unknown> }>
  fallback?: React.ReactNode
  loadingText?: string
}

export function LazyLoad({ 
  component, 
  fallback, 
  loadingText = 'جاري تحميل المحتوى...' 
}: LazyLoadProps) {
  const LazyComponent = lazy(component)

  return (
    <Suspense fallback={fallback || <LoadingSpinner text={loadingText} />}>
      <LazyComponent />
    </Suspense>
  )
}

// Predefined lazy components for common use cases

export const LazyGamePlayer = lazy(() => import('@/components/EmbeddedGamesCarousel'))


// Hook for intersection observer lazy loading
export function useIntersectionObserver(
  ref: React.RefObject<HTMLElement>,
  options: IntersectionObserverInit = {}
) {
  const [isIntersecting, setIsIntersecting] = React.useState(false)

  React.useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting)
    }, options)

    observer.observe(element)

    return () => {
      observer.unobserve(element)
    }
  }, [ref, options])

  return isIntersecting
}

// Component for lazy loading images
export function LazyImage({ 
  src, 
  alt, 
  className,
  placeholder = '/placeholder-image.png'
}: {
  src: string
  alt: string
  className?: string
  placeholder?: string
}) {
  const [isLoaded, setIsLoaded] = React.useState(false)
  const [hasError, setHasError] = React.useState(false)

  return (
    <div className={className}>
      {!isLoaded && !hasError && (
        <div className="w-full h-full bg-muted animate-pulse rounded" />
      )}
      <img
        src={hasError ? placeholder : src}
        alt={alt}
        className={cn(
          "transition-opacity duration-300",
          isLoaded ? "opacity-100" : "opacity-0"
        )}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        loading="lazy"
      />
    </div>
  )
}

// Utility function for conditional imports
export function conditionalImport<T>(
  importFn: () => Promise<T>,
  condition: boolean
): T | null {
  if (!condition) return null
  
  try {
    return importFn()
  } catch {
    return null
  }
}
