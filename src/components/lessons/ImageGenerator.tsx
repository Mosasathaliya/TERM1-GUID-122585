"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Image as ImageIcon, Download } from 'lucide-react'

interface ImageGeneratorProps {
  prompt: string
  lesson: string
  goal: string
}

export default function ImageGenerator({ prompt, lesson, goal }: ImageGeneratorProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generateImage = async () => {
    setIsGenerating(true)
    setError(null)
    
    try {
      const response = await fetch('https://ai-gateway-worker.speedofmastry.workers.dev', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'generate-image',
          lesson,
          goal,
          prompt
        })
      })

      if (!response.ok) {
        throw new Error(`Failed to generate image: ${response.status}`)
      }

      const contentType = response.headers.get('content-type')
      
      if (contentType && contentType.includes('image/')) {
        // Response is an image
        const blob = await response.blob()
        const url = URL.createObjectURL(blob)
        setImageUrl(url)
      } else {
        // Response is JSON with error
        const result = await response.json()
        if (!result.success) {
          throw new Error(result.error || 'Image generation failed')
        }
        // If it's a successful JSON response with image data
        if (result.data && result.data.imageUrl) {
          setImageUrl(result.data.imageUrl)
        } else {
          throw new Error('No image data received')
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate image')
      console.error('Image generation error:', err)
    } finally {
      setIsGenerating(false)
    }
  }

  const downloadImage = () => {
    if (imageUrl) {
      const link = document.createElement('a')
      link.href = imageUrl
      link.download = `lesson-image-${Date.now()}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="h-5 w-5" />
          Image Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground">
          <p><strong>Prompt:</strong> {prompt}</p>
        </div>
        
        <Button 
          onClick={generateImage} 
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
              <ImageIcon className="h-4 w-4 mr-2" />
              Generate Image
            </>
          )}
        </Button>

        {error && (
          <div className="text-red-500 text-sm bg-red-50 p-3 rounded-md">
            {error}
          </div>
        )}

        {imageUrl && (
          <div className="space-y-3">
            <div className="relative">
              <img 
                src={imageUrl} 
                alt={prompt}
                className="w-full h-48 object-cover rounded-md border"
              />
            </div>
            <Button 
              onClick={downloadImage}
              variant="outline"
              className="w-full"
            >
              <Download className="h-4 w-4 mr-2" />
              Download Image
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

