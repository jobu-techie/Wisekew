"use server";

import { randomBytes } from "crypto";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

function generateCode(): string {
  return randomBytes(5).toString("hex").toUpperCase();
}

export async function generateAccessCodeAction(courseId: string) {
  const session = await auth();
  const user = session?.user;
  if (!user || (user.role !== "INSTRUCTOR" && user.role !== "ADMIN")) {
    throw new Error("Not authorized");
  }

  const course = await prisma.course.findUniqueOrThrow({ where: { id: courseId } });
  if (course.instructorId !== user.id && user.role !== "ADMIN") {
    throw new Error("Not authorized");
  }

  await prisma.accessCode.create({
    data: { code: generateCode(), courseId },
  });

  revalidatePath(`/instructor/courses/${courseId}/edit`);
}

export type RedeemState = {
  error?: string;
  success?: boolean;
  courseTitle?: string;
  courseSlug?: string;
};

export async function redeemAccessCodeAction(
  _prevState: RedeemState,
  formData: FormData,
): Promise<RedeemState> {
  const session = await auth();
  if (!session?.user) return { error: "Not authenticated" };
  const userId = session.user.id;

  const codeInput = (formData.get("code") as string | null)?.trim().toUpperCase();
  if (!codeInput) return { error: "Enter an access code" };

  const accessCode = await prisma.accessCode.findUnique({
    where: { code: codeInput },
    include: { course: true },
  });

  if (!accessCode) return { error: "That access code isn't valid" };
  if (accessCode.redeemedAt) return { error: "This access code has already been redeemed" };

  const existingEnrollment = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId, courseId: accessCode.courseId } },
  });

  await prisma.$transaction([
    prisma.accessCode.update({
      where: { id: accessCode.id },
      data: { redeemedById: userId, redeemedAt: new Date() },
    }),
    ...(existingEnrollment
      ? []
      : [
          prisma.payment.create({
            data: {
              userId,
              courseId: accessCode.courseId,
              amount: 0,
              provider: "ACCESS_CODE",
              status: "COMPLETED",
            },
          }),
          prisma.enrollment.create({
            data: { userId, courseId: accessCode.courseId },
          }),
        ]),
  ]);

  revalidatePath("/dashboard");

  return { success: true, courseTitle: accessCode.course.title, courseSlug: accessCode.course.slug };
}
