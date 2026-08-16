import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/format";
import { BookOpen, ClipboardCheck, Users } from "lucide-react";

export type CourseCardData = {
  slug: string;
  title: string;
  description: string;
  category: string;
  price: number | string;
  instructorName: string;
  hasExam: boolean;
  enrollmentCount?: number;
};

export function CourseCard({ course }: { course: CourseCardData }) {
  return (
    <Link href={`/courses/${course.slug}`} className="group block h-full">
      <Card className="h-full overflow-hidden rounded-2xl border-black/10 p-0 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg dark:border-white/10">
        <div className="relative flex aspect-video items-center justify-center bg-gradient-to-br from-primary to-brand-dark">
          {course.hasExam ? (
            <ClipboardCheck className="h-12 w-12 text-white/90" />
          ) : (
            <BookOpen className="h-12 w-12 text-white/90" />
          )}
          {course.hasExam && (
            <span className="absolute right-4 -bottom-3 rounded-full bg-brand-dark px-4 py-1.5 text-xs font-semibold tracking-wide text-white uppercase shadow-md">
              Exam Prep
            </span>
          )}
        </div>

        <CardContent className="px-5 pt-6 pb-5">
          <Badge variant="secondary" className="mb-2">
            {course.category}
          </Badge>
          <h3 className="font-semibold leading-snug line-clamp-2 group-hover:text-primary transition-colors">
            {course.title}
          </h3>
          <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2">
            {course.description}
          </p>

          <div className="mt-4 flex items-center justify-between border-t border-black/5 pt-4 dark:border-white/10">
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span>{course.instructorName}</span>
              {course.enrollmentCount !== undefined && (
                <span className="flex items-center gap-1">
                  <Users className="h-3.5 w-3.5" /> {course.enrollmentCount}
                </span>
              )}
            </div>
            <span className="text-lg font-bold text-foreground">
              {formatPrice(course.price)}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
