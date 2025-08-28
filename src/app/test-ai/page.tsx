"use client"

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { 
  Brain, 
  Play, 
  Volume2, 
  Image as ImageIcon, 
  TestTube,
  CheckCircle,
  XCircle,
  Loader2
} from 'lucide-react'
import { cloudflareAI } from '@/lib/services/cloudflare-ai'

export default function TestAIPage() {
  const [testResults, setTestResults] = useState<Record<string, {
    status: 'testing' | 'success' | 'error';
    message: string;
    data?: string | null;
    method?: string;
    fallbackModel?: string;
  }>>({})
  const [isTesting, setIsTesting] = useState(false)
  const [testPrompt, setTestPrompt] = useState('Write a short story about learning English')
  const [imagePrompt, setImagePrompt] = useState('A cat reading an English book')

  const runAITest = async (testType: string) => {
    setIsTesting(true)
    setTestResults(prev => ({ ...prev, [testType]: { status: 'testing', message: 'Testing...' } }))

    try {
      let response: {
        success: boolean;
        result?: string;
        error?: string;
        method?: string;
        fallbackModel?: string;
      }

      switch (testType) {
        case 'connection':
          response = await cloudflareAI.testConnection()
          break
        case 'text':
          response = await cloudflareAI.generateText(testPrompt)
          break
        case 'image':
          response = await cloudflareAI.generateImage(imagePrompt)
          break
        case 'tts':
          response = await cloudflareAI.generateSpeech('Hello, this is a test of text to speech')
          break
        case 'fallback-text':
          response = await cloudflareAI.generateTextWithFallback(testPrompt, 'llama-2')
          break
        default:
          throw new Error('Unknown test type')
      }

      console.log(`${testType} test response:`, response)

      if (response.success) {
        setTestResults(prev => ({
          ...prev,
          [testType]: {
            status: 'success',
            message: 'Test passed successfully!',
            data: response.result,
            method: response.method,
            fallbackModel: response.fallbackModel
          }
        }))
      } else {
        setTestResults(prev => ({
        ...prev,
          [testType]: {
            status: 'error',
            message: response.error || 'Test failed',
            data: null
          }
        }))
      }
    } catch (error) {
      console.error(`${testType} test error:`, error)
      setTestResults(prev => ({
        ...prev,
        [testType]: {
          status: 'error',
          message: error instanceof Error ? error.message : 'Unknown error',
          data: null
        }
      }))
    } finally {
      setIsTesting(false)
    }
  }

  const runAllTests = async () => {
    const tests = ['connection', 'text', 'image', 'tts', 'fallback-text']
    for (const test of tests) {
      await runAITest(test)
      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />
      case 'testing':
        return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
      default:
        return <TestTube className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200'
      case 'error':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-green-200'
      case 'testing':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-200'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              اختبار نماذج الذكاء الاصطناعي
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Test AI Models Integration
            </p>
          </div>
                </div>
              </div>
              
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Test Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <Card className="bg-white dark:bg-gray-800 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-6 w-6 text-blue-600" />
                إعدادات الاختبار
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">نص الاختبار:</label>
                  <Textarea
                    value={testPrompt}
                    onChange={(e) => setTestPrompt(e.target.value)}
                    placeholder="أدخل نصاً لاختبار توليد النص"
                    className="min-h-[80px]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">وصف الصورة:</label>
                  <Textarea
                    value={imagePrompt}
                    onChange={(e) => setImagePrompt(e.target.value)}
                    placeholder="أدخل وصفاً لإنشاء صورة"
                    className="min-h-[80px]"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                  <Button 
                  onClick={() => runAllTests()}
                  disabled={isTesting}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isTesting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      جاري الاختبار...
                    </>
                  ) : (
                    <>
                      <TestTube className="h-4 w-4 mr-2" />
                      تشغيل جميع الاختبارات
                    </>
                  )}
                  </Button>
                
                  <Button 
                  onClick={() => runAITest('connection')}
                  disabled={isTesting}
                  variant="outline"
                >
                  <TestTube className="h-4 w-4 mr-2" />
                  اختبار الاتصال
                  </Button>
                
                <Button 
                  onClick={() => runAITest('text')}
                  disabled={isTesting}
                  variant="outline"
                >
                  <Brain className="h-4 w-4 mr-2" />
                  اختبار النص
            </Button>
            
            <Button 
                  onClick={() => runAITest('image')}
                  disabled={isTesting}
                  variant="outline"
                >
                  <ImageIcon className="h-4 w-4 mr-2" />
                  اختبار الصور
            </Button>
            
            <Button 
                  onClick={() => runAITest('tts')}
                  disabled={isTesting}
                  variant="outline"
                >
                  <Volume2 className="h-4 w-4 mr-2" />
                  اختبار الصوت
            </Button>
            
            <Button 
                  onClick={() => runAITest('fallback-text')}
                  disabled={isTesting}
                  variant="outline"
                >
                  <Brain className="h-4 w-4 mr-2" />
                  اختبار النظام الاحتياطي
            </Button>
          </div>
        </CardContent>
      </Card>
        </motion.div>

        {/* Test Results */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {['connection', 'text', 'image', 'tts', 'fallback-text'].map((testType) => {
            const result = testResults[testType]
            const testNames = {
              connection: 'اختبار الاتصال',
              text: 'توليد النص',
              image: 'إنشاء الصور',
              tts: 'تحويل النص إلى صوت',
              'fallback-text': 'النظام الاحتياطي للنص'
            }

            return (
              <Card key={testType} className="bg-white dark:bg-gray-800 shadow-lg">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      {testNames[testType as keyof typeof testNames]}
                    </CardTitle>
                    {result && getStatusIcon(result.status)}
                  </div>
          </CardHeader>
          <CardContent>
                  {result ? (
                    <div className="space-y-3">
                      <Badge className={getStatusColor(result.status)}>
                        {result.status === 'success' ? 'نجح' : 
                         result.status === 'error' ? 'فشل' : 'جاري الاختبار'}
                      </Badge>
                      
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {result.message}
                      </p>
                      
                      {result.method && (
                        <p className="text-xs text-blue-600">
                          النموذج: {result.method}
                        </p>
                      )}
                      
                      {result.fallbackModel && (
                        <p className="text-xs text-green-600">
                          النموذج الاحتياطي: {result.fallbackModel}
                        </p>
                      )}
                      
                      {result.data && (
                        <details className="text-xs">
                          <summary className="cursor-pointer text-blue-600">
                            عرض البيانات
                          </summary>
                          <pre className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded overflow-auto max-h-32">
                            {JSON.stringify(result.data, null, 2)}
                          </pre>
                        </details>
                  )}
                </div>
                  ) : (
                    <p className="text-sm text-gray-500">
                      لم يتم تشغيل الاختبار بعد
                    </p>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </motion.div>

        {/* Debug Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8"
        >
          <Card className="bg-white dark:bg-gray-800 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TestTube className="h-6 w-6 text-purple-600" />
                معلومات التصحيح
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">إعدادات الخدمة:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">URL الأساسي:</span>
                      <p className="text-gray-600 dark:text-gray-300">
                        {process.env.NEXT_PUBLIC_WORKER_URL || 'https://al-dalil-ai-worker.speedofmastry.workers.dev'}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium">حالة التخزين المؤقت:</span>
                      <p className="text-gray-600 dark:text-gray-300">
                        {cloudflareAI.getCacheStats().size} عنصر
                      </p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">أوامر التصحيح:</h4>
                  <div className="space-y-2">
                    <Button
                      onClick={() => cloudflareAI.clearAllCache()}
                      variant="outline"
                      size="sm"
                    >
                      مسح التخزين المؤقت
                    </Button>
                    <Button
                      onClick={() => console.log('Cache stats:', cloudflareAI.getCacheStats())}
                      variant="outline"
                      size="sm"
                    >
                      طباعة إحصائيات التخزين المؤقت
                    </Button>
                  </div>
                </div>
            </div>
          </CardContent>
        </Card>
        </motion.div>
      </div>
    </div>
  )
}
