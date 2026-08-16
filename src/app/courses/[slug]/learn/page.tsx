import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { VideoPlayer } from "@/components/video-player";
import { MarkCompleteButton } from "./mark-complete-button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Circle, ClipboardList } from "lucide-react";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function LearnPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ lecture?: string }>;
}) {
  const { slug } = await params;
  const { lecture: lectureParam } = await searchParams;

  const session = await auth();
  if (!session?.user) redirect(`/login?callbackUrl=/courses/${slug}/learn`);
  const userId = session.user.id;

  const course = await prisma.course.findUnique({
    where: { slug },
    include: {
      sections: {
        orderBy: { order: "asc" },
        include: { lectures: { orderBy: { order: "asc" } } },
      },
      questionBanks: { include: { exams: true } },
    },
  });
  if (!course) notFound();

  const enrollment = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId, courseId: course.id } },
  });
  if (!enrollment) redirect(`/courses/${slug}`);

  const allLectures = course.sections.flatMap((s) => s.lectures);
  if (allLectures.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center text-muted-foreground">
        This course doesn&apos;t have any lectures yet.
      </div>
    );
  }

  const progressRecords = await prisma.lectureProgress.findMany({
    where: { userId, lectureId: { in: allLectures.map((l) => l.id) } },
  });
  const completedIds = new Set(progressRecords.map((p) => p.lectureId));

  const currentLecture =
    allLectures.find((l) => l.id === lectureParam) ??
    allLectures.find((l) => !completedIds.has(l.id)) ??
    allLectures[0];

  const progressPct = Math.round((completedIds.size / allLectures.length) * 100);
  const isCurrentComplete = completedIds.has(currentLecture.id);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6">
        <Link href={`/courses/${slug}`} className="text-sm text-muted-foreground hover:underline">
          &larr; {course.title}
        </Link>
        <div className="mt-2 flex items-center gap-3">
          <Progress value={progressPct} className="h-2 max-w-sm" />
          <span className="text-sm text-muted-foreground">{progressPct}% complete</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <VideoPlayer url={currentLecture.videoUrl} />

          <div className="mt-4 flex items-center justify-between">
            <h1 className="text-xl font-semibold">{currentLecture.title}</h1>
            <MarkCompleteButton
              lectureId={currentLecture.id}
              courseId={course.id}
              courseSlug={slug}
              isComplete={isCurrentComplete}
            />
          </div>

          {currentLecture.content && (
            <p className="mt-4 whitespace-pre-wrap text-muted-foreground">
              {currentLecture.content}
            </p>
          )}

          {course.questionBanks.some((b) => b.exams.length > 0) && (
            <div className="mt-8 rounded-lg border p-4">
              <h2 className="mb-3 font-medium">Practice exams</h2>
              <ul className="space-y-2">
                {course.questionBanks.flatMap((bank) =>
                  bank.exams.map((exam) => (
                    <li key={exam.id}>
                      <Link
                        href={`/courses/${slug}/exam/${exam.id}`}
                        className="flex items-center justify-between rounded border p-3 text-sm hover:bg-accent"
                      >
                        <span className="flex items-center gap-2">
                          <ClipboardList className="h-4 w-4" /> {exam.title}
                        </span>
                        <span className="text-muted-foreground">
                          {exam.numQuestions} Q · {exam.timeLimitMinutes} min
                        </span>
                      </Link>
                    </li>
                  )),
                )}
              </ul>
            </div>
          )}
        </div>

        <aside className="space-y-6">
          {course.sections.map((section) => (
            <div key={section.id}>
              <h3 className="mb-2 text-sm font-semibold text-muted-foreground">
                {section.title}
              </h3>
              <ul className="space-y-1">
                {section.lectures.map((lecture) => {
                  const isDone = completedIds.has(lecture.id);
                  const isActive = lecture.id === currentLecture.id;
                  return (
                    <li key={lecture.id}>
                      <Link
                        href={`/courses/${slug}/learn?lecture=${lecture.id}`}
                        className={cn(
                          "flex items-center gap-2 rounded px-2 py-1.5 text-sm",
                          isActive ? "bg-accent font-medium" : "hover:bg-accent/50",
                        )}
                      >
                        {isDone ? (
                          <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                        ) : (
                          <Circle className="h-4 w-4 shrink-0 text-muted-foreground" />
                        )}
                        {lecture.title}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </aside>
      </div>
    </div>
  );
}
