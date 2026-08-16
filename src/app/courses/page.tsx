import { prisma } from "@/lib/prisma";
import { CourseCard } from "@/components/course-card";
import { CourseFilters } from "./course-filters";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const { q, category } = await searchParams;

  const courses = await prisma.course.findMany({
    where: {
      published: true,
      ...(q
        ? {
            OR: [
              { title: { contains: q, mode: "insensitive" } },
              { description: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
      ...(category && category !== "all" ? { category } : {}),
    },
    include: {
      instructor: { select: { name: true } },
      questionBanks: { select: { id: true }, take: 1 },
      _count: { select: { enrollments: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const categories = await prisma.course.findMany({
    where: { published: true },
    select: { category: true },
    distinct: ["category"],
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Explore courses</h1>
        <p className="mt-1 text-muted-foreground">
          Video courses and exam-prep question banks, all in one place.
        </p>
      </div>

      <CourseFilters
        initialQuery={q ?? ""}
        initialCategory={category ?? "all"}
        categories={categories.map((c) => c.category)}
      />

      {courses.length === 0 ? (
        <p className="text-muted-foreground">No courses found.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((c) => (
            <CourseCard
              key={c.id}
              course={{
                slug: c.slug,
                title: c.title,
                description: c.description,
                category: c.category,
                price: c.price.toString(),
                instructorName: c.instructor.name,
                hasExam: c.questionBanks.length > 0,
                enrollmentCount: c._count.enrollments,
              }}
            />
          ))}
        </div>
      )}

      <p className="mt-10 text-center text-sm text-muted-foreground">
        Want to teach on Wisekew?{" "}
        <Link href="/become-instructor" className="text-primary hover:underline">
          Become an instructor
        </Link>
      </p>
    </div>
  );
}
