"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function LessonDetailPage() {
  const { slug } = useParams();
  const [lesson, setLesson] = useState<any>(null);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]); // index of selected answer per question
  const [showResults, setShowResults] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

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
    setShowExplanation(false); // Hide explanation on new selection
  };

  const handleNext = () => {
    setShowExplanation(false);
    if (current < questions.length - 1) {
      setCurrent(current + 1);
    } else {
      // TODO: Submit answers to backend for progress tracking
      setShowResults(true);
    }
  };

  const handleShowExplanation = () => {
    setShowExplanation(true);
  };

  const handleRestart = () => {
    setCurrent(0);
    setAnswers([]);
    setShowResults(false);
    setShowExplanation(false);
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
        <div className="mt-8 text-xl font-bold">You got {correctCount} out of {questions.length} correct!</div>
        <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded" onClick={handleRestart}>Restart Quiz</button>
      </div>
    );
  }

  const q = questions[current];
  const selected = answers[current];

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
                />
                {a.text}
              </label>
            </li>
          ))}
        </ul>
        {showExplanation && selected !== undefined && (
          <div className="mt-2 text-sm text-muted-foreground">{q.explanation}</div>
        )}
      </div>
      <div className="flex gap-2">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={() => { handleShowExplanation(); }}
          disabled={selected === undefined}
        >
          Show Explanation
        </button>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={handleNext}
          disabled={selected === undefined}
        >
          {current === questions.length - 1 ? "Finish" : "Next"}
        </button>
      </div>
    </div>
  );
}
