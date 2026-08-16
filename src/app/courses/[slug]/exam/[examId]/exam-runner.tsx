"use client";

import { useEffect, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { submitExamAttemptAction } from "@/lib/actions/exams";
import { Clock } from "lucide-react";

type Question = { id: string; text: string; choices: string[] };

export function ExamRunner({
  examId,
  examTitle,
  courseSlug,
  timeLimitMinutes,
  questions,
}: {
  examId: string;
  examTitle: string;
  courseSlug: string;
  timeLimitMinutes: number;
  questions: Question[];
}) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [secondsLeft, setSecondsLeft] = useState(timeLimitMinutes * 60);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft((s) => Math.max(0, s - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (secondsLeft === 0 && !isPending) {
      handleSubmit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft]);

  function handleSubmit() {
    startTransition(() => {
      submitExamAttemptAction(
        examId,
        courseSlug,
        questions.map((q) => q.id),
        answers,
      );
    });
  }

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const answeredCount = Object.keys(answers).length;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold">{examTitle}</h1>
        <div className="flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm font-medium">
          <Clock className="h-4 w-4" />
          {minutes}:{seconds.toString().padStart(2, "0")}
        </div>
      </div>

      <p className="mb-4 text-sm text-muted-foreground">
        {answeredCount} / {questions.length} answered
      </p>

      <div className="space-y-6">
        {questions.map((q, idx) => (
          <Card key={q.id}>
            <CardContent className="py-4">
              <p className="mb-3 font-medium">
                {idx + 1}. {q.text}
              </p>
              <RadioGroup
                value={answers[q.id]?.toString() ?? ""}
                onValueChange={(v) =>
                  setAnswers((prev) => ({ ...prev, [q.id]: parseInt(v, 10) }))
                }
                className="space-y-2"
              >
                {q.choices.map((choice, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <RadioGroupItem value={i.toString()} id={`${q.id}-${i}`} />
                    <Label htmlFor={`${q.id}-${i}`} className="font-normal">
                      {choice}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>
        ))}
      </div>

      <Button className="mt-6 w-full" size="lg" disabled={isPending} onClick={handleSubmit}>
        {isPending ? "Submitting..." : "Submit exam"}
      </Button>
    </div>
  );
}
