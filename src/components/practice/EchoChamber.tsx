"use client"

import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Mic, 
  MicOff, 
  Volume2, 
  RotateCcw,
  CheckCircle,
  AlertCircle,
  Play,
  Pause,
  Download
} from 'lucide-react'

interface RecordingSession {
  id: string
  arabicText: string
  englishTranslation: string
  confidence: number
  timestamp: Date
}

export default function EchoChamber() {
  const [isRecording, setIsRecording] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [recordings, setRecordings] = useState<RecordingSession[]>([])
  const [currentRecording, setCurrentRecording] = useState<string>('')
  const [isPlaying, setIsPlaying] = useState(false)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data)
      }

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' })
        await processRecording(audioBlob)
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
    } catch (error) {
      console.error('Error accessing microphone:', error)
      alert('لا يمكن الوصول إلى الميكروفون')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      setIsProcessing(true)
    }
  }

  const processRecording = async (audioBlob: Blob) => {
    // Simulate AI processing
    setTimeout(() => {
      const mockResults = [
        {
          arabicText: 'أنا أحب تعلم اللغة الإنجليزية',
          englishTranslation: 'I love learning English',
          confidence: 0.95
        },
        {
          arabicText: 'كيف حالك اليوم؟',
          englishTranslation: 'How are you today?',
          confidence: 0.88
        },
        {
          arabicText: 'أريد أن أتحدث الإنجليزية بطلاقة',
          englishTranslation: 'I want to speak English fluently',
          confidence: 0.92
        }
      ]

      const randomResult = mockResults[Math.floor(Math.random() * mockResults.length)]
      
      const newSession: RecordingSession = {
        id: Date.now().toString(),
        ...randomResult,
        timestamp: new Date()
      }

      setRecordings(prev => [newSession, ...prev])
      setIsProcessing(false)
    }, 3000)
  }

  const handleSpeak = (text: string, lang: 'ar-SA' | 'en-US' = 'ar-SA') => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = lang
      utterance.rate = 0.8
      speechSynthesis.speak(utterance)
      setIsPlaying(true)
      
      utterance.onend = () => setIsPlaying(false)
    }
  }

  const handleReset = () => {
    setRecordings([])
    setCurrentRecording('')
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'text-green-600'
    if (confidence >= 0.7) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getConfidenceIcon = (confidence: number) => {
    if (confidence >= 0.9) return CheckCircle
    if (confidence >= 0.7) return AlertCircle
    return AlertCircle
  }

  return (
    <div className="h-full w-full bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 p-6 overflow-y-auto">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-2"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Mic className="h-8 w-8 text-primary" />
            <h2 className="text-3xl font-bold font-cairo text-primary">غرفة الصدى</h2>
          </div>
          <p className="text-muted-foreground">
            تدرب على النطق وحسن لهجتك الإنجليزية من خلال التسجيل والاستماع
          </p>
        </motion.div>

        {/* Recording Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="text-center text-primary">التسجيل</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="mb-4">
                  <div className={`w-24 h-24 mx-auto rounded-full border-4 flex items-center justify-center transition-all duration-300 ${
                    isRecording 
                      ? 'border-red-500 bg-red-100 animate-pulse' 
                      : 'border-primary bg-primary/10'
                  }`}>
                    {isRecording ? (
                      <MicOff className="h-12 w-12 text-red-500" />
                    ) : (
                      <Mic className="h-12 w-12 text-primary" />
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    {isRecording 
                      ? 'جاري التسجيل... اضغط لإيقاف' 
                      : 'اضغط لبدء التسجيل'
                    }
                  </p>
                  
                  <div className="flex justify-center gap-4">
                    {!isRecording ? (
                      <Button
                        onClick={startRecording}
                        disabled={isProcessing}
                        className="px-8 py-3 text-lg bg-primary hover:bg-primary/90"
                      >
                        <Mic className="h-5 w-5 ml-2" />
                        ابدأ التسجيل
                      </Button>
                    ) : (
                      <Button
                        onClick={stopRecording}
                        className="px-8 py-3 text-lg bg-red-600 hover:bg-red-700"
                      >
                        <MicOff className="h-5 w-5 ml-2" />
                        أوقف التسجيل
                      </Button>
                    )}
                  </div>

                  {isProcessing && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center justify-center gap-2 text-primary"
                    >
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                      <span>جاري معالجة التسجيل...</span>
                    </motion.div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recordings History */}
        {recordings.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="text-xl font-semibold mb-4 text-center">سجل التسجيلات</h3>
            <div className="space-y-4">
              {recordings.map((recording, index) => {
                const ConfidenceIcon = getConfidenceIcon(recording.confidence)
                
                return (
                  <motion.div
                    key={recording.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <ConfidenceIcon className={`h-5 w-5 ${getConfidenceColor(recording.confidence)}`} />
                            <span className="text-sm text-muted-foreground">
                              {recording.timestamp.toLocaleTimeString('ar-SA')}
                            </span>
                          </div>
                          <span className={`text-sm font-medium ${getConfidenceColor(recording.confidence)}`}>
                            {Math.round(recording.confidence * 100)}% دقة
                          </span>
                        </div>

                        <div className="space-y-3">
                          <div className="bg-green-50 dark:bg-green-950/20 p-3 rounded-lg border border-green-200 dark:border-green-800">
                            <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">النص العربي</h4>
                            <p className="text-green-700 dark:text-green-300">{recording.arabicText}</p>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleSpeak(recording.arabicText, 'ar-SA')}
                              disabled={isPlaying}
                              className="mt-2 text-green-700 hover:text-green-800"
                            >
                              <Volume2 className="h-4 w-4 ml-2" />
                              استمع
                            </Button>
                          </div>

                          <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                            <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">الترجمة الإنجليزية</h4>
                            <p className="text-blue-700 dark:text-blue-300">{recording.englishTranslation}</p>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleSpeak(recording.englishTranslation, 'en-US')}
                              disabled={isPlaying}
                              className="mt-2 text-blue-700 hover:text-blue-800"
                            >
                              <Volume2 className="h-4 w-4 ml-2" />
                              استمع
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <Button
            variant="outline"
            onClick={handleReset}
            className="flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            مسح السجل
          </Button>
        </div>

        {/* Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800"
        >
          <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">نصائح لتحسين النطق</h4>
          <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
            <li>• تحدث ببطء ووضوح</li>
            <li>• ركز على نطق الحروف الصحيحة</li>
            <li>• استمع إلى النطق الصحيح وكرره</li>
            <li>• تدرب بانتظام لتحسين مهاراتك</li>
          </ul>
        </motion.div>
      </div>
    </div>
  )
}
