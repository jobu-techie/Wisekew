import { auth } from "@/auth";
import { PortalShell } from "@/components/portal/portal-shell";

export default async function InstructorLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <PortalShell
      label="Instructor Portal"
      basePath="/instructor"
      role="instructor"
      userName={session!.user.name!}
    >
      {children}
    </PortalShell>
  );
}
