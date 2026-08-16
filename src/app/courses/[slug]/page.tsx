import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { formatPrice, formatDuration } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { EnrollButton } from "./enroll-button";
import { PlayCircle, FileText, ClipboardList } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const course = await prisma.course.findUnique({
    where: { slug },
    include: {
      instructor: { select: { name: true } },
      sections: {
        orderBy: { order: "asc" },
        include: { lectures: { orderBy: { order: "asc" } } },
      },
      questionBanks: {
        include: { exams: true, questions: { select: { id: true } } },
      },
    },
  });

  if (!course || !course.published) notFound();

  const session = await auth();
  const isEnrolled = session?.user
    ? !!(await prisma.enrollment.findUnique({
        where: { userId_courseId: { userId: session.user.id, courseId: course.id } },
      }))
    : false;

  const lectureCount = course.sections.reduce((sum, s) => sum + s.lectures.length, 0);
  const examCount = course.questionBanks.reduce((sum, b) => sum + b.exams.length, 0);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Badge variant="secondary">{course.category}</Badge>
          <h1 className="mt-3 text-3xl font-bold tracking-tight">{course.title}</h1>
          <p className="mt-3 text-muted-foreground">{course.description}</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Created by <span className="font-medium text-foreground">{course.instructor.name}</span>
          </p>

          <div className="mt-6 flex gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <PlayCircle className="h-4 w-4" /> {lectureCount} lectures
            </span>
            {examCount > 0 && (
              <span className="flex items-center gap-1.5">
                <ClipboardList className="h-4 w-4" /> {examCount} practice exams
              </span>
            )}
          </div>

          <h2 className="mt-10 mb-4 text-xl font-semibold">Curriculum</h2>
          <div className="space-y-4">
            {course.sections.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Curriculum coming soon.
              </p>
            )}
            {course.sections.map((section) => (
              <Card key={section.id}>
                <CardContent className="py-4">
                  <h3 className="font-medium mb-2">{section.title}</h3>
                  <ul className="space-y-1.5">
                    {section.lectures.map((lecture) => (
                      <li
                        key={lecture.id}
                        className="flex items-center justify-between text-sm text-muted-foreground"
                      >
                        <span className="flex items-center gap-2">
                          <FileText className="h-3.5 w-3.5" />
                          {lecture.title}
                        </span>
                        {lecture.duration && <span>{formatDuration(lecture.duration)}</span>}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          {course.questionBanks.length > 0 && (
            <>
              <h2 className="mt-10 mb-4 text-xl font-semibold">Practice Exams</h2>
              <div className="space-y-4">
                {course.questionBanks.map((bank) => (
                  <Card key={bank.id}>
                    <CardContent className="py-4">
                      <h3 className="font-medium mb-1">{bank.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {bank.questions.length} questions in bank
                      </p>
                      <ul className="space-y-1.5">
                        {bank.exams.map((exam) => (
                          <li
                            key={exam.id}
                            className="flex items-center justify-between text-sm text-muted-foreground"
                          >
                            <span className="flex items-center gap-2">
                              <ClipboardList className="h-3.5 w-3.5" />
                              {exam.title}
                            </span>
                            <span>
                              {exam.numQuestions} Q · {exam.timeLimitMinutes} min
                            </span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>

        <div>
          <Card className="sticky top-24">
            <CardContent className="py-6">
              <p className="text-3xl font-bold mb-4">{formatPrice(course.price.toString())}</p>
              <EnrollButton
                courseId={course.id}
                courseSlug={course.slug}
                isEnrolled={isEnrolled}
              />
              <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
                <li>Full lifetime access</li>
                <li>Access on all devices</li>
                {examCount > 0 && <li>Timed practice exams with explanations</li>}
                <li>Certificate of completion</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
