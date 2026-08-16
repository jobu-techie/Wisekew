import { notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EditCourseForm } from "./edit-course-form";
import { PublishToggle } from "./publish-toggle";
import { SectionManager } from "./section-manager";

export const dynamic = "force-dynamic";

export default async function EditCoursePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  const user = session!.user;

  const course = await prisma.course.findUnique({
    where: { id },
    include: {
      sections: {
        orderBy: { order: "asc" },
        include: { lectures: { orderBy: { order: "asc" } } },
      },
    },
  });

  if (!course || (course.instructorId !== user.id && user.role !== "ADMIN")) notFound();

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Link href="/instructor" className="text-sm text-muted-foreground hover:underline">
            &larr; Back to your courses
          </Link>
          <h1 className="mt-1 text-2xl font-bold tracking-tight">{course.title}</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="rounded-md"
            render={<Link href={`/instructor/courses/${course.id}/questions`} />}
          >
            Manage exams
          </Button>
          <PublishToggle courseId={course.id} published={course.published} />
        </div>
      </div>

      <Card className="mb-8 rounded-2xl border-black/10 dark:border-white/10">
        <CardHeader>
          <CardTitle className="text-lg">Course details</CardTitle>
        </CardHeader>
        <CardContent>
          <EditCourseForm course={{ ...course, price: course.price.toString() }} />
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-black/10 dark:border-white/10">
        <CardHeader>
          <CardTitle className="text-lg">Curriculum</CardTitle>
        </CardHeader>
        <CardContent>
          <SectionManager courseId={course.id} sections={course.sections} />
        </CardContent>
      </Card>
    </div>
  );
}
