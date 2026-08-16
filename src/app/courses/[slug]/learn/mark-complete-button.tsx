"use client";

import { useTransition } from "react";
import { CheckCircle2, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { markLectureCompleteAction } from "@/lib/actions/enrollment";

export function MarkCompleteButton({
  lectureId,
  courseId,
  courseSlug,
  isComplete,
}: {
  lectureId: string;
  courseId: string;
  courseSlug: string;
  isComplete: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      variant={isComplete ? "outline" : "default"}
      disabled={isPending || isComplete}
      onClick={() =>
        startTransition(() => markLectureCompleteAction(lectureId, courseId, courseSlug))
      }
    >
      {isComplete ? (
        <>
          <CheckCircle2 className="h-4 w-4" /> Completed
        </>
      ) : (
        <>
          <Circle className="h-4 w-4" /> {isPending ? "Marking..." : "Mark as complete"}
        </>
      )}
    </Button>
  );
}
