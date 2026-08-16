"use client";

import { useActionState } from "react";
import Link from "next/link";
import { redeemAccessCodeAction, type RedeemState } from "@/lib/actions/access-codes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function RedeemCodeForm() {
  const [state, formAction, isPending] = useActionState<RedeemState, FormData>(
    redeemAccessCodeAction,
    {},
  );

  if (state.success) {
    return (
      <Alert>
        <AlertDescription>
          Code redeemed! You now have access to{" "}
          <Link href={`/courses/${state.courseSlug}/learn`} className="font-medium underline">
            {state.courseTitle}
          </Link>
          .
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      {state.error && (
        <Alert variant="destructive">
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="code">Access Code</Label>
        <Input
          id="code"
          name="code"
          required
          placeholder="e.g. A1B2C3D4E5"
          className="uppercase"
          autoComplete="off"
        />
      </div>

      <Button type="submit" className="w-full rounded-md" disabled={isPending}>
        {isPending ? "Checking..." : "Register Access Code"}
      </Button>
    </form>
  );
}
