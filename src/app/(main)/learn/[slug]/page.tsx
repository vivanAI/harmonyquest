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
  const [completedParts, setCompletedParts] = useState<Set<number>>(new Set());
  const [isClient, setIsClient] = useState(false);

  const { addXp, updateLessonProgress, completeLessonOnBackend, getLessonProgress } = useStatsStore();
  const { data: session } = useSession();

  // Mark when component is mounted on client
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Load saved progress from store when lesson loads (client-side only)
  useEffect(() => {
    // Only run on client side to avoid hydration mismatch
    if (typeof window === 'undefined') return;
    
    if (lesson) {
      const savedProgress = getLessonProgress(lesson.slug);
      console.log('Loading saved progress for lesson:', lesson.slug, 'Progress:', savedProgress);
      
      if (savedProgress > 0) {
        // Calculate which parts are completed based on saved progress
        const hasParts = lesson.content?.parts && Array.isArray(lesson.content.parts);
        const totalParts = hasParts ? lesson.content.parts.length : 1;
        
        if (totalParts > 1) {
          const completedPartsCount = Math.round((savedProgress / 100) * totalParts);
          const newCompletedParts = new Set<number>();
          
          // Mark completed parts
          for (let i = 0; i < completedPartsCount; i++) {
            newCompletedParts.add(i);
          }
          
          setCompletedParts(newCompletedParts);
          console.log('Restored completed parts:', Array.from(newCompletedParts));
          
          // Set current part to the next incomplete part
          const nextPart = Math.min(completedPartsCount, totalParts - 1);
          setCurrentPart(nextPart);
          
          // For now, we'll simulate completed answers for completed parts
          // In a full implementation, you'd want to store/restore actual answers
          const simulatedAnswers: {[key: string]: number} = {};
          for (let partIdx = 0; partIdx < completedPartsCount; partIdx++) {
            const part = lesson.content.parts[partIdx];
            if (part.questions) {
              part.questions.forEach((q: any, questionIdx: number) => {
                const answerKey = `part${partIdx}-q${questionIdx}`;
                // Simulate correct answers for completed parts
                const correctAnswerIndex = q.answers.findIndex((a: any) => a.correct);
                simulatedAnswers[answerKey] = correctAnswerIndex >= 0 ? correctAnswerIndex : 0;
              });
            }
          }
          
          setAnswers(simulatedAnswers);
          console.log('Restored simulated answers for completed parts');
        }
      }
    }
  }, [lesson, getLessonProgress]);

  // Determine which part the user should start with
  useEffect(() => {
    if (lesson && lesson.content?.parts && Array.isArray(lesson.content.parts)) {
      const totalParts = lesson.content.parts.length;
      if (totalParts > 1) {
        // Find the first incomplete part
        let firstIncompletePart = 0;
        for (let i = 0; i < totalParts; i++) {
          if (!completedParts.has(i)) {
            firstIncompletePart = i;
            break;
          }
        }
        // If all parts are completed, start with the last part
        if (firstIncompletePart === 0 && completedParts.size === totalParts) {
          firstIncompletePart = totalParts - 1;
        }
        setCurrentPart(firstIncompletePart);
      }
    }
  }, [lesson, completedParts]);

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

  if (!lesson || !isClient) return <div>Loading...</div>;

  // Handle both old and new data structures
  const hasParts = lesson.content?.parts && Array.isArray(lesson.content.parts);
  const parts = hasParts ? lesson.content.parts : [{ id: 1, title: lesson.title, questions: lesson.content?.questions || [] }];
  const totalParts = parts.length;

  // Calculate overall progress across all parts
  let totalQuestions = 0;
  let completedQuestions = 0;
  
  parts.forEach((part: any, partIdx: number) => {
    part.questions.forEach((q: any, questionIdx: number) => {
      totalQuestions++;
      const answerKey = `part${partIdx}-q${questionIdx}`;
      if (answers[answerKey] !== undefined) {
        completedQuestions++;
      }
    });
  });
  
  // Use the state-based completedParts for more accurate tracking
  const completedPartsCount = completedParts.size;

  const overallProgress = totalQuestions > 0 ? (completedQuestions / totalQuestions) * 100 : 0;
  
  console.log('Progress calculation:', {
    totalQuestions,
    completedQuestions,
    completedParts,
    overallProgress,
    answers: Object.keys(answers),
    lessonSlug: lesson.slug
  });

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
                  console.log('Lesson completed! XP earned:', xpEarned, 'Lesson slug:', lesson.slug);
                  console.log('Answers submitted:', answers);
                  console.log('Total questions:', totalQuestions);
                  console.log('Correct answers:', correctCount);
                  
                  console.log('About to call addXp with:', xpEarned);
                  console.log('About to call updateLessonProgress with:', lesson.slug);
                  updateLessonProgress(lesson.slug, 100); // Mark as fully completed
                  addXp(xpEarned);
                  
                  if (session?.backendToken) {
                    completeLessonOnBackend(lesson.slug, xpEarned, session.backendToken).catch((error: any) => {
                      console.error('Failed to complete lesson on backend:', error);
                    });
                  }
                  
                  // Force a re-render to update progress
                  setTimeout(() => {
                    console.log('Setting lesson completed to true');
                    setLessonCompleted(true);
                  }, 100);
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
      const currentPartData = parts[currentPart];
      const partQuestions = currentPartData.questions;
      let correctCount = 0;
      
      // Count correct answers for this part
      partQuestions.forEach((q: any, questionIdx: number) => {
        const answerKey = `part${currentPart}-q${questionIdx}`;
        const selected = answers[answerKey];
        if (selected !== undefined && q.answers[selected]?.correct) {
          correctCount++;
        }
      });
      
      // Award XP for completing this part
      const partXp = Math.round((correctCount / partQuestions.length) * 50); // 50 XP max per part
      console.log(`Part ${currentPart + 1} completed! XP earned:`, partXp);
      
      // Mark part as completed and award XP
      if (!completedParts.has(currentPart)) {
        setCompletedParts(prev => new Set([...prev, currentPart]));
        
        // Calculate progress percentage for this lesson
        const totalParts = parts.length;
        const completedPartsCount = completedParts.size + 1; // +1 for current part
        const progressPercentage = Math.round((completedPartsCount / totalParts) * 100);
        
        // Update lesson progress
        updateLessonProgress(lesson.slug, progressPercentage);
        addXp(partXp);
      }
      
      // Auto-advance to next part if available
      if (currentPart < totalParts - 1) {
        setCurrentPart(currentPart + 1);
        setCurrentQuestion(0);
        setShowFeedback(false);
      } else {
        // All parts completed, show lesson completion
        setCurrentQuestion(questions.length);
      }
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
          {completedPartsCount} of {totalParts} parts completed
        </div>
      </div>

      {/* Current Part Progress */}
      <div className="mb-4 p-3 border rounded bg-card">
        <div className="text-sm text-muted-foreground mb-2">
          Part {currentPart + 1} of {totalParts}: {currentPartData.title}
          {completedParts.has(currentPart) && (
            <span className="ml-2 text-green-600 font-semibold">✓ Completed</span>
          )}
        </div>
        
        {/* Part Status Overview */}
        <div className="flex gap-2 mb-3">
          {Array.from({ length: totalParts }, (_, i) => (
            <div
              key={i}
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                completedParts.has(i)
                  ? 'bg-green-500 text-white'
                  : i === currentPart
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-300 text-gray-600'
              }`}
              title={`Part ${i + 1}: ${completedParts.has(i) ? 'Completed' : i === currentPart ? 'Current' : 'Locked'}`}
            >
              {completedParts.has(i) ? '✓' : i + 1}
            </div>
          ))}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-green-600 h-2 rounded-full transition-all duration-300" 
               style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}></div>
        </div>
        <div className="text-xs text-muted-foreground mt-1">
          Question {currentQuestion + 1} of {questions.length}
        </div>
        
        {/* Progress Message */}
        {currentPart < totalParts - 1 && (
          <div className="text-xs text-blue-600 mt-2">
            Complete this part to unlock Part {currentPart + 2}
          </div>
        )}
      </div>

      {/* Question */}
      <div className="p-6 border-2 border-blue-200 rounded-2xl bg-gradient-to-br from-black to-gray-900 shadow-lg mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
            {currentQuestion + 1}
          </div>
          <h3 className="text-lg font-semibold text-white">{q.questionText}</h3>
        </div>
        
        <div className="space-y-3">
          {q.answers.map((a: any, i: number) => (
            <label 
              key={i} 
              className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
                selected === i 
                  ? 'border-blue-400 bg-blue-900/30 shadow-md' 
                  : 'border-gray-600 bg-black hover:border-blue-400 hover:bg-gray-900'
              } ${showFeedback ? 'pointer-events-none' : ''}`}
            >
              <input
                type="radio"
                name={`q${currentAnswerKey}`}
                checked={selected === i}
                onChange={() => handleSelect(i)}
                className="w-5 h-5 text-blue-600 border-2 border-gray-300 focus:ring-blue-500"
                disabled={showFeedback}
              />
                              <span className="text-gray-200 font-medium">{a.text}</span>
            </label>
          ))}
        </div>
        {showFeedback && selected !== undefined && (
          <div className={`mt-4 p-4 rounded-xl border-2 transition-all duration-300 ${
            isCorrect 
              ? 'border-green-400 bg-green-900/30 text-green-200' 
              : 'border-red-400 bg-red-900/30 text-red-200'
          }`}>
            <div className="flex items-center gap-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                isCorrect ? 'bg-green-500' : 'bg-red-500'
              }`}>
                <span className="text-white text-sm font-bold">
                  {isCorrect ? '✓' : '✗'}
                </span>
              </div>
              <div>
                <div className="font-semibold mb-1">
                  {isCorrect ? "Excellent! You got it right!" : "Not quite right, but that's okay!"}
                </div>
                <div className="text-sm opacity-90">
                  {isCorrect 
                    ? (q.explanation || 'Great job! Keep up the fantastic work!').replace(/^Correct!\s*/, '') 
                    : `The correct answer is: ${q.answers.find((a: any) => a.correct)?.text}. ${(q.explanation || 'Keep learning and you\'ll get it next time!').replace(/^Correct!\s*/, '')}`
                  }
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-3">
        {!showFeedback && (
          <button
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 ${
              selected === undefined
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg hover:shadow-xl'
            }`}
            onClick={handleCheck}
            disabled={selected === undefined}
          >
            {selected === undefined ? 'Choose an answer first' : 'Check My Answer ✨'}
          </button>
        )}
        {showFeedback && (
          <button
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            onClick={handleNext}
          >
            {currentQuestion === questions.length - 1 ? "🎉 Complete Part" : "Continue →"}
          </button>
        )}
      </div>
    </div>
  );
}
