// Type definitions for Al-Dalil English Learning Platform

// AI Flow Types
export interface StoryLesson {
  story: string
  vocabulary: Array<{
    word: string
    translation: string
    example: string
  }>
  grammarAnalysis: string
  quiz: Array<{
    question: string
    options: string[]
    correctAnswer: number
  }>
  imagePrompt: string
}

export interface ExamQuestions {
  questions: Array<{
    question: string
    options: string[]
    correctAnswer: number
    explanation: string
    topic: string
  }>
}

export interface MatchingGame {
  pairs: Array<{
    english: string
    arabic: string
    emoji: string
  }>
}

// User Progress Types
export interface UserProgress {
  userId: string
  currentLevel: string
  lessonsCompleted: number
  quizzesTaken: number
  averageScore: number
  lastActivity: string
  skills?: {
    grammar: number
    vocabulary: number
    pronunciation: number
    listening: number
    writing: number
  }
}

// Lesson Types
export interface Lesson {
  id: string
  title: string
  description: string
  category: string
  type: 'video' | 'interactive' | 'grammar' | 'ai' | 'exam'
  difficulty: 'سهل' | 'متوسط' | 'صعب'
  videoUrl?: string
  interactiveUrl?: string
  flipbookUrl?: string
  content?: string
  tags?: string[]
}

// Video Types
export interface Video {
  id: string
  title: string
  description: string
  thumbnail: string
  youtubeUrl: string
  duration: string
  category: string
  difficulty: string
}

// Game Types
export interface Game {
  id: string
  title: string
  description: string
  thumbnail: string
  iframeUrl: string
  category: string
  difficulty: string
  tags?: string[]
}

// Achievement Types
export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  unlocked: boolean
  unlockedAt?: string
  progress?: number
}

// User Profile Types
export interface UserProfile {
  id: string
  name: string
  email: string
  avatar?: string
  level: string
  joinDate: string
  preferences?: {
    theme: string
    language: string
    notifications: boolean
  }
}
