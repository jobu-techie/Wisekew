import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Award, GraduationCap, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await auth();
  if (session!.user.role === "ADMIN") redirect("/admin");
  const userId = session!.user.id;

  const enrollments = await prisma.enrollment.findMany({
    where: { userId },
    include: {
      course: {
        include: { sections: { include: { lectures: { select: { id: true } } } } },
      },
    },
    orderBy: { enrolledAt: "desc" },
  });

  const lectureIds = enrollments.flatMap((e) =>
    e.course.sections.flatMap((s) => s.lectures.map((l) => l.id)),
  );
  const progressRecords = await prisma.lectureProgress.findMany({
    where: { userId, lectureId: { in: lectureIds } },
  });
  const completedSet = new Set(progressRecords.map((p) => p.lectureId));

  const certificates = await prisma.certificate.findMany({
    where: { userId },
    include: { course: { select: { title: true, slug: true } } },
  });

  const examAttempts = await prisma.examAttempt.findMany({
    where: { userId, completedAt: { not: null } },
    include: { exam: { include: { bank: { include: { course: true } } } } },
    orderBy: { completedAt: "desc" },
    take: 10,
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="mb-6 text-3xl font-bold tracking-tight">My Learning</h1>

      {session!.user.role === "STUDENT" && (
        <Link href="/become-instructor">
          <Card className="mb-8 rounded-2xl border-none bg-gradient-to-r from-primary to-brand-dark text-white transition-opacity hover:opacity-95">
            <CardContent className="flex items-center justify-between gap-4 py-4">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15">
                  <GraduationCap className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-medium">Want to teach on Wisekew?</p>
                  <p className="text-sm text-white/80">
                    Upgrade your account to publish courses and exams.
                  </p>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 shrink-0" />
            </CardContent>
          </Card>
        </Link>
      )}

      <h2 className="mb-4 text-xl font-semibold">Your courses</h2>
      {enrollments.length === 0 ? (
        <Card className="mb-10">
          <CardContent className="py-8 text-center text-muted-foreground">
            You&apos;re not enrolled in any courses yet.{" "}
            <Link href="/courses" className="text-primary hover:underline">
              Browse courses
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {enrollments.map((e) => {
            const lectures = e.course.sections.flatMap((s) => s.lectures);
            const total = lectures.length;
            const done = lectures.filter((l) => completedSet.has(l.id)).length;
            const pct = total > 0 ? Math.round((done / total) * 100) : 0;
            return (
              <Link key={e.id} href={`/courses/${e.course.slug}/learn`}>
                <Card className="h-full hover:shadow-md transition-shadow">
                  <CardContent className="py-4">
                    <h3 className="font-medium mb-2">{e.course.title}</h3>
                    <Progress value={pct} className="h-2 mb-2" />
                    <p className="text-sm text-muted-foreground">
                      {pct}% complete ({done}/{total} lectures)
                    </p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}

      <h2 className="mb-4 text-xl font-semibold">Certificates</h2>
      {certificates.length === 0 ? (
        <p className="mb-10 text-sm text-muted-foreground">
          Complete a course to earn your first certificate.
        </p>
      ) : (
        <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {certificates.map((c) => (
            <Card key={c.id}>
              <CardContent className="flex items-center gap-3 py-4">
                <Award className="h-8 w-8 text-primary shrink-0" />
                <div>
                  <p className="font-medium">{c.course.title}</p>
                  <p className="text-xs text-muted-foreground">
                    Issued {c.issuedAt.toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <h2 className="mb-4 text-xl font-semibold">Exam history</h2>
      {examAttempts.length === 0 ? (
        <p className="text-sm text-muted-foreground">No practice exams taken yet.</p>
      ) : (
        <div className="space-y-2">
          {examAttempts.map((a) => (
            <Card key={a.id}>
              <CardContent className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-sm">{a.exam.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {a.exam.bank.course.title} ·{" "}
                    {a.completedAt?.toLocaleDateString()}
                  </p>
                </div>
                <Badge variant={(a.score ?? 0) >= 70 ? "default" : "secondary"}>
                  {Math.round(a.score ?? 0)}%
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
