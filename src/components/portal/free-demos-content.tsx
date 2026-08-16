import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, ClipboardCheck, PlayCircle } from "lucide-react";

export async function FreeDemosContent({ basePath }: { basePath: string }) {
  const courses = await prisma.course.findMany({
    where: { published: true, sections: { some: { lectures: { some: {} } } } },
    include: {
      instructor: { select: { name: true } },
      questionBanks: { select: { id: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">Free Demos</h1>
      <p className="mt-1 text-muted-foreground">
        Try a course for free and see why students choose Wisekew.
      </p>

      {courses.length === 0 ? (
        <p className="mt-8 text-sm text-muted-foreground">No demos available yet.</p>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((c) => (
            <Link key={c.id} href={`${basePath}/free-demos/${c.slug}`} className="group block h-full">
              <Card className="h-full overflow-hidden rounded-2xl border-black/10 p-0 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg dark:border-white/10">
                <div className="relative flex aspect-video items-center justify-center bg-gradient-to-br from-primary to-brand-dark">
                  {c.questionBanks.length > 0 ? (
                    <ClipboardCheck className="h-12 w-12 text-white/90" />
                  ) : (
                    <BookOpen className="h-12 w-12 text-white/90" />
                  )}
                </div>
                <CardContent className="px-5 pt-6 pb-5">
                  <Badge variant="secondary" className="mb-2">
                    {c.category}
                  </Badge>
                  <h3 className="font-semibold leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                    {c.title}
                  </h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">{c.instructor.name}</p>
                  <span className="mt-4 flex items-center gap-1.5 text-sm font-medium text-primary">
                    <PlayCircle className="h-4 w-4" /> Watch free demo
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
