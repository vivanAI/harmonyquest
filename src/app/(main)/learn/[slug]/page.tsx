import { QuizClient } from "@/components/quiz-client";
import { quizData } from "@/lib/quiz-data";
import { notFound } from "next/navigation";
import { unslugify } from "@/lib/utils";

export default function QuizPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const lesson = quizData.find((lesson) => lesson.slug === slug);

  if (!lesson) {
    notFound();
  }

  const title = unslugify(slug);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold tracking-tight">Learn: {title}</h1>
      <QuizClient questions={lesson.questions} />
    </div>
  );
}

export function generateStaticParams() {
  return quizData.map((lesson) => ({
    slug: lesson.slug,
  }));
}
