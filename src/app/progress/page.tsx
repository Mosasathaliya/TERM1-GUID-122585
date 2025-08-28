"use client"

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  TrendingUp, 
  Trophy, 
  Star, 
  Calendar, 
  BookOpen, 
  Target,
  Award,
  Download,
  Share2,
  BarChart3,
  Activity,
  Clock
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function ProgressPage() {
  const [showCertificate, setShowCertificate] = useState(false)

  // Mock data
  const userProfile = {
    name: 'أحمد محمد',
    avatar: 'https://picsum.photos/100/100?random=11',
    level: 'متوسط',
    currentStreak: 7,
    totalLessons: 24,
    totalQuizzes: 8
  }

  const skillProgress = [
    { name: 'قواعد اللغة', progress: 75, color: 'bg-blue-500' },
    { name: 'المفردات', progress: 68, color: 'bg-green-500' },
    { name: 'النطق', progress: 82, color: 'bg-purple-500' },
    { name: 'الاستماع', progress: 71, color: 'bg-orange-500' },
    { name: 'الكتابة', progress: 59, color: 'bg-red-500' }
  ]

  const weeklyActivity = [
    { day: 'الأحد', lessons: 3, quizzes: 1 },
    { day: 'الاثنين', lessons: 2, quizzes: 0 },
    { day: 'الثلاثاء', lessons: 4, quizzes: 2 },
    { day: 'الأربعاء', lessons: 1, quizzes: 1 },
    { day: 'الخميس', lessons: 3, quizzes: 0 },
    { day: 'الجمعة', lessons: 2, quizzes: 1 },
    { day: 'السبت', lessons: 5, quizzes: 2 }
  ]

  const achievements = [
    { id: 1, name: 'أول درس', description: 'أكملت أول درس في الدليل', icon: Star, unlocked: true },
    { id: 2, name: 'متعلم نشط', description: 'تعلمت لمدة 7 أيام متتالية', icon: Calendar, unlocked: true },
    { id: 3, name: 'مفردات غنية', description: 'تعلمت 50 كلمة جديدة', icon: BookOpen, unlocked: true },
    { id: 4, name: 'نطق مثالي', description: 'حصلت على 90% في اختبار النطق', icon: Target, unlocked: false },
    { id: 5, name: 'قواعد متقنة', description: 'أكملت جميع دروس القواعد', icon: Award, unlocked: false }
  ]

  const stats = [
    { title: 'إجمالي الدروس', value: userProfile.totalLessons, icon: BookOpen, color: 'text-blue-600' },
    { title: 'الاختبارات المكتملة', value: userProfile.totalQuizzes, icon: Target, color: 'text-green-600' },
    { title: 'أيام التعلم المتتالية', value: userProfile.currentStreak, icon: Calendar, color: 'text-orange-600' },
    { title: 'المستوى الحالي', value: userProfile.level, icon: TrendingUp, color: 'text-purple-600' }
  ]

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header - Mobile Optimized */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-3 sm:space-y-4"
      >
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold font-cairo text-primary leading-tight">
          تقدمي في التعلم
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-muted-foreground font-tajawal px-2">
          تتبع تقدمك واحتفل بإنجازاتك
        </p>
      </motion.div>

      {/* Profile Card - Mobile Optimized */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mx-2 sm:mx-0"
      >
        <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-center sm:text-right">
              <img
                src={userProfile.avatar}
                alt={userProfile.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-primary/20"
              />
              <div className="flex-1">
                <h2 className="text-xl sm:text-2xl font-bold font-cairo mb-2">{userProfile.name}</h2>
                <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-muted-foreground text-sm sm:text-base">
                  <span className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" />
                    المستوى: {userProfile.level}
                  </span>
                  <span className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
                    {userProfile.currentStreak} يوم متتالي
                  </span>
                </div>
              </div>
              <div className="text-center sm:text-right">
                <div className="text-2xl sm:text-3xl font-bold text-primary">{userProfile.totalLessons}</div>
                <div className="text-xs sm:text-sm text-muted-foreground">درس مكتمل</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats Cards - Mobile Optimized */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mx-2 sm:mx-0"
      >
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-3 sm:p-4">
                  <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 text-center">
                    <div className={`p-2 rounded-lg bg-primary/10`}>
                      <stat.icon className={`h-5 w-5 sm:h-6 sm:w-6 ${stat.color}`} />
                    </div>
                    <div>
                      <div className="text-lg sm:text-2xl font-bold">{stat.value}</div>
                      <div className="text-xs sm:text-sm text-muted-foreground">{stat.title}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Progress Bars - Mobile Optimized */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="mx-2 sm:mx-0"
      >
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              تقدم المهارات
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {skillProgress.map((skill, index) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm sm:text-base">{skill.name}</span>
                  <span className="text-xs sm:text-sm text-muted-foreground">{skill.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 sm:h-2">
                  <motion.div
                    className={`h-2.5 sm:h-2 rounded-full ${skill.color}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.progress}%` }}
                    transition={{ duration: 1, delay: 1 + index * 0.1 }}
                  />
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* Activity Chart - Mobile Optimized */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="mx-2 sm:mx-0"
      >
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <Activity className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              النشاط الأسبوعي
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48 sm:h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyActivity}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Bar dataKey="lessons" fill="#14a360" name="الدروس" />
                  <Bar dataKey="quizzes" fill="#8b5cf6" name="الاختبارات" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Achievements - Mobile Optimized */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.0 }}
        className="mx-2 sm:mx-0"
      >
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <Trophy className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              الإنجازات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 1.1 + index * 0.1 }}
                >
                  <Card className={`text-center p-3 sm:p-4 transition-all duration-300 ${
                    achievement.unlocked 
                      ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200 dark:from-yellow-950/20 dark:to-orange-950/20 dark:border-yellow-800'
                      : 'bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700'
                  }`}>
                    <div className={`mx-auto mb-3 p-2 sm:p-3 rounded-full ${
                      achievement.unlocked 
                        ? 'bg-yellow-100 dark:bg-yellow-900/50' 
                        : 'bg-gray-100 dark:bg-gray-800'
                    }`}>
                      <achievement.icon className={`h-6 w-6 sm:h-8 sm:w-8 mx-auto ${
                        achievement.unlocked 
                          ? 'text-yellow-600 dark:text-yellow-400' 
                          : 'text-gray-400'
                      }`} />
                    </div>
                    <h3 className={`font-semibold mb-2 text-sm sm:text-base ${
                      achievement.unlocked 
                        ? 'text-yellow-800 dark:text-yellow-200' 
                        : 'text-gray-500'
                    }`}>
                      {achievement.name}
                    </h3>
                    <p className={`text-xs sm:text-sm ${
                      achievement.unlocked 
                        ? 'text-yellow-700 dark:text-yellow-300' 
                        : 'text-gray-400'
                    }`}>
                      {achievement.description}
                    </p>
                    {achievement.unlocked && (
                      <div className="mt-3">
                        <Star className="h-4 w-4 sm:h-5 sm:w-5 mx-auto text-yellow-500" />
                      </div>
                    )}
                  </Card>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Certificate Section - Mobile Optimized */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.2 }}
        className="text-center mx-2 sm:mx-0"
      >
        <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20 border-amber-200 dark:border-amber-800">
          <CardContent className="p-6 sm:p-8">
            <div className="mb-6">
              <Trophy className="h-12 w-12 sm:h-16 sm:w-16 mx-auto text-amber-600 dark:text-amber-400 mb-4" />
              <h3 className="text-xl sm:text-2xl font-bold text-amber-800 dark:text-amber-200 mb-2">
                شهادة الإنجاز
              </h3>
              <p className="text-amber-700 dark:text-amber-300 text-sm sm:text-base">
                احصل على شهادة إتمام الفصل الأول
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-amber-600 hover:bg-amber-700 h-11 w-full sm:w-auto">
                    <Award className="h-4 w-4 sm:h-5 sm:w-5 ml-2" />
                    عرض الشهادة
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto mx-2 sm:mx-auto">
                  <DialogHeader>
                    <DialogTitle className="text-base sm:text-lg">شهادة الإنجاز</DialogTitle>
                  </DialogHeader>
                  <div className="text-center py-6 sm:py-8">
                    <div className="border-4 border-amber-300 rounded-lg p-6 sm:p-8 bg-gradient-to-br from-amber-50 to-yellow-50">
                      <Trophy className="h-16 w-16 sm:h-20 sm:w-20 mx-auto text-amber-600 mb-4" />
                      <h2 className="text-2xl sm:text-3xl font-bold text-amber-800 mb-2">شهادة الإنجاز</h2>
                      <p className="text-base sm:text-lg text-amber-700 mb-4">تم منحها إلى</p>
                      <h3 className="text-xl sm:text-2xl font-bold text-amber-800 mb-4">{userProfile.name}</h3>
                      <p className="text-amber-700 mb-6 text-sm sm:text-base">لإتمام الفصل الأول من دورة تعلم اللغة الإنجليزية</p>
                      <div className="text-xs sm:text-sm text-amber-600">
                        تاريخ الإصدار: {new Date().toLocaleDateString('ar-SA')}
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              
              <Button variant="outline" className="h-11 w-full sm:w-auto">
                <Download className="h-4 w-4 sm:h-5 sm:w-5 ml-2" />
                تحميل
              </Button>
              
              <Button variant="outline" className="h-11 w-full sm:w-auto">
                <Share2 className="h-4 w-4 sm:h-5 sm:w-5 ml-2" />
                مشاركة
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
