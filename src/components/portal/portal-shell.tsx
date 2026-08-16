import Link from "next/link";
import { PortalSidebar } from "./portal-sidebar";

export function PortalShell({
  label,
  basePath,
  userName,
  children,
}: {
  label: string;
  basePath: string;
  userName: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <PortalSidebar basePath={basePath} />

      <div className="sm:pl-56">
        <div className="border-b border-black/5 bg-slate-100 dark:border-white/10 dark:bg-muted/20">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2.5">
            <span className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
              {label}
            </span>
            <Link href={`${basePath}/account`} className="text-sm font-medium hover:text-primary">
              {userName}
            </Link>
          </div>
        </div>

        <div className="mx-auto max-w-6xl px-4 py-8">{children}</div>
      </div>
    </div>
  );
}
