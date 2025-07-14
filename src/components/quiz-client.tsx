'use client'

import { useState } from 'react'
import type { Question } from '@/lib/quiz-data'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { CheckCircle2, XCircle, Lightbulb } from 'lucide-react'
import { cn } from '@/lib/utils'

interface QuizClientProps {
  questions: Question[]
}

export function QuizClient({ questions }: QuizClientProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [isQuizComplete, setIsQuizComplete] = useState(false)

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
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
      setSelectedAnswer(null)
      setShowFeedback(false)
    } else {
      setIsQuizComplete(true)
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
    return (
      <Card>
        <CardHeader>
          <CardTitle>Quiz Complete!</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-lg">You scored {correctAnswers} out of {questions.length}!</p>
          <Progress value={(correctAnswers / questions.length) * 100} className="mt-4" />
        </CardContent>
        <CardFooter>
          <Button onClick={handleRestartQuiz} className="w-full">
            Try Again
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Progress value={progress} />
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
            {isCorrect ? 'Correct!' : 'Not quite!'}
          </AlertTitle>
          <AlertDescription>
            <div className="flex items-start gap-2 mt-2">
              <Lightbulb className="h-4 w-4 flex-shrink-0 mt-1" />
              <p>{currentQuestion.explanation}</p>
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
