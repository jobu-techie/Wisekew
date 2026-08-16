import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { VideoPlayer } from "@/components/video-player";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import { ArrowLeft } from "lucide-react";

export async function FreeDemoDetailContent({
  basePath,
  slug,
}: {
  basePath: string;
  slug: string;
}) {
  const course = await prisma.course.findFirst({
    where: { slug, published: true },
    include: {
      instructor: { select: { name: true } },
      sections: {
        orderBy: { order: "asc" },
        take: 1,
        include: { lectures: { orderBy: { order: "asc" }, take: 1 } },
      },
    },
  });
  if (!course) notFound();

  const demoLecture = course.sections[0]?.lectures[0];
  if (!demoLecture) notFound();

  return (
    <div className="max-w-3xl">
      <Link
        href={`${basePath}/free-demos`}
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" /> Back to free demos
      </Link>

      <VideoPlayer url={demoLecture.videoUrl} />

      <h1 className="mt-4 text-xl font-semibold">{demoLecture.title}</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {course.title} · {course.instructor.name}
      </p>

      <div className="mt-6 flex items-center justify-between rounded-2xl border border-black/10 p-5 dark:border-white/10">
        <div>
          <p className="font-medium">Unlock the full course</p>
          <p className="text-sm text-muted-foreground">
            Enroll to access every lecture, question bank, and practice exam.
          </p>
        </div>
        <Button
          className="shrink-0 rounded-md"
          render={<Link href={`/courses/${course.slug}`} />}
        >
          Enroll · {formatPrice(course.price.toString())}
        </Button>
      </div>
    </div>
  );
}
