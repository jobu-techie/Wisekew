import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { CourseCard } from "@/components/course-card";
import {
  GraduationCap,
  ClipboardCheck,
  Award,
  BookOpen,
  Users,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [featuredCourses, courseCount, categories, studentCount] = await Promise.all([
    prisma.course.findMany({
      where: { published: true },
      include: {
        instructor: { select: { name: true } },
        questionBanks: { select: { id: true }, take: 1 },
        _count: { select: { enrollments: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
    prisma.course.count({ where: { published: true } }),
    prisma.course.findMany({
      where: { published: true },
      select: { category: true },
      distinct: ["category"],
    }),
    prisma.enrollment.count(),
  ]);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-slate-100 dark:bg-muted/20">
        <div className="mx-auto max-w-6xl px-4 py-14 lg:py-20">
          <div className="relative grid grid-cols-1 items-center lg:grid-cols-12">
            <div className="relative z-10 rounded-2xl bg-white p-8 shadow-lg lg:col-span-5 lg:p-10 dark:bg-card">
              <p className="mb-3 text-sm font-bold tracking-widest text-primary uppercase">
                Learn It. Practice It. Prove It.
              </p>
              <h1 className="text-3xl leading-tight font-extrabold text-foreground sm:text-4xl">
                Learn New Skills. Master Your Exams.
              </h1>
              <p className="mt-4 text-muted-foreground">
                Wisekew combines on-demand video courses with structured
                practice question banks and timed exams — everything you
                need to learn it, then prove it.
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Button size="lg" className="rounded-md" render={<Link href="/courses" />}>
                  View All Courses
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-md border-2 border-primary text-primary hover:bg-primary hover:text-white"
                  render={<Link href="/become-instructor" />}
                >
                  Become An Instructor
                </Button>
              </div>
            </div>

            <div className="relative mt-10 hidden h-80 items-center justify-center lg:col-span-7 lg:mt-0 lg:flex">
              <div
                className="absolute right-24 bottom-4 h-56 w-72 bg-primary/15"
                style={{ clipPath: "polygon(0 100%, 100% 100%, 100% 20%)" }}
              />
              <div
                className="absolute right-8 bottom-0 h-64 w-56 bg-primary/25"
                style={{ clipPath: "polygon(0 100%, 100% 100%, 40% 0)" }}
              />
              <div className="relative z-10 flex h-56 w-56 items-center justify-center rounded-full bg-primary shadow-xl">
                <GraduationCap className="h-28 w-28 text-white" strokeWidth={1.5} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-black/5 bg-white dark:border-white/10 dark:bg-transparent">
        <div className="mx-auto grid max-w-6xl grid-cols-3 gap-6 px-4 py-8 text-center">
          <div>
            <p className="text-3xl font-bold text-primary">{courseCount}</p>
            <p className="mt-1 text-sm text-muted-foreground">Courses available</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-primary">{categories.length}</p>
            <p className="mt-1 text-sm text-muted-foreground">Categories</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-primary">{studentCount}</p>
            <p className="mt-1 text-sm text-muted-foreground">Enrollments</p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
          <div className="text-center">
            <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <GraduationCap className="h-7 w-7" />
            </span>
            <h3 className="font-semibold">Video courses</h3>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Learn from instructors with structured lectures at your own pace.
            </p>
          </div>
          <div className="text-center">
            <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <ClipboardCheck className="h-7 w-7" />
            </span>
            <h3 className="font-semibold">Practice exams</h3>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Gleim-style question banks and timed exams with instant explanations.
            </p>
          </div>
          <div className="text-center">
            <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Award className="h-7 w-7" />
            </span>
            <h3 className="font-semibold">Certificates</h3>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Track your progress and earn a certificate when you finish.
            </p>
          </div>
        </div>
      </section>

      {/* Featured courses */}
      {featuredCourses.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pb-20">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Popular courses
            </h2>
            <Link
              href="/courses"
              className="text-sm font-medium text-primary hover:underline"
            >
              Browse all courses &gt;
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredCourses.map((c) => (
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
        </section>
      )}

      {/* Instructor CTA */}
      <section className="mx-auto max-w-6xl px-4 pb-24">
        <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-primary to-brand-dark px-8 py-16 text-center text-white sm:px-16">
          <BookOpen className="mx-auto mb-5 h-10 w-10 text-white/80" />
          <h2 className="text-3xl font-bold sm:text-4xl">Become a Wisekew instructor</h2>
          <p className="mx-auto mt-3 max-w-xl text-white/80">
            Share your expertise with a global audience — publish video
            courses or exam-prep question banks in minutes.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Button
              size="lg"
              variant="secondary"
              className="rounded-md bg-white px-8 text-primary hover:bg-white/90"
              render={<Link href="/become-instructor" />}
            >
              Start teaching
            </Button>
          </div>
          <div className="mt-8 flex justify-center gap-2 text-sm text-white/70">
            <Users className="h-4 w-4" />
            Join instructors already teaching on Wisekew
          </div>
        </div>
      </section>
    </div>
  );
}
