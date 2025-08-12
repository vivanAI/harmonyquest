"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useStatsStore } from "@/lib/stats-store";
import { useSession } from "next-auth/react";
import { getBackendBase } from "@/lib/utils"

export default function LessonDetailPage() {
  const { slug } = useParams();
  const [lesson, setLesson] = useState<any>(null);
  const [currentPart, setCurrentPart] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{[key: string]: number}>({}); // part-question -> answer index
  const [showResults, setShowResults] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [lessonCompleted, setLessonCompleted] = useState(false);
  const { addXp, completeLesson, completeLessonOnBackend } = useStatsStore();
  const { data: session } = useSession();

  useEffect(() => {
    const BASE = getBackendBase()
    fetch(`${BASE}/lessons/slug/${slug}`)
      .then(res => {
        console.log('GET lesson by slug status', res.status)
        return res.json()
      })
      .then(data => {
        console.log('GET lesson by slug payload', data)
        setLesson(data);
      })
      .catch(error => {
        console.error('Error fetching lesson:', error);
        fetch(`${BASE}/lessons`)
          .then(res => res.json())
          .then(data => {
            const found = data.find((l: any) => l.slug === slug);
            setLesson(found);
          });
      });
  }, [slug]);

  if (!lesson) return <div>Loading...</div>;

  // Handle both old and new data structures
  const hasParts = lesson.content?.parts && Array.isArray(lesson.content.parts);
  const parts = hasParts ? lesson.content.parts : [{ id: 1, title: lesson.title, questions: lesson.content?.questions || [] }];
  const totalParts = parts.length;

  // Calculate overall progress across all parts
  let totalQuestions = 0;
  let completedQuestions = 0;
  let completedParts = 0;
  
  parts.forEach((part: any, partIdx: number) => {
    part.questions.forEach((q: any, questionIdx: number) => {
      totalQuestions++;
      const answerKey = `part${partIdx}-q${questionIdx}`;
      if (answers[answerKey] !== undefined) {
        completedQuestions++;
      }
    });
    
    // Check if part is completed
    const partQuestions = part.questions.length;
    let partCompleted = true;
    for (let i = 0; i < partQuestions; i++) {
      const answerKey = `part${partIdx}-q${i}`;
      if (answers[answerKey] === undefined) {
        partCompleted = false;
        break;
      }
    }
    if (partCompleted) completedParts++;
  });

  const overallProgress = totalQuestions > 0 ? (completedQuestions / totalQuestions) * 100 : 0;

  // If lesson is completed, show completion screen
  if (lessonCompleted) {
    return (
      <div className="max-w-2xl mx-auto py-8">
        <div className="text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-3xl font-bold mb-4">Congratulations!</h1>
          <p className="text-lg mb-6">You've completed {lesson.title}</p>
          
          {/* Overall Progress */}
          <div className="mb-6 p-4 border rounded bg-card">
            <h3 className="font-semibold mb-2">Overall Progress</h3>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
              <div className="bg-green-600 h-3 rounded-full transition-all duration-500" style={{ width: `${overallProgress}%` }}></div>
            </div>
            <div className="text-sm text-muted-foreground">
              {completedQuestions} of {totalQuestions} questions completed
            </div>
          </div>

          {/* Part-by-part breakdown */}
          <div className="mb-6 space-y-3">
            {parts.map((part: any, partIdx: number) => {
              const partQuestions = part.questions.length;
              let partCompleted = 0;
              for (let i = 0; i < partQuestions; i++) {
                const answerKey = `part${partIdx}-q${i}`;
                if (answers[answerKey] !== undefined) partCompleted++;
              }
              const partProgress = (partCompleted / partQuestions) * 100;
              
              return (
                <div key={partIdx} className="p-3 border rounded bg-card">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">{part.title}</span>
                    <span className="text-sm text-muted-foreground">
                      {partCompleted}/{partQuestions}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className={`h-2 rounded-full transition-all duration-500 ${
                      partProgress === 100 ? 'bg-green-600' : 'bg-blue-600'
                    }`} style={{ width: `${partProgress}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>

          <button 
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            onClick={() => {
              setLessonCompleted(false);
              setCurrentPart(0);
              setCurrentQuestion(0);
              setAnswers({});
              setShowResults(false);
              setShowFeedback(false);
            }}
          >
            Restart Lesson
          </button>
        </div>
      </div>
    );
  }

  // If current part is completed, show part completion screen
  const currentPartData = parts[currentPart];
  const questions = currentPartData?.questions || [];
  const currentAnswerKey = `part${currentPart}-q${currentQuestion}`;
  
  // Check if current part is completed
  let currentPartCompleted = true;
  for (let i = 0; i < questions.length; i++) {
    const answerKey = `part${currentPart}-q${i}`;
    if (answers[answerKey] === undefined) {
      currentPartCompleted = false;
      break;
    }
  }

  if (currentPartCompleted && currentQuestion === questions.length) {
    return (
      <div className="max-w-2xl mx-auto py-8">
        <div className="text-center">
          <div className="text-5xl mb-4">✅</div>
          <h2 className="text-2xl font-bold mb-4">Part {currentPart + 1} Complete!</h2>
          <p className="text-lg mb-6">{currentPartData.title}</p>
          
          {/* Part Progress */}
          <div className="mb-6 p-4 border rounded bg-card">
            <h3 className="font-semibold mb-2">Part Progress</h3>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
              <div className="bg-green-600 h-3 rounded-full" style={{ width: '100%' }}></div>
            </div>
            <div className="text-sm text-muted-foreground">
              {questions.length} of {questions.length} questions completed
            </div>
          </div>

          {/* Overall Progress */}
          <div className="mb-6 p-4 border rounded bg-card">
            <h3 className="font-semibold mb-2">Overall Progress</h3>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
              <div className="bg-blue-600 h-3 rounded-full transition-all duration-500" style={{ width: `${overallProgress}%` }}></div>
            </div>
            <div className="text-sm text-muted-foreground">
              {completedQuestions} of {totalQuestions} questions completed
            </div>
          </div>

          <div className="flex gap-3 justify-center">
            {currentPart < totalParts - 1 ? (
              <button 
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                onClick={() => {
                  setCurrentPart(currentPart + 1);
                  setCurrentQuestion(0);
                }}
              >
                Continue to Part {currentPart + 2}
              </button>
            ) : (
              <button 
                className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                onClick={() => {
                  // Calculate final results and award XP
                  let correctCount = 0;
                  parts.forEach((part: any, partIdx: number) => {
                    part.questions.forEach((q: any, questionIdx: number) => {
                      const answerKey = `part${partIdx}-q${questionIdx}`;
                      const selected = answers[answerKey];
                      if (selected !== undefined && q.answers[selected]?.correct) {
                        correctCount++;
                      }
                    });
                  });
                  
                  const xpEarned = correctCount * 10;
                  addXp(xpEarned);
                  completeLesson(lesson.slug);
                  
                  if (session?.backendToken) {
                    completeLessonOnBackend(lesson.slug, xpEarned, session.backendToken).catch((error: any) => {
                      console.error('Failed to complete lesson on backend:', error);
                    });
                  }
                  
                  setLessonCompleted(true);
                }}
              >
                Complete Lesson
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  const q = questions[currentQuestion];
  const selected = answers[currentAnswerKey];
  const isCorrect = selected !== undefined && q.answers[selected]?.correct;

  const handleSelect = (answerIdx: number) => {
    setAnswers(prev => ({ ...prev, [currentAnswerKey]: answerIdx }));
    setShowFeedback(false);
  };

  const handleCheck = () => {
    setShowFeedback(true);
  };

  const handleNext = () => {
    setShowFeedback(false);
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Part completed
      setCurrentQuestion(questions.length); // This will trigger the part completion screen
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">{lesson.title}</h1>
      
      {/* Overall Progress Bar */}
      <div className="mb-6 p-4 border rounded bg-card">
        <div className="flex justify-between items-center mb-2">
          <span className="font-semibold">Overall Progress</span>
          <span className="text-sm text-muted-foreground">
            {completedQuestions}/{totalQuestions}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
          <div className="bg-blue-600 h-3 rounded-full transition-all duration-500" style={{ width: `${overallProgress}%` }}></div>
        </div>
        <div className="text-xs text-muted-foreground">
          {completedParts} of {totalParts} parts completed
        </div>
      </div>

      {/* Current Part Progress */}
      <div className="mb-4 p-3 border rounded bg-card">
        <div className="text-sm text-muted-foreground mb-2">
          Part {currentPart + 1} of {totalParts}: {currentPartData.title}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-green-600 h-2 rounded-full transition-all duration-300" 
               style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}></div>
        </div>
        <div className="text-xs text-muted-foreground mt-1">
          Question {currentQuestion + 1} of {questions.length}
        </div>
      </div>

      {/* Question */}
      <div className="p-4 border rounded bg-card mb-6">
        <div className="font-semibold mb-2">Q{currentQuestion + 1}: {q.questionText}</div>
        <ul className="list-disc pl-6">
          {q.answers.map((a: any, i: number) => (
            <li key={i} className="mb-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name={`q${currentAnswerKey}`}
                  checked={selected === i}
                  onChange={() => handleSelect(i)}
                  className="accent-blue-500"
                  disabled={showFeedback}
                />
                {a.text}
              </label>
            </li>
          ))}
        </ul>
        {showFeedback && selected !== undefined && (
          <div className="mt-2 text-sm">
            <span className={isCorrect ? "text-green-500 font-bold" : "text-red-500 font-bold"}>
              {isCorrect ? "Correct!" : "Incorrect."}
            </span>
            <span className="block text-muted-foreground mt-1">{q.explanation}</span>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        {!showFeedback && (
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            onClick={handleCheck}
            disabled={selected === undefined}
          >
            Check Answer
          </button>
        )}
        {showFeedback && (
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            onClick={handleNext}
          >
            {currentQuestion === questions.length - 1 ? "Complete Part" : "Next"}
          </button>
        )}
      </div>
    </div>
  );
}
