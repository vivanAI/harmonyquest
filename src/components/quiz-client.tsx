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
      <div className="p-4 border rounded bg-card">
        <div className="flex justify-between items-center mb-2">
          <span className="font-semibold">Quiz Progress</span>
          <span className="text-sm text-muted-foreground">
            {currentQuestionIndex + 1} of {questions.length}
          </span>
        </div>
        <Progress value={progress} className="mb-2" />
        <div className="text-xs text-muted-foreground">
          {Math.round(progress)}% complete
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Question {currentQuestionIndex + 1}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg font-semibold mb-4">{currentQuestion.questionText}</p>
          <RadioGroup
            value={selectedAnswer ?? undefined}
            onValueChange={setSelectedAnswer}
            disabled={showFeedback}
          >
            {currentQuestion.answers.map((answer, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={answer.text} id={`r${index}`} />
                <Label htmlFor={`r${index}`}>{answer.text}</Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
        <CardFooter>
          {showFeedback ? (
            <Button onClick={handleNextQuestion} className="w-full">
              {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
            </Button>
          ) : (
            <Button onClick={handleCheckAnswer} disabled={!selectedAnswer} className="w-full">
              Check Answer
            </Button>
          )}
        </CardFooter>
      </Card>

      {showFeedback && (
        <Alert variant={isCorrect ? 'default' : 'destructive'} className={cn(isCorrect ? 'bg-green-500/10 border-green-500 text-green-700 dark:text-green-400' : 'bg-red-500/10 border-red-500 text-red-700 dark:text-red-400')}>
          {isCorrect ? 
            <CheckCircle2 className="h-4 w-4" color={cn('text-green-500')} /> : 
            <XCircle className="h-4 w-4" color={cn('text-red-500')} />
          }
          <AlertTitle className="font-bold">
            {isCorrect ? 'Correct!' : 'Incorrect'}
          </AlertTitle>
          <AlertDescription>
            <div className="flex items-start gap-2 mt-2">
              <Lightbulb className="h-4 w-4 flex-shrink-0 mt-1" />
              <p>
                {isCorrect 
                  ? (currentQuestion.explanation || 'Great job!').replace(/^Correct!\s*/, '') 
                  : `The correct answer is: ${currentQuestion.answers.find(a => a.correct)?.text}. ${(currentQuestion.explanation || 'Keep learning!').replace(/^Correct!\s*/, '')}`
                }
              </p>
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
