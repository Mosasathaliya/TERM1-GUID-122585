"use client"

import React, { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Volume2, Play, Pause, Download } from 'lucide-react'

interface TTSGeneratorProps {
  text: string
  lesson: string
  goal: string
}

export default function TTSGenerator({ text, lesson, goal }: TTSGeneratorProps) {
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement>(null)

  const generateTTS = async () => {
    setIsGenerating(true)
    setError(null)
    
    try {
      const response = await fetch('https://ai-gateway-worker.speedofmastry.workers.dev', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'generate-tts',
          lesson,
          goal,
          text
        })
      })

      if (!response.ok) {
        throw new Error(`Failed to generate TTS: ${response.status}`)
      }

      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || 'TTS generation failed')
      }

      if (result.data && result.data.audioUrl) {
        setAudioUrl(result.data.audioUrl)
      } else {
        throw new Error('No audio data received')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate TTS')
      console.error('TTS generation error:', err)
    } finally {
      setIsGenerating(false)
    }
  }

  const togglePlayback = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      audioRef.current.play()
      setIsPlaying(true)
    }
  }

  const downloadAudio = () => {
    if (audioUrl) {
      const link = document.createElement('a')
      link.href = audioUrl
      link.download = `lesson-tts-${Date.now()}.mp3`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Volume2 className="h-5 w-5" />
          Text-to-Speech Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground">
          <p><strong>Text:</strong> {text}</p>
        </div>
        
        <Button 
          onClick={generateTTS} 
          disabled={isGenerating}
          className="w-full"
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Volume2 className="h-4 w-4 mr-2" />
              Generate Speech
            </>
          )}
        </Button>

        {error && (
          <div className="text-red-500 text-sm bg-red-50 p-3 rounded-md">
            {error}
          </div>
        )}

        {audioUrl && (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Button 
                onClick={togglePlayback}
                variant="outline"
                size="icon"
              >
                {isPlaying ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </Button>
              
              <Button 
                onClick={downloadAudio}
                variant="outline"
                size="icon"
              >
                <Download className="h-4 w-4" />
              </Button>
            </div>
            
            <audio
              ref={audioRef}
              src={audioUrl}
              onEnded={() => setIsPlaying(false)}
              onPause={() => setIsPlaying(false)}
              onPlay={() => setIsPlaying(true)}
            />
          </div>
        )}
      </CardContent>
    </Card>
  )
}

