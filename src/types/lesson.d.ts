import { ReactNode } from 'react';

declare module '@/lib/lessons/course-structure' {
  export interface Lesson {
    id: number;
    title: string;
    description?: string;
    duration?: number;
    category: string;
    difficulty?: string;
    type: string;
    content?: any;
  }
}
