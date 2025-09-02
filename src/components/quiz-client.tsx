'use client'

import { useState } from 'react'
import type { Question } from '@/lib/quiz-data'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { CheckCircle2, XCircle, Lightbulb } from 'lucide-react'
import { cn } from '@/lib/utils'

import { useStatsStore } from '@/lib/stats-store'

interface QuizClientProps {
  questions: Question[]
}

export function QuizClient({ questions }: QuizClientProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [isQuizComplete, setIsQuizComplete] = useState(false)

  const { addXp, completeLesson, completeLessonOnBackend } = useStatsStore()
  const { data: session } = useSession()

  if (questions.length === 0) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Coming Soon!</CardTitle>
            </CardHeader>
            <CardContent>
                <p>This lesson is being prepared. Please check back later.</p>
            </CardContent>
        </Card>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]
  const isCorrect = selectedAnswer !== null && currentQuestion.answers.find(a => a.text === selectedAnswer)?.correct

  const handleCheckAnswer = () => {
    if (selectedAnswer === null) return
    setShowFeedback(true)
    if (isCorrect) {
      setCorrectAnswers(prev => prev + 1)
    }
  }

  const handleNextQuestion = () => {
    const isLastQuestion = currentQuestionIndex >= questions.length - 1;

    if (isLastQuestion) {
      const accuracy = (correctAnswers / questions.length) * 100
      let bonusXp = 0
      if (accuracy === 100) bonusXp = 25
      else if (accuracy >= 90) bonusXp = 15
      else if (accuracy >= 75) bonusXp = 5
      
      const totalXp = 50 + bonusXp;
      addXp(totalXp);
      
      // Mark lesson as completed and sync to backend
      completeLesson();
      
      if (session?.backendToken) {
        completeLessonOnBackend('quiz-completion', totalXp, session.backendToken).catch((error: any) => {
          console.error('Failed to complete lesson on backend:', error);
        });
      }
      
      setIsQuizComplete(true)
    } else {
      setCurrentQuestionIndex(prev => prev + 1)
      setSelectedAnswer(null)
      setShowFeedback(false)
    }
  }

  const handleRestartQuiz = () => {
    setCurrentQuestionIndex(0)
    setSelectedAnswer(null)
    setShowFeedback(false)
    setCorrectAnswers(0)
    setIsQuizComplete(false)
  }

  const progress = ((currentQuestionIndex + 1) / questions.length) * 100

  if (isQuizComplete) {
    const finalScore = (correctAnswers / questions.length) * 100
    return (
      <Card>
        <CardHeader>
          <CardTitle>Quiz Complete!</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-lg">You scored {correctAnswers} out of {questions.length}!</p>
          <p className="text-2xl font-bold mt-2">{finalScore.toFixed(0)}%</p>
          <Progress value={finalScore} className="mt-4" />
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button onClick={handleRestartQuiz} className="w-full">
            Try Again
          </Button>
           <Button variant="outline" asChild className="w-full">
            <a href="/learn">Back to Lessons</a>
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
                    {/* Progress Display */}
        <div className="p-6 border-2 border-blue-200 rounded-2xl bg-gradient-to-br from-black to-gray-900 shadow-lg">
                 <div className="flex justify-between items-center mb-3">
           <span className="font-semibold text-lg text-white">🎯 Quiz Progress</span>
           <span className="text-sm text-blue-300 font-medium">
             Question {currentQuestionIndex + 1} of {questions.length}
           </span>
         </div>
         <Progress value={progress} className="mb-3 h-3" />
         <div className="text-sm text-gray-300">
           {Math.round(progress)}% complete - You're doing great! 🚀
         </div>
      </div>
      
                                                                                                               <Card className="border-2 border-blue-200 shadow-lg bg-gradient-to-br from-black to-gray-900">
                 <CardHeader className="pb-4">
           <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
               {currentQuestionIndex + 1}
             </div>
             <CardTitle className="text-xl text-white">Question {currentQuestionIndex + 1}</CardTitle>
           </div>
         </CardHeader>
         <CardContent className="space-y-6">
           <p className="text-lg font-semibold text-white leading-relaxed">{currentQuestion.questionText}</p>
          <RadioGroup
            value={selectedAnswer ?? undefined}
            onValueChange={setSelectedAnswer}
            disabled={showFeedback}
            className="space-y-3"
          >
            {currentQuestion.answers.map((answer, index) => (
                                            <label 
                 key={index} 
                 className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
                   selectedAnswer === answer.text 
                     ? 'border-blue-400 bg-blue-900/30 shadow-md' 
                     : 'border-gray-600 bg-black hover:border-blue-400 hover:bg-gray-900'
                 } ${showFeedback ? 'pointer-events-none' : ''}`}
               >
                 <RadioGroupItem value={answer.text} id={`r${index}`} className="w-5 h-5" />
                 <Label htmlFor={`r${index}`} className="text-gray-200 font-medium cursor-pointer">{answer.text}</Label>
               </label>
            ))}
          </RadioGroup>
        </CardContent>
        <CardFooter className="pt-4">
          {showFeedback ? (
            <Button 
              onClick={handleNextQuestion} 
              className="w-full py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              {currentQuestionIndex < questions.length - 1 ? 'Continue →' : '🎉 Finish Quiz'}
            </Button>
          ) : (
            <Button 
              onClick={handleCheckAnswer} 
              disabled={!selectedAnswer} 
              className={`w-full py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 ${
                !selectedAnswer
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg hover:shadow-xl'
              }`}
            >
              {!selectedAnswer ? 'Choose an answer first' : 'Check My Answer ✨'}
            </Button>
          )}
        </CardFooter>
      </Card>

             {showFeedback && (
         <div className={`p-6 rounded-2xl border-2 transition-all duration-300 ${
           isCorrect 
             ? 'border-green-400 bg-green-900/30 text-green-200' 
             : 'border-red-400 bg-red-900/30 text-red-200'
         }`}>
          <div className="flex items-start gap-4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
              isCorrect ? 'bg-green-500' : 'bg-red-500'
            }`}>
              {isCorrect ? 
                <CheckCircle2 className="h-5 w-5 text-white" /> : 
                <XCircle className="h-5 w-5 text-white" />
              }
            </div>
                         <div className="flex-1">
               <h3 className="font-bold text-lg mb-2">
                 {isCorrect ? '🎉 Excellent! You got it right!' : '💪 Not quite right, but that\'s okay!'}
               </h3>
               <div className="flex items-start gap-3">
                 <Lightbulb className="h-5 w-5 flex-shrink-0 mt-1 text-yellow-400" />
                 <p className="text-base leading-relaxed">
                   {isCorrect 
                     ? (currentQuestion.explanation || 'Great job! Keep up the fantastic work!').replace(/^Correct!\s*/, '') 
                     : `The correct answer is: ${currentQuestion.answers.find(a => a.correct)?.text}. ${(currentQuestion.explanation || 'Keep learning and you\'ll get it next time!').replace(/^Correct!\s*/, '')}`
                   }
                 </p>
               </div>
             </div>
          </div>
        </div>
      )}
    </div>
  )
}
