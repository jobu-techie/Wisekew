"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

async function requireCourseOwnerByBank(bankId: string) {
  const session = await auth();
  const user = session?.user;
  if (!user || (user.role !== "INSTRUCTOR" && user.role !== "ADMIN")) {
    throw new Error("Not authorized");
  }
  const bank = await prisma.questionBank.findUniqueOrThrow({
    where: { id: bankId },
    include: { course: true },
  });
  if (bank.course.instructorId !== user.id && user.role !== "ADMIN") {
    throw new Error("Not authorized");
  }
  return { user, bank };
}

async function requireCourseOwner(courseId: string) {
  const session = await auth();
  const user = session?.user;
  if (!user || (user.role !== "INSTRUCTOR" && user.role !== "ADMIN")) {
    throw new Error("Not authorized");
  }
  const course = await prisma.course.findUniqueOrThrow({ where: { id: courseId } });
  if (course.instructorId !== user.id && user.role !== "ADMIN") {
    throw new Error("Not authorized");
  }
  return { user, course };
}

export async function createQuestionBankAction(courseId: string, formData: FormData) {
  await requireCourseOwner(courseId);
  const title = formData.get("title") as string;
  if (!title?.trim()) return;

  await prisma.questionBank.create({ data: { courseId, title } });
  revalidatePath(`/instructor/courses/${courseId}/questions`);
}

const questionSchema = z.object({
  text: z.string().min(3),
  choices: z.array(z.string().min(1)).min(2).max(6),
  correctChoice: z.coerce.number().int().min(0),
  explanation: z.string().optional(),
});

export async function addQuestionAction(courseId: string, bankId: string, formData: FormData) {
  await requireCourseOwnerByBank(bankId);

  const choices = formData.getAll("choices").map((c) => c.toString());
  const parsed = questionSchema.safeParse({
    text: formData.get("text"),
    choices,
    correctChoice: formData.get("correctChoice"),
    explanation: formData.get("explanation") || undefined,
  });
  if (!parsed.success) return;

  await prisma.question.create({
    data: {
      bankId,
      text: parsed.data.text,
      choices: parsed.data.choices,
      correctChoice: parsed.data.correctChoice,
      explanation: parsed.data.explanation ?? null,
    },
  });

  revalidatePath(`/instructor/courses/${courseId}/questions`);
}

export async function deleteQuestionAction(courseId: string, questionId: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Not authorized");
  await prisma.question.delete({ where: { id: questionId } });
  revalidatePath(`/instructor/courses/${courseId}/questions`);
}

export async function createExamAction(courseId: string, bankId: string, formData: FormData) {
  await requireCourseOwnerByBank(bankId);

  const title = formData.get("title") as string;
  const numQuestions = parseInt(formData.get("numQuestions") as string, 10);
  const timeLimitMinutes = parseInt(formData.get("timeLimitMinutes") as string, 10);
  if (!title?.trim() || !numQuestions || !timeLimitMinutes) return;

  await prisma.exam.create({
    data: { bankId, title, numQuestions, timeLimitMinutes },
  });

  revalidatePath(`/instructor/courses/${courseId}/questions`);
}

export async function deleteExamAction(courseId: string, examId: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Not authorized");
  await prisma.exam.delete({ where: { id: examId } });
  revalidatePath(`/instructor/courses/${courseId}/questions`);
}

export async function submitExamAttemptAction(
  examId: string,
  courseSlug: string,
  questionIds: string[],
  answers: Record<string, number>,
) {
  const session = await auth();
  if (!session?.user) redirect(`/login?callbackUrl=/courses/${courseSlug}`);
  const userId = session.user.id;

  const questions = await prisma.question.findMany({
    where: { id: { in: questionIds } },
  });

  let correct = 0;
  for (const q of questions) {
    if (answers[q.id] === q.correctChoice) correct++;
  }
  const score = questions.length > 0 ? (correct / questions.length) * 100 : 0;

  const attempt = await prisma.examAttempt.create({
    data: {
      examId,
      userId,
      answers,
      score,
      completedAt: new Date(),
    },
  });

  revalidatePath("/dashboard");
  redirect(`/courses/${courseSlug}/exam/${examId}/results/${attempt.id}`);
}
