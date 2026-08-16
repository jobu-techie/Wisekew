import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AccountForm } from "./account-form";
import { PasswordForm } from "./password-form";
import { ArrowLeft } from "lucide-react";

export async function AccountInformationContent({ basePath }: { basePath: string }) {
  const session = await auth();
  const userId = session!.user.id;

  const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });

  return (
    <div className="space-y-8">
      <div>
        <Link
          href={`${basePath}/account`}
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Account
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Account information</h1>
        <p className="mt-1 text-muted-foreground">
          Update your email address, password, and/or personal information.
        </p>
      </div>

      <Card className="rounded-2xl border-black/10 dark:border-white/10">
        <CardHeader>
          <CardTitle className="text-lg">Personal information</CardTitle>
        </CardHeader>
        <CardContent>
          <AccountForm
            key={`${user.name}|${user.email}|${user.phone}|${user.country}|${user.postalCode}`}
            user={user}
          />
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-black/10 dark:border-white/10">
        <CardHeader>
          <CardTitle className="text-lg">Change password</CardTitle>
        </CardHeader>
        <CardContent>
          <PasswordForm />
        </CardContent>
      </Card>
    </div>
  );
}
