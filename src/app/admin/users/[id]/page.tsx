import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import {
  ArrowLeft,
  Award,
  BookOpen,
  DollarSign,
  Layers,
  Users,
} from "lucide-react";

export const dynamic = "force-dynamic";

const roleBadgeVariant = {
  ADMIN: "default",
  INSTRUCTOR: "outline",
  STUDENT: "secondary",
} as const;

export default async function AdminUserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      coursesTaught: {
        include: { _count: { select: { enrollments: true } } },
        orderBy: { createdAt: "desc" },
      },
      enrollments: {
        include: {
          course: {
            include: { sections: { include: { lectures: { select: { id: true } } } } },
          },
        },
        orderBy: { enrolledAt: "desc" },
      },
      certificates: {
        include: { course: { select: { title: true, slug: true } } },
        orderBy: { issuedAt: "desc" },
      },
      examAttempts: {
        where: { completedAt: { not: null } },
        include: { exam: { include: { bank: { include: { course: true } } } } },
        orderBy: { completedAt: "desc" },
        take: 10,
      },
    },
  });

  if (!user) notFound();

  const lectureIds = user.enrollments.flatMap((e) =>
    e.course.sections.flatMap((s) => s.lectures.map((l) => l.id)),
  );
  const progressRecords = lectureIds.length
    ? await prisma.lectureProgress.findMany({
        where: { userId: user.id, lectureId: { in: lectureIds } },
      })
    : [];
  const completedSet = new Set(progressRecords.map((p) => p.lectureId));

  const teachingRevenueAgg = user.coursesTaught.length
    ? await prisma.payment.aggregate({
        where: { course: { instructorId: user.id } },
        _sum: { amount: true },
      })
    : null;
  const teachingRevenue = teachingRevenueAgg?._sum.amount?.toString() ?? "0";
  const totalStudents = user.coursesTaught.reduce(
    (sum, c) => sum + c._count.enrollments,
    0,
  );
  const publishedCount = user.coursesTaught.filter((c) => c.published).length;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <Link
        href="/admin"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" /> Back to admin
      </Link>

      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">{user.name}</h1>
            <Badge variant={roleBadgeVariant[user.role]}>{user.role}</Badge>
          </div>
          <p className="mt-1 text-muted-foreground">{user.email}</p>
          {user.phone && (
            <p className="mt-1 text-sm text-muted-foreground">{user.phone}</p>
          )}
          {(user.country || user.postalCode) && (
            <p className="mt-1 text-sm text-muted-foreground">
              {[user.country, user.postalCode].filter(Boolean).join(" · ")}
            </p>
          )}
          <p className="mt-1 text-sm text-muted-foreground">
            Joined {user.createdAt.toLocaleDateString()}
          </p>
        </div>
      </div>

      {user.coursesTaught.length > 0 && (
        <>
          <h2 className="mb-4 text-xl font-semibold">Teaching</h2>
          <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { label: "Courses", value: user.coursesTaught.length, icon: BookOpen },
              { label: "Published", value: publishedCount, icon: Layers },
              { label: "Students", value: totalStudents, icon: Users },
              { label: "Revenue", value: formatPrice(teachingRevenue), icon: DollarSign },
            ].map((s) => (
              <Card key={s.label} className="rounded-2xl border-black/10 dark:border-white/10">
                <CardContent className="py-5">
                  <s.icon className="mb-2 h-5 w-5 text-primary" />
                  <p className="text-2xl font-bold">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mb-10 space-y-3">
            {user.coursesTaught.map((c) => (
              <Card key={c.id} className="rounded-2xl border-black/10 dark:border-white/10">
                <CardContent className="flex flex-wrap items-center justify-between gap-4 py-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{c.title}</h3>
                      <Badge variant={c.published ? "default" : "secondary"}>
                        {c.published ? "Published" : "Draft"}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {c._count.enrollments} students · {formatPrice(c.price.toString())}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-md"
                    render={<Link href={`/instructor/courses/${c.id}/edit`} />}
                  >
                    Manage
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      <h2 className="mb-4 text-xl font-semibold">Enrolled courses</h2>
      {user.enrollments.length === 0 ? (
        <p className="mb-10 text-sm text-muted-foreground">Not enrolled in any courses.</p>
      ) : (
        <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {user.enrollments.map((e) => {
            const lectures = e.course.sections.flatMap((s) => s.lectures);
            const total = lectures.length;
            const done = lectures.filter((l) => completedSet.has(l.id)).length;
            const pct = total > 0 ? Math.round((done / total) * 100) : 0;
            return (
              <Card key={e.id} className="rounded-2xl border-black/10 dark:border-white/10">
                <CardContent className="py-4">
                  <h3 className="font-medium mb-2">{e.course.title}</h3>
                  <Progress value={pct} className="h-2 mb-2" />
                  <p className="text-sm text-muted-foreground">
                    {pct}% complete ({done}/{total} lectures)
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <h2 className="mb-4 text-xl font-semibold">Certificates</h2>
      {user.certificates.length === 0 ? (
        <p className="mb-10 text-sm text-muted-foreground">No certificates earned yet.</p>
      ) : (
        <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {user.certificates.map((c) => (
            <Card key={c.id} className="rounded-2xl border-black/10 dark:border-white/10">
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
      {user.examAttempts.length === 0 ? (
        <p className="text-sm text-muted-foreground">No practice exams taken yet.</p>
      ) : (
        <div className="space-y-2">
          {user.examAttempts.map((a) => (
            <Card key={a.id} className="rounded-2xl border-black/10 dark:border-white/10">
              <CardContent className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-sm">{a.exam.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {a.exam.bank.course.title} · {a.completedAt?.toLocaleDateString()}
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
