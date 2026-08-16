import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { RedeemCodeForm } from "./redeem-code-form";
import { ArrowLeft } from "lucide-react";

export default function RedeemAccessCodePage() {
  return (
    <div className="max-w-md">
      <Link
        href="/dashboard/account"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Account
      </Link>
      <h1 className="text-3xl font-bold tracking-tight">Redeem Access Code</h1>
      <p className="mt-1 text-muted-foreground">
        Have an access code? Enter it below to unlock a course.
      </p>

      <Card className="mt-8 rounded-2xl border-black/10 dark:border-white/10">
        <CardContent className="py-6">
          <RedeemCodeForm />
        </CardContent>
      </Card>
    </div>
  );
}
