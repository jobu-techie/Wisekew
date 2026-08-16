"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { togglePublishAction } from "@/lib/actions/courses";

export function AdminPublishToggle({
  courseId,
  published,
}: {
  courseId: string;
  published: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      variant="ghost"
      size="sm"
      disabled={isPending}
      onClick={() => startTransition(() => togglePublishAction(courseId))}
    >
      {isPending ? "..." : published ? "Unpublish" : "Publish"}
    </Button>
  );
}
