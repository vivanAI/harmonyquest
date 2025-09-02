"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useStatsStore } from "@/lib/stats-store";
import { useSession } from "next-auth/react";
import { getBackendBase } from "@/lib/utils"
import { PartCompletionScreen } from '@/components/part-completion-screen'


export default function LessonDetailPage() {
  const { slug } = useParams();
  const [lesson, setLesson] = useState<any>(null);
  const [currentPart, setCurrentPart] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{[key: string]: number}>({}); // part-question -> answer index
  const [checkedQuestions, setCheckedQuestions] = useState<Set<string>>(new Set()); // part-question -> checked
  const [showResults, setShowResults] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [lessonCompleted, setLessonCompleted] = useState(false);
  const [completedParts, setCompletedParts] = useState<Set<number>>(new Set());
  const [showCompletionScreen, setShowCompletionScreen] = useState(false);
  const [completedPartNumber, setCompletedPartNumber] = useState<number | null>(null);
  const [isClient, setIsClient] = useState(false);

  const { addXp, updateLessonProgress, getLessonProgress } = useStatsStore();
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
          
          // Only set simulated answers if we don't already have real answers
          if (Object.keys(answers).length === 0) {
          setAnswers(simulatedAnswers);
          console.log('Restored simulated answers for completed parts');
          } else {
            console.log('Skipping simulated answers - real answers already exist');
          }
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
      if (answers[answerKey] !== undefined && checkedQuestions.has(answerKey)) {
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
    lessonSlug: lesson.slug,
    answersByPart: {
      part0: Object.keys(answers).filter(k => k.startsWith('part0-')),
      part1: Object.keys(answers).filter(k => k.startsWith('part1-')),
      part2: Object.keys(answers).filter(k => k.startsWith('part2-'))
    }
  });

  // If lesson is completed, show completion screen
  if (lessonCompleted) {
    // Calculate performance metrics
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
    
    const accuracy = (correctCount / totalQuestions) * 100;
    const xpEarned = correctCount * 10;
    
    // Determine performance level
    let performanceLevel = "Good"
    let performanceColor = "from-blue-500 to-cyan-500"
    let performanceIcon = "🎯"
    let performanceMessage = "Well done! You've completed this lesson!"
    
    if (accuracy === 100) {
      performanceLevel = "Perfect"
      performanceColor = "from-yellow-400 to-orange-500"
      performanceIcon = "🏆"
      performanceMessage = "Outstanding! You mastered this lesson!"
    } else if (accuracy >= 90) {
      performanceLevel = "Excellent"
      performanceColor = "from-green-400 to-emerald-500"
      performanceIcon = "⭐"
      performanceMessage = "Excellent work! You really understood the material!"
    } else if (accuracy >= 75) {
      performanceLevel = "Good"
      performanceColor = "from-blue-500 to-cyan-500"
      performanceIcon = "👍"
      performanceMessage = "Good job! You're making great progress!"
    } else {
      performanceLevel = "Keep Learning"
      performanceColor = "from-purple-500 to-pink-500"
      performanceIcon = "💪"
      performanceMessage = "Don't give up! Every attempt makes you stronger!"
    }

    return (
      <div className="max-w-4xl mx-auto py-8 space-y-8">
        {/* Main Completion Card */}
        <div className="relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-primary/10"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-primary/10 to-transparent rounded-full -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-accent/10 to-transparent rounded-full translate-y-24 -translate-x-24"></div>
          
          <div className="relative border-0 shadow-elegant bg-gradient-to-br from-background via-background/95 to-background/90 backdrop-blur-sm rounded-2xl p-8 text-center space-y-6">
            {/* Celebration Icon */}
            <div className="flex justify-center">
              <div className={`w-24 h-24 rounded-full bg-gradient-to-r ${performanceColor} flex items-center justify-center text-4xl shadow-lg animate-pulse`}>
                {performanceIcon}
              </div>
            </div>
            
            {/* Main Title */}
            <div className="space-y-2">
              <h1 className="text-4xl font-bold gradient-text-primary">
                Lesson Complete! 🎉
              </h1>
              <p className="text-xl text-muted-foreground">
                {lesson.title}
              </p>
              <p className="text-lg text-muted-foreground">
                {performanceMessage}
              </p>
            </div>
            
            {/* Performance Badge */}
            <div className="flex justify-center">
              <div className={`px-6 py-3 rounded-full bg-gradient-to-r ${performanceColor} text-white font-semibold text-lg shadow-lg`}>
                {performanceLevel} Performance
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-3">
          {/* Score Card */}
          <div className="border-0 shadow-elegant bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 rounded-2xl p-6 text-center">
            <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-xl font-bold text-white">{accuracy.toFixed(0)}%</span>
            </div>
            <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-300 mb-2">Final Score</h3>
            <p className="text-sm text-blue-600 dark:text-blue-400">
              {correctCount} out of {totalQuestions} correct
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
              <div className="bg-blue-600 h-2 rounded-full transition-all duration-500" style={{ width: `${accuracy}%` }}></div>
            </div>
          </div>

          {/* XP Earned Card */}
          <div className="border-0 shadow-elegant bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950/20 dark:to-yellow-900/20 rounded-2xl p-6 text-center">
            <div className="w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-white">⭐</span>
            </div>
            <h3 className="text-lg font-semibold text-yellow-700 dark:text-yellow-300 mb-2">XP Earned</h3>
            <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">+{xpEarned}</p>
            <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
              Based on your performance
            </p>
          </div>

          {/* Progress Card */}
          <div className="border-0 shadow-elegant bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20 rounded-2xl p-6 text-center">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-white">✓</span>
            </div>
            <h3 className="text-lg font-semibold text-green-700 dark:text-green-300 mb-2">Checkpoint Reached</h3>
            <p className="text-sm text-green-600 dark:text-green-400">
              Lesson completed and saved to your progress
            </p>
            </div>
          </div>

          {/* Part-by-part breakdown */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-center mb-6">Lesson Breakdown</h3>
          <div className="grid gap-4">
            {parts.map((part: any, partIdx: number) => {
              const partQuestions = part.questions.length;
              let partCompleted = 0;
              for (let i = 0; i < partQuestions; i++) {
                const answerKey = `part${partIdx}-q${i}`;
                if (answers[answerKey] !== undefined && checkedQuestions.has(answerKey)) partCompleted++;
              }
              const partProgress = (partCompleted / partQuestions) * 100;
              
              return (
                <div key={partIdx} className="p-4 border-0 shadow-elegant bg-gradient-to-r from-background to-background/50 rounded-xl">
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-semibold text-lg">{part.title}</span>
                    <span className="text-sm text-muted-foreground">
                      {partCompleted}/{partQuestions} completed
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className={`h-3 rounded-full transition-all duration-500 ${
                      partProgress === 100 ? 'bg-green-600' : 'bg-blue-600'
                    }`} style={{ width: `${partProgress}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
          </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={() => {
              setLessonCompleted(false);
              setCurrentPart(0);
              setCurrentQuestion(0);
              setAnswers({});
              setShowResults(false);
              setShowFeedback(false);
            }}
            className="px-8 py-3 border-2 border-primary text-primary rounded-xl hover:bg-primary/10 transition-all duration-200 font-semibold"
          >
            Try Again
          </button>
          <a 
            href="/learn"
            className="px-8 py-3 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 rounded-xl font-semibold text-center"
          >
            Continue Learning
          </a>
          <a 
            href="/"
            className="px-8 py-3 border-2 border-accent text-accent rounded-xl hover:bg-accent/10 transition-all duration-200 font-semibold text-center"
          >
            Back to Dashboard
          </a>
        </div>


      </div>
    );
  }

  // If current part is completed, show part completion screen
  const currentPartData = parts[currentPart];
  const questions = currentPartData?.questions || [];
  const currentAnswerKey = `part${currentPart}-q${currentQuestion}`;
  
  // Check if current part is completed (all questions answered AND checked)
  let currentPartCompleted = true;
  for (let i = 0; i < questions.length; i++) {
    const answerKey = `part${currentPart}-q${i}`;
    if (answers[answerKey] === undefined || !checkedQuestions.has(answerKey)) {
      currentPartCompleted = false;
      break;
    }
  }

  // Fallback: If we have 10 answers and 10 checked questions, consider it completed
  if (!currentPartCompleted && questions.length === 10 && Object.keys(answers).length >= 10 && checkedQuestions.size >= 10) {
    console.log('Using fallback completion logic - all questions answered and checked');
    currentPartCompleted = true;
  }
  
  // Debug: Show what we're checking
  console.log('Completion check details:', {
    currentPart,
    questionsLength: questions.length,
    answerKeys: Array.from({length: questions.length}, (_, i) => `part${currentPart}-q${i}`),
    answers: Object.keys(answers).filter(key => key.startsWith(`part${currentPart}-`)),
    checked: Array.from(checkedQuestions).filter(key => key.startsWith(`part${currentPart}-`)),
    currentPartCompleted,
    allAnswers: Object.keys(answers),
    allChecked: Array.from(checkedQuestions)
  });
  
  console.log('Render - Part completion check:', {
    currentPart,
    questionsLength: questions.length,
    currentPartCompleted,
    answersCount: Object.keys(answers).length,
    checkedQuestionsCount: checkedQuestions.size,
    answers: Object.keys(answers),
    checkedQuestions: Array.from(checkedQuestions),
    completedParts: Array.from(completedParts)
  });



  if (showCompletionScreen && completedPartNumber !== null) {
    console.log('🎉 Rendering completion screen!');
    
    // Use the stored completed part number
    const completedPartData = parts[completedPartNumber]; // Get the actual completed part data
    const completedPartQuestions = completedPartData?.questions || []; // Use questions from the completed part
    
    console.log('🔍 Part data check:', {
      completedPartNumber,
      partsLength: parts.length,
      completedPartData,
      hasCompletedPartData: !!completedPartData,
      completedPartQuestionsLength: completedPartQuestions.length
    });
    
    // Safety check - if completedPartData is undefined, fall back to currentPartData
    if (!completedPartData) {
      console.error('❌ completedPartData is undefined! Falling back to currentPartData');
      return (
        <div className="max-w-4xl mx-auto py-8">
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto">
              <span className="text-3xl">❌</span>
            </div>
            <h1 className="text-3xl font-bold text-red-600">
              Error: Part data not found
            </h1>
            <p className="text-lg text-muted-foreground">
              Unable to load completion data for part {completedPartNumber + 1}
            </p>
            <button
              onClick={() => {
                setCurrentPart(currentPart - 1);
                setCurrentQuestion(0);
                setShowFeedback(false);
              }}
              className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              Go Back to Part {completedPartNumber + 1}
            </button>
          </div>
        </div>
      );
    }
    
    // Calculate part performance for the completed part
    let partCorrectCount = 0;
    console.log('🔍 Calculating completion stats for completed part:', completedPartNumber);
    console.log('🔍 Available answers:', Object.keys(answers));
    console.log('🔍 Questions to check (from completed part):', completedPartQuestions.length);
    
    completedPartQuestions.forEach((q: any, questionIdx: number) => {
      const answerKey = `part${completedPartNumber}-q${questionIdx}`;
      const selected = answers[answerKey];
      const selectedAnswer = selected !== undefined ? q.answers[selected] : null;
      console.log(`🔍 Question ${questionIdx}:`, {
        answerKey,
        selected,
        hasAnswer: answerKey in answers,
        correct: selectedAnswer?.correct,
        selectedText: selectedAnswer?.text,
        questionText: q.question
      });
      if (selected !== undefined && q.answers[selected]?.correct) {
        partCorrectCount++;
      }
    });
    
    console.log('🔍 Final calculation:', { partCorrectCount, totalQuestions: completedPartQuestions.length, completedPartNumber });
    
    const partAccuracy = (partCorrectCount / completedPartQuestions.length) * 100;
    const partXp = Math.round((partCorrectCount / completedPartQuestions.length) * 50); // 50 XP max per part
    
    console.log('Completion screen data:', { partCorrectCount, partAccuracy, partXp });
    
    // Determine performance level for this part
    let performanceLevel = "Good"
    let performanceColor = "from-blue-500 to-cyan-500"
    let performanceIcon = "🎯"
    let performanceMessage = "Well done! You completed this part!"
    
    if (partAccuracy === 100) {
      performanceLevel = "Perfect"
      performanceColor = "from-yellow-400 to-orange-500"
      performanceIcon = "🏆"
      performanceMessage = "Outstanding! You aced this part!"
    } else if (partAccuracy >= 90) {
      performanceLevel = "Excellent"
      performanceColor = "from-green-400 to-emerald-500"
      performanceIcon = "⭐"
      performanceMessage = "Excellent work! You really understood this part!"
    } else if (partAccuracy >= 75) {
      performanceLevel = "Good"
      performanceColor = "from-blue-500 to-cyan-500"
      performanceIcon = "👍"
      performanceMessage = "Good job! You're making great progress!"
    } else {
      performanceLevel = "Keep Learning"
      performanceColor = "from-purple-500 to-pink-500"
      performanceIcon = "💪"
      performanceMessage = "Don't give up! Every attempt makes you stronger!"
    }

    return <PartCompletionScreen 
      partNumber={completedPartNumber + 1}
      partTitle={completedPartData.title}
      correctAnswers={partCorrectCount}
      totalQuestions={completedPartQuestions.length}
      accuracy={partAccuracy}
      xpEarned={partXp}
      performanceLevel={performanceLevel}
      performanceColor={performanceColor}
      performanceIcon={performanceIcon}
      performanceMessage={performanceMessage}
      overallProgress={overallProgress}
      completedQuestions={completedQuestions}
      totalLessonQuestions={totalQuestions}
      parts={parts}
      currentPart={currentPart}
      answers={answers}
      checkedQuestions={checkedQuestions}
      onContinue={() => {
        console.log('Moving to next part:', currentPart + 1);
        setCurrentPart(currentPart + 1);
        setCurrentQuestion(0);
        setShowFeedback(false);
        setShowCompletionScreen(false);
        setCompletedPartNumber(null);
      }}
      onCompleteLesson={() => {
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
        
        // Debug: Check XP after adding
        setTimeout(() => {
          const currentXp = useStatsStore.getState().xp;
          console.log('XP after lesson completion:', currentXp);
        }, 100);
        
        console.log('Final lesson completion - Session data:', { 
          hasBackendToken: !!session?.backendToken, 
          hasBackendUser: !!session?.backendUser,
          backendUserId: session?.backendUser?.id,
          tokenPreview: session?.backendToken ? session.backendToken.substring(0, 20) + '...' : 'none'
        });
        
        // Don't sync to backend - keep XP temporary like before
        
        // Force a re-render to update progress
        setTimeout(() => {
          console.log('Setting lesson completed to true');
          setLessonCompleted(true);
          setShowCompletionScreen(false);
          setCompletedPartNumber(null);
        }, 100);
      }}
      isLastPart={currentPart >= totalParts - 1}
    />;
  }

  const q = questions[currentQuestion];
  const selected = answers[currentAnswerKey];
  const isCorrect = selected !== undefined && q.answers[selected]?.correct;

  const handleSelect = (answerIdx: number) => {
    console.log('Answer selected:', { currentAnswerKey, answerIdx, currentPart, currentQuestion });
    setAnswers(prev => {
      const newAnswers = { ...prev, [currentAnswerKey]: answerIdx };
      console.log('Answers updated:', { 
        previousAnswers: Object.keys(prev), 
        newAnswers: Object.keys(newAnswers),
        totalAnswers: Object.keys(newAnswers).length
      });
      return newAnswers;
    });
    setShowFeedback(false);
  };

  const handleCheck = () => {
    console.log('Check button clicked - current question:', currentQuestion, 'total questions:', questions.length);
    console.log('Current answer key:', currentAnswerKey);
    setShowFeedback(true);
    // Mark this question as checked
    setCheckedQuestions(prev => new Set([...prev, currentAnswerKey]));
    
    // Check if this completes the current part
    const newCheckedQuestions = new Set([...checkedQuestions, currentAnswerKey]);
    const allQuestionsChecked = questions.every((_, questionIdx) => {
      const answerKey = `part${currentPart}-q${questionIdx}`;
      return newCheckedQuestions.has(answerKey);
    });
    
    console.log('Completion check:', { 
      allQuestionsChecked, 
      isLastQuestion: currentQuestion === questions.length - 1,
      newCheckedQuestionsSize: newCheckedQuestions.size,
      questionsLength: questions.length,
      answerKeys: Array.from({length: questions.length}, (_, i) => `part${currentPart}-q${i}`),
      newCheckedQuestions: Array.from(newCheckedQuestions)
    });
    
    if (allQuestionsChecked && currentQuestion === questions.length - 1) {
      console.log('🎯 All questions checked - completing part!');
      handlePartCompletion();
    }
  };

  const handlePartCompletion = () => {
    console.log('🎯 Part completion triggered!');
    
    if (completedParts.has(currentPart)) {
      console.log('Part already completed, skipping');
      return; // Already completed
    }
    
    // Calculate part performance
    let partCorrectCount = 0;
    questions.forEach((q: any, questionIdx: number) => {
        const answerKey = `part${currentPart}-q${questionIdx}`;
        const selected = answers[answerKey];
        if (selected !== undefined && q.answers[selected]?.correct) {
        partCorrectCount++;
        }
      });
      
    const partXp = Math.round((partCorrectCount / questions.length) * 50); // 50 XP max per part
    console.log(`Calculated XP: ${partXp} (${partCorrectCount}/${questions.length} correct)`);
      
    // Mark part as completed
        setCompletedParts(prev => new Set([...prev, currentPart]));
        
        // Calculate progress percentage for this lesson
        const totalParts = parts.length;
        const completedPartsCount = completedParts.size + 1; // +1 for current part
        const progressPercentage = Math.round((completedPartsCount / totalParts) * 100);
        
        // Update lesson progress
        updateLessonProgress(lesson.slug, progressPercentage);
    
    // Add XP to store (temporary - resets on refresh)
    console.log(`Adding ${partXp} XP to store...`);
        addXp(partXp);
    console.log('XP added successfully!');
    
    // Show completion screen
    setCompletedPartNumber(currentPart);
    setShowCompletionScreen(true);
  };

  const handleNext = () => {
    console.log(`Next clicked - Question ${currentQuestion + 1}/${questions.length}`);
        setShowFeedback(false);
    
    if (currentQuestion < questions.length - 1) {
      console.log('Moving to next question');
      setCurrentQuestion(currentQuestion + 1);
      } else {
      console.log('🎯 Last question reached - completing part');
      // Last question reached - complete the part
      handlePartCompletion();
    }
  };



  return (
    <div className="max-w-2xl mx-auto py-8">
        <h1 className="text-3xl font-bold mb-4">{lesson.title}</h1>
        

        

        

      
      {/* Overall Progress Bar */}
      <div className="mb-8 p-6 bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-800/50 dark:to-blue-900/20 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">Overall Progress</h2>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full animate-pulse"></div>
            <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">{Math.round(overallProgress)}%</span>
          </div>
        </div>
        <div className="relative mb-3">
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-4 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-4 rounded-full transition-all duration-700 ease-out shadow-lg" style={{ width: `${overallProgress}%` }}></div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full opacity-20 blur-sm" style={{width: `${overallProgress}%`}}></div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-600 dark:text-slate-400">{completedQuestions}/{totalQuestions} questions</span>
          <span className="text-sm font-medium text-slate-600 dark:text-slate-400">{completedPartsCount} of {totalParts} parts</span>
        </div>
      </div>

      {/* Current Part Progress */}
      <div className="mb-6 p-5 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl border border-indigo-200 dark:border-indigo-700 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-sm">
              {currentPart + 1}
            </div>
            <div>
              <h3 className="font-bold text-slate-800 dark:text-slate-200">Part {currentPart + 1} of {totalParts}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">{currentPartData.title}</p>
            </div>
          </div>
          {completedParts.has(currentPart) && (
            <div className="flex items-center gap-2 px-3 py-1 bg-green-100 dark:bg-green-900/30 rounded-full">
              <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-green-700 dark:text-green-400 font-semibold text-sm">Completed</span>
            </div>
          )}
        </div>
        
        {/* Part Status Overview */}
        <div className="flex gap-2 -mt-4 mb-2">
          {Array.from({ length: totalParts }, (_, i) => (
            <div
              key={i}
              className={`relative w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                completedParts.has(i)
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg'
                  : i === currentPart
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
              }`}
              title={`Part ${i + 1}: ${completedParts.has(i) ? 'Completed' : i === currentPart ? 'Current' : 'Locked'}`}
            >
              {completedParts.has(i) ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                i + 1
              )}
              {i === currentPart && !completedParts.has(i) && (
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-xl blur opacity-30"></div>
              )}
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
      <div className="relative p-8 border-2 border-blue-200 rounded-3xl bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20 shadow-xl mb-8 overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-200/30 to-purple-200/30 dark:from-blue-600/20 dark:to-purple-600/20 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-indigo-200/30 to-blue-200/30 dark:from-indigo-600/20 dark:to-blue-600/20 rounded-full translate-y-12 -translate-x-12"></div>
        
        <div className="relative flex items-center gap-4 mb-6">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-2xl flex items-center justify-center text-lg font-bold shadow-lg transform hover:scale-105 transition-transform duration-200">
              {currentQuestion + 1}
            </div>
            <div className="absolute -inset-1 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl blur opacity-30"></div>
          </div>
          <h3 className="text-xl font-bold text-blue-900 dark:text-blue-100 leading-relaxed">{q.questionText}</h3>
        </div>
        
        <div className="relative space-y-4">
          {q.answers.map((a: any, i: number) => (
            <label 
              key={i} 
              className={`group relative flex items-center p-5 rounded-2xl cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02] ${
                selected === i 
                  ? 'bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-800/50 dark:to-indigo-800/50 shadow-lg scale-[1.02] border-2 border-blue-300 dark:border-blue-600' 
                  : 'bg-white/80 dark:bg-slate-800/50 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 dark:hover:from-blue-900/30 dark:hover:to-indigo-900/30 border-2 border-transparent hover:border-blue-200 dark:hover:border-blue-700'
              } ${showFeedback ? 'pointer-events-none' : ''}`}
            >
              <input
                type="radio"
                name={`q${currentAnswerKey}`}
                checked={selected === i}
                onChange={() => handleSelect(i)}
                className="sr-only"
                disabled={showFeedback}
              />
              <div className="flex items-center gap-4 w-full">
                <div className={`w-6 h-6 rounded-full border-2 transition-all duration-300 ${
                  selected === i 
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 border-blue-500 shadow-lg' 
                    : 'border-slate-300 dark:border-slate-600 group-hover:border-blue-400'
                }`}>
                  {selected === i && (
                    <div className="w-full h-full rounded-full bg-white scale-50 flex items-center justify-center">
                      <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"></div>
                    </div>
                  )}
                </div>
                <span className="text-slate-800 dark:text-slate-200 font-medium text-lg leading-relaxed">{a.text}</span>
              </div>
            </label>
          ))}
        </div>
        {showFeedback && selected !== undefined && (
          <div className={`mt-4 p-4 rounded-xl border-2 transition-all duration-500 ease-out transform animate-bounce ${
            isCorrect 
              ? 'border-green-400 bg-green-900/30 text-green-200' 
              : 'border-red-400 bg-red-900/30 text-red-200'
          }`} style={{
            animation: 'slideInUp 0.6s ease-out'
          }}>
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
