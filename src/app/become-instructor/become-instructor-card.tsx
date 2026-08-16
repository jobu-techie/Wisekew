"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { becomeInstructorAction } from "@/lib/actions/auth";
import { GraduationCap, BookOpen, ClipboardCheck, Users } from "lucide-react";

export function BecomeInstructorCard({ name }: { name: string }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const { update } = useSession();
  const router = useRouter();

  function handleBecomeInstructor() {
    setError(null);
    startTransition(async () => {
      try {
        await becomeInstructorAction();
        await update({ role: "INSTRUCTOR" });
        router.push("/instructor");
      } catch {
        setError("Something went wrong. Please try again.");
      }
    });
  }

  return (
    <Card className="w-full rounded-2xl border-black/10 dark:border-white/10">
      <CardContent className="py-8 text-center">
        <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <GraduationCap className="h-7 w-7" />
        </span>
        <h1 className="text-2xl font-bold tracking-tight">Become an instructor</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Hey {name}, you already have a Wisekew account. Upgrade it to start
          teaching — you&apos;ll keep your learning progress and certificates.
        </p>

        <div className="mt-6 space-y-3 text-left text-sm">
          <div className="flex items-center gap-3">
            <BookOpen className="h-4 w-4 shrink-0 text-primary" />
            <span>Publish video courses with sections and lectures</span>
          </div>
          <div className="flex items-center gap-3">
            <ClipboardCheck className="h-4 w-4 shrink-0 text-primary" />
            <span>Build exam-prep question banks and timed exams</span>
          </div>
          <div className="flex items-center gap-3">
            <Users className="h-4 w-4 shrink-0 text-primary" />
            <span>Reach students and track enrollments</span>
          </div>
        </div>

        {error && <p className="mt-4 text-sm text-destructive">{error}</p>}

        <Button
          size="lg"
          className="mt-8 w-full rounded-md"
          disabled={isPending}
          onClick={handleBecomeInstructor}
        >
          {isPending ? "Upgrading account..." : "Become an instructor"}
        </Button>
      </CardContent>
    </Card>
  );
}
