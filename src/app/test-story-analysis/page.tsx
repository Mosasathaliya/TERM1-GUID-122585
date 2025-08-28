"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { cloudflareAI } from '@/lib/services/cloudflare-ai'

export default function TestStoryAnalysis() {
  const [story, setStory] = useState('Once upon a time, there was a little cat who wanted to learn English.')
  const [analysis, setAnalysis] = useState('')
  const [image, setImage] = useState('')
  const [hasImage, setHasImage] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleAnalyze = async () => {
    if (!story.trim()) {
      setError('يرجى إدخال قصة للتحليل')
      return
    }

    setLoading(true)
    setError('')
    setAnalysis('')
    setImage('')
    setHasImage(false)

    try {
      const result = await cloudflareAI.analyzeStory(story)
      
      if (result.analysis) {
        setAnalysis(result.analysis)
        
        if (result.hasImage && result.image) {
          setImage(result.image)
          setHasImage(true)
        }
      } else {
        setError('فشل في تحليل القصة')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ غير متوقع')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-primary mb-2">اختبار تحليل القصة مع إنشاء الصور</h1>
        <p className="text-muted-foreground">
          استخدم Llama 2 لتحليل النص و Flux لإنشاء الصور
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>إدخال القصة</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={story}
            onChange={(e) => setStory(e.target.value)}
            placeholder="اكتب قصة باللغة الإنجليزية هنا..."
            className="min-h-[120px]"
          />
          <Button 
            onClick={handleAnalyze} 
            disabled={loading}
            className="w-full"
          >
            {loading ? 'جاري التحليل...' : '🧠 حلل القصة + 🎨 أنشئ صورة'}
          </Button>
        </CardContent>
      </Card>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-600 text-center">{error}</p>
          </CardContent>
        </Card>
      )}

      {analysis && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🧠 تحليل القصة (Llama 2)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="whitespace-pre-wrap text-right leading-relaxed">
              {analysis}
            </div>
          </CardContent>
        </Card>
      )}

      {hasImage && image && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🎨 صورة القصة (Flux AI)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <img
                src={`data:image/png;base64,${image}`}
                alt="Story Illustration"
                className="max-w-full h-auto rounded-lg shadow-lg mx-auto"
                style={{ maxHeight: '500px' }}
              />
              <p className="text-sm text-muted-foreground mt-2">
                تم إنشاء هذه الصورة باستخدام Flux AI بناءً على محتوى القصة
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {!hasImage && analysis && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6">
            <p className="text-yellow-700 text-center">
              ⚠️ تم تحليل القصة بنجاح، لكن لم يتم إنشاء صورة. قد يكون هناك مشكلة في Flux AI.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
