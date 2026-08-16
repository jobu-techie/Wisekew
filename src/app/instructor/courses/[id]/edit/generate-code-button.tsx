"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { generateAccessCodeAction } from "@/lib/actions/access-codes";
import { PlusCircle } from "lucide-react";

export function GenerateCodeButton({ courseId }: { courseId: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className="gap-1.5 rounded-md"
      disabled={isPending}
      onClick={() => startTransition(() => generateAccessCodeAction(courseId))}
    >
      <PlusCircle className="h-3.5 w-3.5" />
      {isPending ? "Generating..." : "Generate code"}
    </Button>
  );
}
