"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function enrollAction(courseId: string, courseSlug: string) {
  const session = await auth();
  if (!session?.user) {
    redirect(`/login?callbackUrl=/courses/${courseSlug}`);
  }
  const userId = session.user.id;

  const course = await prisma.course.findUniqueOrThrow({ where: { id: courseId } });

  const existing = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId, courseId } },
  });

  if (!existing) {
    await prisma.$transaction([
      prisma.payment.create({
        data: {
          userId,
          courseId,
          amount: course.price,
          provider: "MOCK",
          status: "COMPLETED",
        },
      }),
      prisma.enrollment.create({
        data: { userId, courseId },
      }),
    ]);
  }

  revalidatePath(`/courses/${courseSlug}`);
  redirect(`/courses/${courseSlug}/learn`);
}

async function maybeIssueCertificate(userId: string, courseId: string) {
  const totalLectures = await prisma.lecture.count({
    where: { section: { courseId } },
  });
  if (totalLectures === 0) return;

  const completedLectures = await prisma.lectureProgress.count({
    where: { userId, lecture: { section: { courseId } } },
  });

  if (completedLectures >= totalLectures) {
    await prisma.certificate.upsert({
      where: { userId_courseId: { userId, courseId } },
      update: {},
      create: { userId, courseId },
    });
  }
}

export async function markLectureCompleteAction(
  lectureId: string,
  courseId: string,
  courseSlug: string,
) {
  const session = await auth();
  if (!session?.user) return;
  const userId = session.user.id;

  await prisma.lectureProgress.upsert({
    where: { userId_lectureId: { userId, lectureId } },
    update: {},
    create: { userId, lectureId },
  });

  await maybeIssueCertificate(userId, courseId);

  revalidatePath(`/courses/${courseSlug}/learn`);
  revalidatePath("/dashboard");
}
