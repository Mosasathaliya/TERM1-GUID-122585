'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Play, Volume2, AlertCircle, CheckCircle } from 'lucide-react'
import { cloudflareAI } from '@/lib/services/cloudflare-ai'

export default function TTSTestPage() {
  const [text, setText] = useState('Hello, this is a test of the TTS system.')
  const [isGenerating, setIsGenerating] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [logs, setLogs] = useState<string[]>([])

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  const testTTS = async () => {
    setIsGenerating(true)
    setStatus('idle')
    setLogs([])
    
    try {
      addLog('🎵 Starting TTS test...')
      addLog(`🎵 Text to convert: "${text}"`)
      
      const response = await cloudflareAI.generateSpeech(text, 'en')
      addLog(`🎵 Response received: ${JSON.stringify(response, null, 2)}`)
      
      if (response.success && response.result) {
        addLog('🎵 TTS successful!')
        addLog(`🎵 Result type: ${typeof response.result}`)
        addLog(`🎵 Result length: ${typeof response.result === 'string' ? response.result.length : 'N/A'}`)
        
        // Try to play audio
        try {
          const audioUrl = `data:audio/wav;base64,${response.result}`
          addLog('🎵 Creating audio element...')
          
          const audio = new Audio(audioUrl)
          
          audio.addEventListener('loadstart', () => addLog('🎵 Audio loading started'))
          audio.addEventListener('canplay', () => addLog('🎵 Audio can play'))
          audio.addEventListener('play', () => addLog('🎵 Audio playing started'))
          audio.addEventListener('ended', () => addLog('🎵 Audio playback ended'))
          audio.addEventListener('error', (e) => addLog(`🎵 Audio error: ${e}`))
          
          const playPromise = audio.play()
          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                addLog('🎵 Audio playback successful!')
                setStatus('success')
              })
              .catch((playError) => {
                addLog(`🎵 Audio playback failed: ${playError}`)
                setStatus('error')
              })
          }
          
        } catch (audioError) {
          addLog(`🎵 Audio creation/playback error: ${audioError}`)
          setStatus('error')
        }
        
      } else {
        addLog(`🎵 TTS failed: ${response.error || 'Unknown error'}`)
        setStatus('error')
      }
      
    } catch (error) {
      addLog(`🎵 TTS generation error: ${error}`)
      if (error instanceof Error) {
        addLog(`🎵 Error name: ${error.name}`)
        addLog(`🎵 Error message: ${error.message}`)
      }
      setStatus('error')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold text-center mb-8">🎵 TTS Test Page</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Volume2 className="h-6 w-6" />
            Test Text-to-Speech
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text to convert to speech..."
            className="min-h-[100px]"
          />
          
          <Button 
            onClick={testTTS} 
            disabled={isGenerating}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Generating Audio...
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Test TTS
              </>
            )}
          </Button>
          
          {status === 'success' && (
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              TTS successful! Check logs below.
            </div>
          )}
          
          {status === 'error' && (
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              TTS failed! Check logs below.
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Debug Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg max-h-[400px] overflow-y-auto">
            {logs.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">No logs yet. Click &ldquo;Test TTS&rdquo; to start.</p>
            ) : (
              logs.map((log, index) => (
                <div key={index} className="text-sm font-mono mb-1 text-gray-900 dark:text-gray-100">
                  {log}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
