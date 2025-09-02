'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { 
  Trophy, 
  Star, 
  Target, 
  Clock, 
  TrendingUp, 
  BookOpen, 
  Home, 
  RotateCcw,
  Sparkles,
  Award,
  Zap,
  Heart
} from 'lucide-react'
import { useStatsStore } from '@/lib/stats-store'

interface QuizCompletionScreenProps {
  correctAnswers: number
  totalQuestions: number
  onRestart: () => void
}

export function QuizCompletionScreen({ 
  correctAnswers, 
  totalQuestions, 
  onRestart 
}: QuizCompletionScreenProps) {
  const [showAnimation, setShowAnimation] = useState(false)
  const [showStats, setShowStats] = useState(false)
  const { addXp, completeLesson, completeLessonOnBackend } = useStatsStore()
  const { data: session } = useSession()

  const finalScore = (correctAnswers / totalQuestions) * 100
  const accuracy = finalScore
  
  // Calculate XP and bonuses
  let baseXp = 50
  let bonusXp = 0
  let performanceLevel = "Good"
  let performanceColor = "from-blue-500 to-cyan-500"
  let performanceIcon = Trophy
  let performanceMessage = "Well done! You're making great progress!"
  let celebrationEmoji = "🎯"
  
  if (accuracy === 100) {
    performanceLevel = "Perfect"
    performanceColor = "from-yellow-400 to-orange-500"
    performanceIcon = Award
    performanceMessage = "Outstanding! You aced this quiz!"
    celebrationEmoji = "🏆"
    bonusXp = 25
  } else if (accuracy >= 90) {
    performanceLevel = "Excellent"
    performanceColor = "from-green-400 to-emerald-500"
    performanceIcon = Star
    performanceMessage = "Excellent work! You're really getting it!"
    celebrationEmoji = "⭐"
    bonusXp = 15
  } else if (accuracy >= 75) {
    performanceLevel = "Good"
    performanceColor = "from-blue-500 to-cyan-500"
    performanceIcon = Target
    performanceMessage = "Good job! You're on the right track!"
    celebrationEmoji = "👍"
    bonusXp = 5
  } else {
    performanceLevel = "Keep Learning"
    performanceColor = "from-purple-500 to-pink-500"
    performanceIcon = Heart
    performanceMessage = "Don't give up! Every attempt makes you stronger!"
    celebrationEmoji = "💪"
  }
  
  const totalXp = baseXp + bonusXp

  useEffect(() => {
    // Award XP and complete lesson
    addXp(totalXp)
    completeLesson()
    
    if (session?.backendToken) {
      completeLessonOnBackend('quiz-completion', totalXp, session.backendToken).catch((error: any) => {
        console.error('Failed to complete lesson on backend:', error)
      })
    }

    // Trigger animations
    const timer1 = setTimeout(() => setShowAnimation(true), 300)
    const timer2 = setTimeout(() => setShowStats(true), 800)
    
    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
    }
  }, [addXp, completeLesson, completeLessonOnBackend, session?.backendToken, totalXp])

  const PerformanceIcon = performanceIcon

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl space-y-8">
        
        {/* Hero Section */}
        <div className={`text-center space-y-6 transition-all duration-1000 ${
          showAnimation ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          {/* Celebration Animation */}
          <div className="relative">
            <div className={`w-32 h-32 mx-auto rounded-full bg-gradient-to-r ${performanceColor} flex items-center justify-center text-6xl shadow-2xl transition-all duration-1000 ${
              showAnimation ? 'scale-100 rotate-0' : 'scale-50 rotate-180'
            }`}>
              {celebrationEmoji}
            </div>
            
            {/* Floating particles */}
            {showAnimation && (
              <>
                <div className="absolute -top-4 -left-4 w-3 h-3 bg-yellow-400 rounded-full animate-bounce delay-100"></div>
                <div className="absolute -top-2 -right-6 w-2 h-2 bg-pink-400 rounded-full animate-bounce delay-300"></div>
                <div className="absolute -bottom-2 -left-6 w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-500"></div>
                <div className="absolute -bottom-4 -right-2 w-3 h-3 bg-green-400 rounded-full animate-bounce delay-700"></div>
              </>
            )}
          </div>

          {/* Main Title */}
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Quiz Complete!
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              {performanceMessage}
            </p>
          </div>

          {/* Performance Badge */}
          <div className="flex justify-center">
            <Badge 
              variant="secondary" 
              className={`px-8 py-4 text-lg font-semibold bg-gradient-to-r ${performanceColor} text-white border-0 shadow-lg`}
            >
              <PerformanceIcon className="w-5 h-5 mr-2" />
              {performanceLevel} Performance
            </Badge>
          </div>
        </div>

        {/* Stats Grid */}
        <div className={`grid gap-6 md:grid-cols-2 lg:grid-cols-4 transition-all duration-1000 delay-300 ${
          showStats ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          
          {/* Score Card */}
          <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2">
                {finalScore.toFixed(0)}%
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                Final Score
              </p>
              <Progress value={finalScore} className="h-2" />
              <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
                {correctAnswers} of {totalQuestions} correct
              </p>
            </CardContent>
          </Card>

          {/* XP Card */}
          <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2">
                +{totalXp}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                XP Earned
              </p>
              {bonusXp > 0 && (
                <Badge variant="outline" className="text-xs">
                  +{bonusXp} bonus
                </Badge>
              )}
            </CardContent>
          </Card>

          {/* Time Card */}
          <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2">
                {totalQuestions}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Questions Completed
              </p>
            </CardContent>
          </Card>

          {/* Progress Card */}
          <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2">
                ✓
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Lesson Complete
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Performance Analysis */}
        <div className={`transition-all duration-1000 delay-500 ${
          showStats ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <Card className="border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Sparkles className="w-5 h-5 text-yellow-500" />
                Performance Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Main Metrics */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Accuracy</span>
                    <span className="font-semibold">{finalScore.toFixed(1)}%</span>
                  </div>
                  <Progress value={finalScore} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Questions Correct</span>
                    <span className="font-semibold">{correctAnswers}/{totalQuestions}</span>
                  </div>
                  <Progress value={(correctAnswers / totalQuestions) * 100} className="h-2" />
                </div>
              </div>

              {/* Performance Breakdown */}
              <div className="grid gap-4 md:grid-cols-3">
                <div className="text-center p-4 rounded-lg bg-green-50 dark:bg-green-900/20">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {correctAnswers}
                  </div>
                  <div className="text-sm text-green-700 dark:text-green-300">
                    Correct Answers
                  </div>
                </div>
                <div className="text-center p-4 rounded-lg bg-red-50 dark:bg-red-900/20">
                  <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                    {totalQuestions - correctAnswers}
                  </div>
                  <div className="text-sm text-red-700 dark:text-red-300">
                    Incorrect Answers
                  </div>
                </div>
                <div className="text-center p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {totalXp}
                  </div>
                  <div className="text-sm text-blue-700 dark:text-blue-300">
                    Total XP Earned
                  </div>
                </div>
              </div>

              {/* Performance Insights */}
              <div className="space-y-3">
                <h4 className="font-semibold text-slate-800 dark:text-slate-200">Performance Insights</h4>
                <div className="space-y-2">
                  {accuracy === 100 && (
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
                      <Award className="w-4 h-4 text-yellow-600" />
                      <span className="text-sm text-yellow-800 dark:text-yellow-200">
                        Perfect Score! You've achieved mastery level in this topic.
                      </span>
                    </div>
                  )}
                  {accuracy >= 90 && accuracy < 100 && (
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
                      <Star className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-green-800 dark:text-green-200">
                        Excellent performance! You're very close to mastery.
                      </span>
                    </div>
                  )}
                  {accuracy >= 75 && accuracy < 90 && (
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                      <Target className="w-4 h-4 text-blue-600" />
                      <span className="text-sm text-blue-800 dark:text-blue-200">
                        Good progress! A few more attempts will get you to excellence.
                      </span>
                    </div>
                  )}
                  {accuracy < 75 && (
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                      <Heart className="w-4 h-4 text-purple-600" />
                      <span className="text-sm text-purple-800 dark:text-purple-200">
                        Keep practicing! Every attempt builds your knowledge.
                      </span>
                    </div>
                  )}
                  
                  {bonusXp > 0 && (
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-orange-50 dark:bg-orange-900/20">
                      <Zap className="w-4 h-4 text-orange-600" />
                      <span className="text-sm text-orange-800 dark:text-orange-200">
                        Bonus XP earned for {performanceLevel.toLowerCase()} performance!
                      </span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                <p className="text-sm text-slate-600 dark:text-slate-400 text-center">
                  {accuracy === 100 
                    ? "Perfect score! You've mastered this topic completely! 🌟"
                    : accuracy >= 90 
                    ? "Excellent performance! You're well on your way to mastery! 🚀"
                    : accuracy >= 75
                    ? "Good work! Keep practicing to improve even further! 💪"
                    : "Every attempt is a step forward. Keep learning and growing! 🌱"
                  }
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className={`flex flex-col sm:flex-row gap-4 justify-center transition-all duration-1000 delay-700 ${
          showStats ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <Button 
            onClick={onRestart} 
            variant="outline" 
            size="lg"
            className="px-8 py-3 border-2 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-200 group"
          >
            <RotateCcw className="w-4 h-4 mr-2 group-hover:rotate-180 transition-transform duration-300" />
            Try Again
          </Button>
          
          <Button 
            asChild 
            size="lg"
            className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
          >
            <a href="/learn">
              <BookOpen className="w-4 h-4 mr-2" />
              Continue Learning
            </a>
          </Button>
          
          <Button 
            asChild 
            variant="outline" 
            size="lg"
            className="px-8 py-3 border-2 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-200"
          >
            <a href="/">
              <Home className="w-4 h-4 mr-2" />
              Dashboard
            </a>
          </Button>
        </div>

        {/* Motivational Quote */}
        <div className={`text-center transition-all duration-1000 delay-1000 ${
          showStats ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <blockquote className="text-lg italic text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            "The beautiful thing about learning is that no one can take it away from you."
          </blockquote>
          <cite className="text-sm text-slate-500 dark:text-slate-500 mt-2 block">
            — B.B. King
          </cite>
        </div>
      </div>
    </div>
  )
}
