"use server";

import { z } from "zod";
import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/format";

async function requireInstructor() {
  const session = await auth();
  const user = session?.user;
  if (!user || (user.role !== "INSTRUCTOR" && user.role !== "ADMIN")) {
    throw new Error("Not authorized");
  }
  return user;
}

async function requireCourseOwner(courseId: string) {
  const user = await requireInstructor();
  const course = await prisma.course.findUniqueOrThrow({ where: { id: courseId } });
  if (course.instructorId !== user.id && user.role !== "ADMIN") {
    throw new Error("Not authorized");
  }
  return { user, course };
}

const courseSchema = z.object({
  title: z.string().min(3, "Title is too short"),
  description: z.string().min(10, "Description is too short"),
  category: z.string().min(2, "Pick a category"),
  price: z.coerce.number().min(0, "Price cannot be negative"),
});

export type CourseFormState = { error?: string };

export async function createCourseAction(
  _prev: CourseFormState,
  formData: FormData,
): Promise<CourseFormState> {
  const user = await requireInstructor();

  const parsed = courseSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    category: formData.get("category"),
    price: formData.get("price"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const baseSlug = slugify(parsed.data.title);
  let slug = baseSlug;
  let attempt = 1;
  while (await prisma.course.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${++attempt}`;
  }

  const course = await prisma.course.create({
    data: { ...parsed.data, slug, instructorId: user.id },
  });

  revalidatePath("/instructor");
  redirect(`/instructor/courses/${course.id}/edit`);
}

export async function updateCourseAction(
  courseId: string,
  _prev: CourseFormState,
  formData: FormData,
): Promise<CourseFormState> {
  const { course } = await requireCourseOwner(courseId);

  const parsed = courseSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    category: formData.get("category"),
    price: formData.get("price"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  await prisma.course.update({
    where: { id: course.id },
    data: parsed.data,
  });

  revalidatePath(`/instructor/courses/${courseId}/edit`);
  revalidatePath(`/courses/${course.slug}`);
  return {};
}

export async function togglePublishAction(courseId: string) {
  const { course } = await requireCourseOwner(courseId);
  await prisma.course.update({
    where: { id: course.id },
    data: { published: !course.published },
  });
  revalidatePath(`/instructor/courses/${courseId}/edit`);
  revalidatePath("/instructor");
  revalidatePath("/courses");
}

export async function addSectionAction(courseId: string, formData: FormData) {
  await requireCourseOwner(courseId);
  const title = formData.get("title") as string;
  if (!title?.trim()) return;

  const count = await prisma.section.count({ where: { courseId } });
  await prisma.section.create({
    data: { courseId, title, order: count },
  });
  revalidatePath(`/instructor/courses/${courseId}/edit`);
}

export async function deleteSectionAction(courseId: string, sectionId: string) {
  await requireCourseOwner(courseId);
  await prisma.section.delete({ where: { id: sectionId } });
  revalidatePath(`/instructor/courses/${courseId}/edit`);
}

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

async function saveUploadedVideo(file: File): Promise<string> {
  await mkdir(UPLOAD_DIR, { recursive: true });
  const ext = path.extname(file.name) || ".mp4";
  const filename = `${randomUUID()}${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(UPLOAD_DIR, filename), buffer);
  return `/uploads/${filename}`;
}

export async function addLectureAction(courseId: string, sectionId: string, formData: FormData) {
  await requireCourseOwner(courseId);

  const title = formData.get("title") as string;
  const content = (formData.get("content") as string) || null;
  const videoUrlInput = (formData.get("videoUrl") as string) || "";
  const durationRaw = formData.get("duration") as string;
  const file = formData.get("videoFile") as File | null;

  if (!title?.trim()) return;

  let videoUrl: string | null = videoUrlInput.trim() || null;
  if (file && file.size > 0) {
    videoUrl = await saveUploadedVideo(file);
  }

  const count = await prisma.lecture.count({ where: { sectionId } });
  await prisma.lecture.create({
    data: {
      sectionId,
      title,
      content,
      videoUrl,
      duration: durationRaw ? parseInt(durationRaw, 10) : null,
      order: count,
    },
  });

  revalidatePath(`/instructor/courses/${courseId}/edit`);
}

export async function deleteLectureAction(courseId: string, lectureId: string) {
  await requireCourseOwner(courseId);
  await prisma.lecture.delete({ where: { id: lectureId } });
  revalidatePath(`/instructor/courses/${courseId}/edit`);
}
