interface VideoData {
  id: string
  title: string
  description: string
  thumbnail: string
  youtubeUrl: string
  duration: string
  category: string
  difficulty: string
}

interface GameData {
  id: string
  title: string
  description: string
  thumbnail: string
  iframeUrl: string
  category: string
  difficulty: string
  tags: string[]
}

class GoogleSheetsService {
  private baseUrl = 'https://sheets.googleapis.com/v4/spreadsheets'
  private apiKey: string
  private spreadsheetId: string

  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_API_KEY || ''
    this.spreadsheetId = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_ID || ''
    
    if (!this.apiKey || !this.spreadsheetId) {
      console.warn('Google Sheets API key or spreadsheet ID not found. Dynamic content will not work.')
    }
  }

  private async fetchSheetData(range: string): Promise<string[][]> {
    try {
      if (!this.apiKey || !this.spreadsheetId) {
        throw new Error('Google Sheets not configured')
      }

      const response = await fetch(
        `${this.baseUrl}/${this.spreadsheetId}/values/${range}?key=${this.apiKey}`
      )

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data.values || []
    } catch (error) {
      console.error('Failed to fetch Google Sheets data:', error)
      return []
    }
  }

  async getVideos(): Promise<VideoData[]> {
    try {
      const data = await this.fetchSheetData('Videos!A2:F')
      
      if (data.length === 0) {
        // Return mock data if no real data available
        return this.getMockVideos()
      }

      return data.map((row, index) => ({
        id: row[0] || `video-${index}`,
        title: row[1] || '',
        description: row[2] || '',
        thumbnail: row[3] || '',
        youtubeUrl: row[4] || '',
        duration: row[5] || '',
        category: row[6] || 'عام',
        difficulty: row[7] || 'سهل'
      }))
    } catch (error) {
      console.error('Failed to get videos:', error)
      return this.getMockVideos()
    }
  }

  async getGames(): Promise<GameData[]> {
    try {
      const data = await this.fetchSheetData('Games!A2:G')
      
      if (data.length === 0) {
        // Return mock data if no real data available
        return this.getMockGames()
      }

      return data.map((row, index) => ({
        id: row[0] || `game-${index}`,
        title: row[1] || '',
        description: row[2] || '',
        thumbnail: row[3] || '',
        iframeUrl: row[4] || '',
        category: row[5] || 'عام',
        difficulty: row[6] || 'سهل',
        tags: row[7] ? row[7].split(',').map((tag: string) => tag.trim()) : []
      }))
    } catch (error) {
      console.error('Failed to get games:', error)
      return this.getMockGames()
    }
  }

  async getLessons(): Promise<Record<string, unknown>[]> {
    try {
      const data = await this.fetchSheetData('Lessons!A2:H')
      
      if (data.length === 0) {
        return []
      }

      return data.map((row, index) => ({
        id: row[0] || `lesson-${index}`,
        title: row[1] || '',
        description: row[2] || '',
        type: row[3] || 'video',
        category: row[4] || 'عام',
        difficulty: row[5] || 'سهل',
        url: row[6] || '',
        tags: row[7] ? row[7].split(',').map((tag: string) => tag.trim()) : []
      }))
    } catch (error) {
      console.error('Failed to get lessons:', error)
      return []
    }
  }

  async getProgressData(userId: string): Promise<Record<string, unknown> | null> {
    try {
      const data = await this.fetchSheetData(`Progress!A2:F`)
      
      if (data.length === 0) {
        return null
      }

      // Find user's progress data
      const userRow = data.find(row => row[0] === userId)
      if (!userRow) {
        return null
      }

      return {
        userId: userRow[0],
        currentLevel: userRow[1],
        lessonsCompleted: parseInt(userRow[2]) || 0,
        quizzesTaken: parseInt(userRow[3]) || 0,
        averageScore: parseFloat(userRow[4]) || 0,
        lastActivity: userRow[5] || new Date().toISOString()
      }
    } catch (error) {
      console.error('Failed to get progress data:', error)
      return null
    }
  }

  async updateProgress(userId: string, progressData: Record<string, unknown>): Promise<boolean> {
    try {
      if (!this.apiKey || !this.spreadsheetId) {
        throw new Error('Google Sheets not configured')
      }

      // This would require additional setup with Google Apps Script or backend service
      // For now, we'll just log the attempt
      console.log('Progress update requested:', { userId, progressData })
      
      return true
    } catch (error) {
      console.error('Failed to update progress:', error)
      return false
    }
  }

  private getMockVideos(): VideoData[] {
    return [
      {
        id: '1',
        title: 'الأبجدية الإنجليزية - الحروف الكبيرة',
        description: 'تعلم نطق وكتابة الحروف الكبيرة في اللغة الإنجليزية',
        thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
        youtubeUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        duration: '5:30',
        category: 'أبجدية',
        difficulty: 'سهل'
      },
      {
        id: '2',
        title: 'الأرقام من 1 إلى 10',
        description: 'تعلم العد باللغة الإنجليزية بطريقة ممتعة',
        thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
        youtubeUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        duration: '4:15',
        category: 'أرقام',
        difficulty: 'سهل'
      },
      {
        id: '3',
        title: 'الألوان الأساسية',
        description: 'تعلم أسماء الألوان باللغة الإنجليزية',
        thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
        youtubeUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        duration: '6:20',
        category: 'ألوان',
        difficulty: 'سهل'
      },
      {
        id: '4',
        title: 'الحيوانات الأليفة',
        description: 'تعلم أسماء الحيوانات الأليفة باللغة الإنجليزية',
        thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
        youtubeUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        duration: '7:45',
        category: 'حيوانات',
        difficulty: 'سهل'
      }
    ]
  }

  private getMockGames(): GameData[] {
    return [
      {
        id: '1',
        title: 'مطابقة الكلمات',
        description: 'اطبع الكلمة الإنجليزية مع معناها العربي',
        thumbnail: 'https://via.placeholder.com/300x200/14a360/ffffff?text=مطابقة+الكلمات',
        iframeUrl: 'https://www.learninggamesforkids.com/word-games/word-scramble/word-scramble.html',
        category: 'مفردات',
        difficulty: 'سهل',
        tags: ['مطابقة', 'مفردات', 'تعليمي']
      },
      {
        id: '2',
        title: 'ألغاز الحروف',
        description: 'حل الألغاز باستخدام الحروف الإنجليزية',
        thumbnail: 'https://via.placeholder.com/300x200/14a360/ffffff?text=ألغاز+الحروف',
        iframeUrl: 'https://www.learninggamesforkids.com/word-games/word-search/word-search.html',
        category: 'أبجدية',
        difficulty: 'متوسط',
        tags: ['ألغاز', 'أبجدية', 'تعليمي']
      },
      {
        id: '3',
        title: 'عد الأرقام',
        description: 'تعلم العد من خلال الألعاب التفاعلية',
        thumbnail: 'https://via.placeholder.com/300x200/14a360/ffffff?text=عد+الأرقام',
        iframeUrl: 'https://www.learninggamesforkids.com/math-games/counting/counting.html',
        category: 'أرقام',
        difficulty: 'سهل',
        tags: ['أرقام', 'عد', 'تعليمي']
      },
      {
        id: '4',
        title: 'ألوان الطبيعة',
        description: 'تعلم الألوان من خلال الطبيعة',
        thumbnail: 'https://via.placeholder.com/300x200/14a360/ffffff?text=ألوان+الطبيعة',
        iframeUrl: 'https://www.learninggamesforkids.com/science-games/colors/colors.html',
        category: 'ألوان',
        difficulty: 'سهل',
        tags: ['ألوان', 'طبيعة', 'تعليمي']
      }
    ]
  }
}

export const googleSheets = new GoogleSheetsService()
export default googleSheets
