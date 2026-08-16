"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { enrollAction } from "@/lib/actions/enrollment";

export function EnrollButton({
  courseId,
  courseSlug,
  isEnrolled,
}: {
  courseId: string;
  courseSlug: string;
  isEnrolled: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  if (isEnrolled) {
    return (
      <Button className="w-full" onClick={() => router.push(`/courses/${courseSlug}/learn`)}>
        Go to course
      </Button>
    );
  }

  return (
    <Button
      className="w-full"
      disabled={isPending}
      onClick={() => startTransition(() => enrollAction(courseId, courseSlug))}
    >
      {isPending ? "Enrolling..." : "Enroll now"}
    </Button>
  );
}
