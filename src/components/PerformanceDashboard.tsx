"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Activity, 
  Wifi, 
  WifiOff, 
  Zap, 
  AlertTriangle, 
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Eye,
  EyeOff
} from 'lucide-react'
import { usePerformance } from '@/hooks/usePerformance'

export default function PerformanceDashboard() {
  const [isVisible, setIsVisible] = useState(false)
  const performance = usePerformance()

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100 dark:bg-green-900/20'
    if (score >= 70) return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20'
    if (score >= 50) return 'text-orange-600 bg-orange-100 dark:bg-orange-900/20'
    return 'text-red-600 bg-red-100 dark:bg-red-900/20'
  }

  const getScoreIcon = (score: number) => {
    if (score >= 90) return <CheckCircle className="w-4 h-4" />
    if (score >= 70) return <TrendingUp className="w-4 h-4" />
    if (score >= 50) return <AlertTriangle className="w-4 h-4" />
    return <TrendingDown className="w-4 h-4" />
  }

  const getConnectionIcon = () => {
    if (!performance.isOnline) return <WifiOff className="w-4 h-4 text-red-500" />
    return <Wifi className="w-4 h-4 text-green-500" />
  }

  const formatMetric = (value: number | null, unit: string) => {
    if (value === null) return 'غير متوفر'
    return `${value.toFixed(2)} ${unit}`
  }

  const getMetricStatus = (value: number | null, threshold: number, unit: string) => {
    if (value === null) return { status: 'unknown', color: 'bg-gray-100 text-gray-600' }
    if (value <= threshold) return { status: 'good', color: 'bg-green-100 text-green-600' }
    return { status: 'poor', color: 'bg-red-100 text-red-600' }
  }

  if (!isVisible) {
    return (
      <div className="fixed bottom-20 right-4 z-40">
        <Button
          onClick={() => setIsVisible(true)}
          size="sm"
          variant="outline"
          className="rounded-full w-12 h-12 p-0 shadow-lg"
        >
          <Activity className="w-5 h-5" />
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-20 right-4 z-40 w-80 max-h-96 overflow-y-auto">
      <Card className="shadow-xl border-2">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-cairo flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" />
              لوحة الأداء
            </CardTitle>
            <Button
              onClick={() => setIsVisible(false)}
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0"
            >
              <EyeOff className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Overall Score */}
          <div className="text-center p-3 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg">
            <div className="flex items-center justify-center gap-2 mb-2">
              {getScoreIcon(performance.performanceScore)}
              <span className="text-lg font-bold font-cairo">الدرجة الإجمالية</span>
            </div>
            <Badge className={`text-lg px-4 py-2 ${getScoreColor(performance.performanceScore)}`}>
              {performance.performanceScore}/100
            </Badge>
          </div>

          {/* Connection Status */}
          <div className="flex items-center justify-between p-2 bg-muted rounded">
            <span className="text-sm font-tajawal">حالة الاتصال</span>
            <div className="flex items-center gap-2">
              {getConnectionIcon()}
              <Badge variant="outline" className="text-xs">
                {performance.connectionQuality === 'offline' ? 'غير متصل' : performance.connectionType}
              </Badge>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold font-cairo text-center">مقاييس الأداء</h4>
            
            {/* FCP */}
            <div className="flex items-center justify-between text-xs">
              <span>أول محتوى مرئي (FCP)</span>
              <Badge 
                className={getMetricStatus(performance.metrics.fcp, 2500, 'ms').color}
                variant="secondary"
              >
                {formatMetric(performance.metrics.fcp, 'ms')}
              </Badge>
            </div>

            {/* LCP */}
            <div className="flex items-center justify-between text-xs">
              <span>أكبر محتوى مرئي (LCP)</span>
              <Badge 
                className={getMetricStatus(performance.metrics.lcp, 2500, 'ms').color}
                variant="secondary"
              >
                {formatMetric(performance.metrics.lcp, 'ms')}
              </Badge>
            </div>

            {/* FID */}
            <div className="flex items-center justify-between text-xs">
              <span>تأخير أول إدخال (FID)</span>
              <Badge 
                className={getMetricStatus(performance.metrics.fid, 100, 'ms').color}
                variant="secondary"
              >
                {formatMetric(performance.metrics.fid, 'ms')}
              </Badge>
            </div>

            {/* CLS */}
            <div className="flex items-center justify-between text-xs">
              <span>تغير التخطيط (CLS)</span>
              <Badge 
                className={getMetricStatus(performance.metrics.cls, 0.1, '').color}
                variant="secondary"
              >
                {formatMetric(performance.metrics.cls, '')}
              </Badge>
            </div>

            {/* TTFB */}
            <div className="flex items-center justify-between text-xs">
              <span>وقت أول بايت (TTFB)</span>
              <Badge 
                className={getMetricStatus(performance.metrics.ttfb, 600, 'ms').color}
                variant="secondary"
              >
                {formatMetric(performance.metrics.ttfb, 'ms')}
              </Badge>
            </div>
          </div>

          {/* Recommendations */}
          {performance.recommendations.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-semibold font-cairo text-center">التوصيات</h4>
              <div className="space-y-1">
                {performance.recommendations.map((rec, index) => (
                  <div key={index} className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
                    • {rec}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Refresh Button */}
          <Button 
            onClick={() => window.location.reload()} 
            size="sm" 
            className="w-full"
            variant="outline"
          >
            تحديث المقاييس
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
