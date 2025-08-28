interface AIModel {
  run(modelName: string, options: Record<string, unknown>): Promise<unknown>;
}

export interface Env {
  AI: AIModel;
}

export interface LessonRequest {
  action: string;
  lesson: string;
  goal: string;
  prompt?: string;
  text?: string;
  audio?: string;
  options?: LessonOptions;
}

export interface LessonResponse {
  success: boolean;
  data?: unknown;
  error?: string;
  timestamp: number;
}

export interface LessonOptions {
  level?: string;
  language?: string;
  includeImages?: boolean;
  includeAudio?: boolean;
  [key: string]: any;
}
