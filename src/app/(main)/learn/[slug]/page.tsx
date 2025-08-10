"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useStatsStore } from "@/lib/stats-store";
import { useSession } from "next-auth/react";

export default function LessonDetailPage() {
  const { slug } = useParams();
  const [lesson, setLesson] = useState<any>(null);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]); // index of selected answer per question
  const [showResults, setShowResults] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const { addXp, completeLesson, completeLessonOnBackend } = useStatsStore();
  const { data: session } = useSession();

  useEffect(() => {
    fetch("http://localhost:8000/lessons")
      .then(res => res.json())
      .then(data => {
        const found = data.find((l: any) => l.slug === slug);
        setLesson(found);
      });
  }, [slug]);

  if (!lesson) return <div>Loading...</div>;
  const questions = lesson.content?.questions || [];

  const handleSelect = (answerIdx: number) => {
    const newAnswers = [...answers];
    newAnswers[current] = answerIdx;
    setAnswers(newAnswers);
    setShowFeedback(false); // Hide feedback on new selection
  };

  const handleCheck = () => {
    setShowFeedback(true);
  };

  const handleNext = () => {
    setShowFeedback(false);
    if (current < questions.length - 1) {
      setCurrent(current + 1);
    } else {
      // Calculate XP based on correct answers
      let correctCount = 0;
      questions.forEach((q: any, idx: number) => {
        const selected = answers[idx];
        if (selected !== undefined && q.answers[selected]?.correct) {
          correctCount++;
        }
      });
      
      // Award XP: 10 XP per correct answer
      const xpEarned = correctCount * 10;
      addXp(xpEarned);
      completeLesson(lesson.slug);
      
      // Complete lesson on backend if user is authenticated via NextAuth
      if (session?.backendToken) {
        console.log('Completing lesson on backend:', lesson.slug);
        completeLessonOnBackend(lesson.slug, xpEarned, session.backendToken).catch((error: any) => {
          console.error('Failed to complete lesson on backend:', error);
        });
      }
      
      setShowResults(true);
    }
  };

  const handleRestart = () => {
    setCurrent(0);
    setAnswers([]);
    setShowResults(false);
    setShowFeedback(false);
  };

  if (showResults) {
    let correctCount = 0;
    return (
      <div className="max-w-2xl mx-auto py-8">
        <h1 className="text-3xl font-bold mb-4">{lesson.title} - Results</h1>
        <div className="space-y-6">
          {questions.map((q: any, idx: number) => {
            const selected = answers[idx];
            const isCorrect = selected !== undefined && q.answers[selected]?.correct;
            if (isCorrect) correctCount++;
            return (
              <div key={idx} className={`p-4 border rounded ${isCorrect ? 'bg-green-900/30' : 'bg-red-900/30'}`}> 
                <div className="font-semibold mb-2">Q{idx + 1}: {q.questionText}</div>
                <div>Your answer: {selected !== undefined ? q.answers[selected]?.text : <em>None</em>}</div>
                <div>Correct answer: {q.answers.find((a: any) => a.correct)?.text}</div>
                <div className="mt-2 text-sm text-muted-foreground">{q.explanation}</div>
              </div>
            );
          })}
        </div>
        <div className="mt-8 space-y-2">
          <div className="text-xl font-bold">You got {correctCount} out of {questions.length} correct!</div>
          <div className="text-lg text-green-600 font-semibold">🎉 +{correctCount * 10} XP earned!</div>
        </div>
        <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded" onClick={handleRestart}>Restart Quiz</button>
      </div>
    );
  }

  const q = questions[current];
  const selected = answers[current];
  const isCorrect = selected !== undefined && q.answers[selected]?.correct;

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">{lesson.title}</h1>
      <div className="p-4 border rounded bg-card mb-6">
        <div className="font-semibold mb-2">Q{current + 1}: {q.questionText}</div>
        <ul className="list-disc pl-6">
          {q.answers.map((a: any, i: number) => (
            <li key={i} className="mb-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name={`q${current}`}
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
            className="px-4 py-2 bg-blue-500 text-white rounded"
            onClick={handleCheck}
            disabled={selected === undefined}
          >
            Check Answer
          </button>
        )}
        {showFeedback && (
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded"
            onClick={handleNext}
          >
            {current === questions.length - 1 ? "Finish" : "Next"}
          </button>
        )}
      </div>
    </div>
  );
}
