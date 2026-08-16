import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ExamRunner } from "./exam-runner";

export const dynamic = "force-dynamic";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default async function ExamPage({
  params,
}: {
  params: Promise<{ slug: string; examId: string }>;
}) {
  const { slug, examId } = await params;

  const session = await auth();
  if (!session?.user) redirect(`/login?callbackUrl=/courses/${slug}/exam/${examId}`);
  const userId = session.user.id;

  const course = await prisma.course.findUnique({ where: { slug } });
  if (!course) notFound();

  const enrollment = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId, courseId: course.id } },
  });
  if (!enrollment) redirect(`/courses/${slug}`);

  const exam = await prisma.exam.findUnique({
    where: { id: examId },
    include: { bank: { include: { questions: true } } },
  });
  if (!exam || exam.bank.courseId !== course.id) notFound();

  const selected = shuffle(exam.bank.questions).slice(0, exam.numQuestions);
  const questions = selected.map((q) => ({
    id: q.id,
    text: q.text,
    choices: q.choices as string[],
  }));

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <ExamRunner
        examId={exam.id}
        examTitle={exam.title}
        courseSlug={slug}
        timeLimitMinutes={exam.timeLimitMinutes}
        questions={questions}
      />
    </div>
  );
}
