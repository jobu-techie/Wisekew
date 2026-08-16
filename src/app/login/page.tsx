import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { AuthBrandPanel } from "@/components/auth-brand-panel";
import { LoginForm } from "./login-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const { callbackUrl } = await searchParams;

  return (
    <div className="grid min-h-[calc(100vh-4.5rem)] grid-cols-1 lg:grid-cols-2">
      <AuthBrandPanel />

      <div className="flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-sm">
          <Link
            href="/"
            className="mb-8 flex items-center gap-1.5 text-lg font-bold tracking-tight lg:hidden"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-white">
              <GraduationCap className="h-4 w-4" />
            </span>
            Wise<span className="text-primary">kew</span>
          </Link>

          <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Log in to continue learning on Wisekew.
          </p>

          <div className="mt-8">
            <LoginForm callbackUrl={callbackUrl ?? "/dashboard"} />
          </div>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="font-medium text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
