"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { promoteToInstructorAction } from "@/lib/actions/auth";
import { GraduationCap } from "lucide-react";

export function PromoteToInstructorButton({ userId }: { userId: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      size="sm"
      className="gap-1.5 rounded-md"
      disabled={isPending}
      onClick={() => startTransition(() => promoteToInstructorAction(userId))}
    >
      <GraduationCap className="h-4 w-4" />
      {isPending ? "Promoting..." : "Promote to Instructor"}
    </Button>
  );
}
