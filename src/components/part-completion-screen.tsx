'use client'

import { useState, useEffect } from 'react'
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
  Heart,
  CheckCircle2,
  ArrowRight,
  Play
} from 'lucide-react'

interface PartCompletionScreenProps {
  partNumber: number
  partTitle: string
  correctAnswers: number
  totalQuestions: number
  accuracy: number
  xpEarned: number
  performanceLevel: string
  performanceColor: string
  performanceIcon: string
  performanceMessage: string
  overallProgress: number
  completedQuestions: number
  totalLessonQuestions: number
  parts: any[]
  currentPart: number
  answers: {[key: string]: number}
  checkedQuestions: Set<string>
  onContinue: () => void
  onCompleteLesson: () => void
  isLastPart: boolean
}

export function PartCompletionScreen({
  partNumber,
  partTitle,
  correctAnswers,
  totalQuestions,
  accuracy,
  xpEarned,
  performanceLevel,
  performanceColor,
  performanceIcon,
  performanceMessage,
  overallProgress,
  completedQuestions,
  totalLessonQuestions,
  parts,
  currentPart,
  answers,
  checkedQuestions,
  onContinue,
  onCompleteLesson,
  isLastPart
}: PartCompletionScreenProps) {
  const [showAnimation, setShowAnimation] = useState(false)
  const [showStats, setShowStats] = useState(false)
  const [showProgress, setShowProgress] = useState(false)

  useEffect(() => {
    // Trigger animations
    const timer1 = setTimeout(() => setShowAnimation(true), 300)
    const timer2 = setTimeout(() => setShowStats(true), 800)
    const timer3 = setTimeout(() => setShowProgress(true), 1200)
    
    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
    }
  }, [])

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
              {performanceIcon}
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
              Part {partNumber} Complete!
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              {partTitle}
            </p>
            <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
              {performanceMessage}
            </p>
          </div>

          {/* Performance Badge */}
          <div className="flex justify-center">
            <Badge 
              variant="secondary" 
              className={`px-8 py-4 text-lg font-semibold bg-gradient-to-r ${performanceColor} text-white border-0 shadow-lg`}
            >
              <Trophy className="w-5 h-5 mr-2" />
              {performanceLevel} Performance
            </Badge>
          </div>
        </div>

        {/* Stats Grid */}
        <div className={`grid gap-6 md:grid-cols-2 lg:grid-cols-4 transition-all duration-1000 delay-300 ${
          showStats ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          
          {/* Part Score Card */}
          <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2">
                {accuracy.toFixed(0)}%
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                Part Score
              </p>
              <Progress value={accuracy} className="h-2" />
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
                +{xpEarned}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                XP Earned
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-500">
                For completing this part
              </p>
            </CardContent>
          </Card>

          {/* Overall Progress Card */}
          <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2">
                {Math.round(overallProgress)}%
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                Overall Progress
              </p>
              <Progress value={overallProgress} className="h-2" />
                             <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
                 {completedQuestions} of {totalLessonQuestions} questions
               </p>
            </CardContent>
          </Card>

          {/* Parts Completed Card */}
          <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <CheckCircle2 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2">
                {partNumber}/{parts.length}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Parts Completed
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
                    <span>Part Accuracy</span>
                    <span className="font-semibold">{accuracy.toFixed(1)}%</span>
                  </div>
                  <Progress value={accuracy} className="h-2" />
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
                    {xpEarned}
                  </div>
                  <div className="text-sm text-blue-700 dark:text-blue-300">
                    XP Earned
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
                        Perfect Score! You've mastered this part completely.
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
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lesson Progress Overview */}
        <div className={`transition-all duration-1000 delay-700 ${
          showProgress ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <Card className="border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <BookOpen className="w-5 h-5 text-blue-500" />
                Lesson Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {parts.map((part: any, partIdx: number) => {
                const partQuestions = part.questions.length;
                let partCompleted = 0;
                for (let i = 0; i < partQuestions; i++) {
                  const answerKey = `part${partIdx}-q${i}`;
                  if (answers[answerKey] !== undefined && checkedQuestions.has(answerKey)) partCompleted++;
                }
                const partProgress = (partCompleted / partQuestions) * 100;
                const isCurrentPart = partIdx === currentPart;
                const isCompleted = partIdx < currentPart || (partIdx === currentPart && partProgress === 100);
                
                return (
                  <div key={partIdx} className={`p-4 rounded-xl transition-all duration-300 ${
                    isCompleted 
                      ? 'bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20 border border-green-200 dark:border-green-800' 
                      : isCurrentPart
                      ? 'bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 border border-blue-200 dark:border-blue-800'
                      : 'bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-700/50 border border-slate-200 dark:border-slate-700'
                  }`}>
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-semibold text-lg text-slate-800 dark:text-slate-200">{part.title}</span>
                      <div className="flex items-center gap-2">
                        {isCompleted && <CheckCircle2 className="w-5 h-5 text-green-600" />}
                        {isCurrentPart && !isCompleted && <ArrowRight className="w-5 h-5 text-blue-600" />}
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          {partCompleted}/{partQuestions} completed
                        </span>
                      </div>
                    </div>
                    <Progress value={partProgress} className="h-3" />
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className={`flex flex-col sm:flex-row gap-4 justify-center transition-all duration-1000 delay-1000 ${
          showProgress ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
                     {!isLastPart ? (
             <Button 
               onClick={onContinue}
               size="lg"
               className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
             >
               <Play className="w-4 h-4 mr-2" />
               Continue to Part {partNumber + 1}
             </Button>
          ) : (
            <Button 
              onClick={onCompleteLesson}
              size="lg"
              className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              <Trophy className="w-4 h-4 mr-2" />
              Complete Lesson
            </Button>
          )}
          
          <Button 
            asChild 
            variant="outline" 
            size="lg"
            className="px-8 py-3 border-2 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-200"
          >
            <a href="/learn">
              <BookOpen className="w-4 h-4 mr-2" />
              More Lessons
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


      </div>
    </div>
  )
}
