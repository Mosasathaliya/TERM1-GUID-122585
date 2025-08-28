import React from 'react'
import { COURSE_STRUCTURE } from '@/lib/lessons/course-structure'
import LessonViewer from '@/components/lessons/LessonViewer'

// Generate static params for all lessons
export function generateStaticParams() {
  const params = []
  for (const unit of COURSE_STRUCTURE) {
    for (const lesson of unit.lessons) {
      params.push({ lessonId: lesson.id.toString() })
    }
  }
  return params
}

interface LessonPageProps {
  params: { lessonId: string }
}

export default function LessonPage({ params }: LessonPageProps) {
  const lessonId = parseInt(params.lessonId)

  if (isNaN(lessonId)) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">
          Invalid Lesson ID
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Please select a valid lesson from the course structure.
        </p>
      </div>
    )
  }

  return <LessonViewer lessonId={lessonId} />
}
