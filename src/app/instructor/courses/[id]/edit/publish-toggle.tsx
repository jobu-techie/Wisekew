"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { togglePublishAction } from "@/lib/actions/courses";

export function PublishToggle({
  courseId,
  published,
}: {
  courseId: string;
  published: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      variant={published ? "outline" : "default"}
      className="rounded-md"
      disabled={isPending}
      onClick={() => startTransition(() => togglePublishAction(courseId))}
    >
      {isPending ? "Saving..." : published ? "Unpublish" : "Publish"}
    </Button>
  );
}
