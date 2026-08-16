import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, BookOpen } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function CourseUpdatesPage() {
  const session = await auth();
  const userId = session!.user.id;

  const enrollments = await prisma.enrollment.findMany({
    where: { userId },
    include: {
      course: {
        include: { sections: { include: { lectures: { select: { id: true } } } } },
      },
    },
  });

  const courses = enrollments
    .map((e) => e.course)
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());

  return (
    <div>
      <Link
        href="/dashboard/account"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Account
      </Link>
      <h1 className="text-3xl font-bold tracking-tight">Course Updates</h1>
      <p className="mt-1 text-muted-foreground">
        See what&apos;s changed in the courses you&apos;re enrolled in.
      </p>

      {courses.length === 0 ? (
        <p className="mt-8 text-sm text-muted-foreground">
          You&apos;re not enrolled in any courses yet.
        </p>
      ) : (
        <div className="mt-8 space-y-2">
          {courses.map((c) => {
            const lectureCount = c.sections.reduce((sum, s) => sum + s.lectures.length, 0);
            return (
              <Link key={c.id} href={`/courses/${c.slug}/learn`}>
                <Card className="rounded-xl border-black/10 transition-shadow hover:shadow-md dark:border-white/10">
                  <CardContent className="flex items-center gap-3 py-3.5">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <BookOpen className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-sm font-medium">{c.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {c.sections.length} sections · {lectureCount} lectures · Last updated{" "}
                        {c.updatedAt.toLocaleDateString()}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
