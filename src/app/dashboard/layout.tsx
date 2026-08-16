import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { PortalShell } from "@/components/portal/portal-shell";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (session!.user.role === "ADMIN") redirect("/admin");
  if (session!.user.role === "INSTRUCTOR") redirect("/instructor");

  return (
    <PortalShell
      label="Student Portal"
      basePath="/dashboard"
      role="student"
      userName={session!.user.name!}
    >
      {children}
    </PortalShell>
  );
}
