import { notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  addQuestionAction,
  createExamAction,
  createQuestionBankAction,
  deleteExamAction,
  deleteQuestionAction,
} from "@/lib/actions/exams";
import { Trash2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function CourseQuestionsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  const user = session!.user;

  const course = await prisma.course.findUnique({
    where: { id },
    include: {
      questionBanks: {
        include: { questions: true, exams: true },
      },
    },
  });

  if (!course || (course.instructorId !== user.id && user.role !== "ADMIN")) notFound();

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <Link
        href={`/instructor/courses/${course.id}/edit`}
        className="text-sm text-muted-foreground hover:underline"
      >
        &larr; Back to {course.title}
      </Link>
      <h1 className="mt-1 mb-8 text-2xl font-bold tracking-tight">Practice exams</h1>

      {course.questionBanks.map((bank) => (
        <Card key={bank.id} className="mb-8 rounded-2xl border-black/10 dark:border-white/10">
          <CardHeader>
            <CardTitle className="text-lg">{bank.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <div>
              <h4 className="mb-3 text-sm font-medium text-muted-foreground">
                Questions ({bank.questions.length})
              </h4>
              <ul className="space-y-2 mb-4">
                {bank.questions.map((q) => {
                  const choices = q.choices as string[];
                  return (
                    <li key={q.id} className="rounded border p-3 text-sm">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-medium">{q.text}</p>
                        <form action={deleteQuestionAction.bind(null, course.id, q.id)}>
                          <Button variant="ghost" size="sm" type="submit">
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </form>
                      </div>
                      <ul className="mt-2 space-y-1">
                        {choices.map((c, i) => (
                          <li
                            key={i}
                            className={
                              i === q.correctChoice
                                ? "text-green-700 dark:text-green-400 font-medium"
                                : "text-muted-foreground"
                            }
                          >
                            {i === q.correctChoice ? "✓ " : "· "}
                            {c}
                          </li>
                        ))}
                      </ul>
                    </li>
                  );
                })}
              </ul>

              <details className="text-sm">
                <summary className="cursor-pointer text-muted-foreground">
                  + Add question
                </summary>
                <form
                  action={addQuestionAction.bind(null, course.id, bank.id)}
                  className="mt-3 space-y-3"
                >
                  <div className="space-y-1.5">
                    <Label>Question text</Label>
                    <Textarea name="text" required rows={2} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Choices</Label>
                    {[0, 1, 2, 3].map((i) => (
                      <Input key={i} name="choices" required placeholder={`Choice ${i + 1}`} />
                    ))}
                  </div>
                  <div className="space-y-1.5">
                    <Label>Correct choice</Label>
                    <select
                      name="correctChoice"
                      required
                      className="flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs"
                    >
                      <option value="0">Choice 1</option>
                      <option value="1">Choice 2</option>
                      <option value="2">Choice 3</option>
                      <option value="3">Choice 4</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Explanation (shown after the student answers)</Label>
                    <Textarea name="explanation" rows={2} />
                  </div>
                  <Button type="submit" size="sm">
                    Add question
                  </Button>
                </form>
              </details>
            </div>

            <Separator />

            <div>
              <h4 className="mb-3 text-sm font-medium text-muted-foreground">
                Exams ({bank.exams.length})
              </h4>
              <ul className="space-y-2 mb-4">
                {bank.exams.map((exam) => (
                  <li
                    key={exam.id}
                    className="flex items-center justify-between rounded border p-3 text-sm"
                  >
                    <span>
                      {exam.title}{" "}
                      <Badge variant="outline" className="ml-2">
                        {exam.numQuestions} Q · {exam.timeLimitMinutes} min
                      </Badge>
                    </span>
                    <form action={deleteExamAction.bind(null, course.id, exam.id)}>
                      <Button variant="ghost" size="sm" type="submit">
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </form>
                  </li>
                ))}
              </ul>

              <details className="text-sm">
                <summary className="cursor-pointer text-muted-foreground">+ Add exam</summary>
                <form
                  action={createExamAction.bind(null, course.id, bank.id)}
                  className="mt-3 space-y-3"
                >
                  <div className="space-y-1.5">
                    <Label>Exam title</Label>
                    <Input name="title" required placeholder="e.g. FAR Practice Exam 1" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label>Number of questions</Label>
                      <Input
                        name="numQuestions"
                        type="number"
                        min={1}
                        max={bank.questions.length || 1}
                        defaultValue={Math.min(10, bank.questions.length || 1)}
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Time limit (minutes)</Label>
                      <Input name="timeLimitMinutes" type="number" min={1} defaultValue={20} required />
                    </div>
                  </div>
                  <Button type="submit" size="sm">
                    Add exam
                  </Button>
                </form>
              </details>
            </div>
          </CardContent>
        </Card>
      ))}

      <Card className="rounded-2xl border-black/10 dark:border-white/10">
        <CardHeader>
          <CardTitle className="text-lg">Add a question bank</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            action={createQuestionBankAction.bind(null, course.id)}
            className="flex items-end gap-3"
          >
            <div className="flex-1 space-y-1.5">
              <Label>Bank title</Label>
              <Input name="title" required placeholder="e.g. FAR Question Bank" />
            </div>
            <Button type="submit" className="rounded-md">
              Create
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
