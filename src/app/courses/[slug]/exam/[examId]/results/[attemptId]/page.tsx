import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ExamResultsPage({
  params,
}: {
  params: Promise<{ slug: string; examId: string; attemptId: string }>;
}) {
  const { slug, examId, attemptId } = await params;

  const session = await auth();
  if (!session?.user) redirect(`/login`);

  const attempt = await prisma.examAttempt.findUnique({
    where: { id: attemptId },
    include: { exam: true },
  });
  if (!attempt || attempt.examId !== examId || attempt.userId !== session.user.id) notFound();

  const answers = attempt.answers as Record<string, number>;
  const questions = await prisma.question.findMany({
    where: { id: { in: Object.keys(answers) } },
  });

  const score = Math.round(attempt.score ?? 0);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Link href={`/courses/${slug}/learn`} className="text-sm text-muted-foreground hover:underline">
        &larr; Back to course
      </Link>

      <Card className="my-6">
        <CardContent className="py-8 text-center">
          <p className="text-sm text-muted-foreground">{attempt.exam.title}</p>
          <p className="mt-2 text-5xl font-bold">{score}%</p>
          <p className="mt-2 text-muted-foreground">
            {questions.filter((q) => answers[q.id] === q.correctChoice).length} of{" "}
            {questions.length} correct
          </p>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {questions.map((q, idx) => {
          const choices = q.choices as string[];
          const userAnswer = answers[q.id];
          const isCorrect = userAnswer === q.correctChoice;
          return (
            <Card key={q.id}>
              <CardContent className="py-4">
                <div className="mb-3 flex items-start justify-between gap-2">
                  <p className="font-medium">
                    {idx + 1}. {q.text}
                  </p>
                  <Badge variant={isCorrect ? "default" : "destructive"}>
                    {isCorrect ? "Correct" : "Incorrect"}
                  </Badge>
                </div>
                <ul className="space-y-1.5 text-sm">
                  {choices.map((c, i) => {
                    const isUserChoice = i === userAnswer;
                    const isCorrectChoice = i === q.correctChoice;
                    return (
                      <li
                        key={i}
                        className={cn(
                          "flex items-center gap-2 rounded px-2 py-1",
                          isCorrectChoice && "bg-green-500/10 text-green-700 dark:text-green-400",
                          isUserChoice && !isCorrectChoice && "bg-red-500/10 text-red-700 dark:text-red-400",
                        )}
                      >
                        {isCorrectChoice ? (
                          <CheckCircle2 className="h-4 w-4 shrink-0" />
                        ) : isUserChoice ? (
                          <XCircle className="h-4 w-4 shrink-0" />
                        ) : (
                          <span className="w-4" />
                        )}
                        {c}
                        {isUserChoice && !isCorrectChoice && (
                          <span className="text-xs">(your answer)</span>
                        )}
                      </li>
                    );
                  })}
                </ul>
                {q.explanation && (
                  <p className="mt-3 rounded bg-muted/50 p-3 text-sm text-muted-foreground">
                    {q.explanation}
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Button render={<Link href={`/courses/${slug}/learn`} />} className="mt-8 w-full">
        Continue course
      </Button>
    </div>
  );
}
