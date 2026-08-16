import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/format";
import { BookOpen, Layers, Users, DollarSign, ClipboardList } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function InstructorDashboardPage() {
  const session = await auth();
  const userId = session!.user.id;

  const [courses, revenueAgg] = await Promise.all([
    prisma.course.findMany({
      where: { instructorId: userId },
      include: {
        _count: { select: { enrollments: true, sections: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.payment.aggregate({
      where: { course: { instructorId: userId } },
      _sum: { amount: true },
    }),
  ]);

  const publishedCount = courses.filter((c) => c.published).length;
  const totalStudents = courses.reduce((sum, c) => sum + c._count.enrollments, 0);
  const totalRevenue = revenueAgg._sum.amount?.toString() ?? "0";

  const stats = [
    { label: "Courses", value: courses.length, icon: BookOpen },
    { label: "Published", value: publishedCount, icon: ClipboardList },
    { label: "Students", value: totalStudents, icon: Users },
    { label: "Revenue", value: formatPrice(totalRevenue), icon: DollarSign },
  ];

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your courses</h1>
          <p className="mt-1 text-muted-foreground">Create and manage what you teach.</p>
        </div>
        <Button className="rounded-md px-5" render={<Link href="/instructor/courses/new" />}>
          New course
        </Button>
      </div>

      <div className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label} className="rounded-2xl border-black/10 dark:border-white/10">
            <CardContent className="py-5">
              <s.icon className="mb-2 h-5 w-5 text-primary" />
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {courses.length === 0 ? (
        <Card className="rounded-2xl">
          <CardContent className="py-10 text-center text-muted-foreground">
            You haven&apos;t created any courses yet.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {courses.map((c) => (
            <Card
              key={c.id}
              className="rounded-2xl border-black/10 transition-shadow hover:shadow-md dark:border-white/10"
            >
              <CardContent className="flex flex-wrap items-center justify-between gap-4 py-4">
                <div className="flex items-center gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <BookOpen className="h-5 w-5" />
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{c.title}</h3>
                      <Badge variant={c.published ? "default" : "secondary"}>
                        {c.published ? "Published" : "Draft"}
                      </Badge>
                    </div>
                    <p className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Layers className="h-3.5 w-3.5" /> {c._count.sections} sections
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5" /> {c._count.enrollments} students
                      </span>
                      <span className="font-medium text-foreground">
                        {formatPrice(c.price.toString())}
                      </span>
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-md"
                    render={<Link href={`/instructor/courses/${c.id}/questions`} />}
                  >
                    Questions
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-md"
                    render={<Link href={`/instructor/courses/${c.id}/edit`} />}
                  >
                    Manage
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
