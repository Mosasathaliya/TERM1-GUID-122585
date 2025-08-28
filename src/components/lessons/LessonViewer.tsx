"use client"

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, ArrowLeft } from 'lucide-react'
import { 
  getLessonById, 
  getUnitByLessonId, 
  type LessonCard as UILessonCard
} from '@/lib/lessons/course-structure'
import { aiLessonGenerator } from '@/lib/services/ai-lesson-generator'
import { LessonGenerationRequest } from '@/types/lesson'
import { InteractiveLessonViewer } from './InteractiveLessonViewer'
import { toast } from 'sonner'

interface LessonViewerProps {
  lessonId: number
}

export default function LessonViewer({ lessonId }: LessonViewerProps) {
  const router = useRouter()
  const [lesson, setLesson] = useState(getLessonById(lessonId))
  const [unit, setUnit] = useState(getUnitByLessonId(lessonId))
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lessonContent, setLessonContent] = useState<any>(null)

  // Generate or fetch lesson content
  const generateLessonContent = async () => {
    if (!lesson) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const request: Partial<LessonGenerationRequest> = {
        lessonTitle: lesson.title,
        topic: lesson.title,
        learningGoal: lesson.description || 'Learn new vocabulary and grammar',
        language: 'ar',
        includeAudio: true,
        includeImages: true
      };
      
      // Generate lesson content using AI
      const content = await aiLessonGenerator.generateLesson(request as LessonGenerationRequest);
      setLessonContent(content);
      
    } catch (err) {
      console.error('Error generating lesson:', err);
      setError('Failed to generate lesson content. Please try again.');
      toast.error('Failed to load lesson');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Load lesson content when component mounts or lesson changes
  useEffect(() => {
    if (lesson) {
      generateLessonContent();
    }
  }, [lessonId, lesson]);

  if (!lesson) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">
          Lesson Not Found
        </h1>
        <p className="text-gray-600">
          The requested lesson could not be found.
        </p>
        <button 
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center mx-auto"
          onClick={() => router.push('/learn')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Lessons
        </button>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" />
        <p className="text-lg text-gray-600">Preparing your lesson...</p>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-xl font-semibold text-red-600 mb-2">Error Loading Lesson</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <button 
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          onClick={generateLessonContent}
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <button 
          className="mb-4 px-3 py-1.5 text-sm text-blue-600 hover:text-blue-800 flex items-center transition-colors"
          onClick={() => router.push('/learn')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Lessons
        </button>
        
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-full">
            {unit?.title}
          </span>
          <span className="text-gray-400">•</span>
          <span className="text-sm text-gray-600">
            {lesson.duration} min • {lesson.category}
          </span>
        </div>
        
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          {lesson.title}
        </h1>
        <p className="text-gray-600">
          {lesson.description}
        </p>
      </div>
      
      {lessonContent ? (
        <InteractiveLessonViewer lesson={lessonContent} />
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">No lesson content available</p>
          <button 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            onClick={generateLessonContent}
          >
            Generate Lesson
          </button>
        </div>
      )}
    </div>
  )
}
