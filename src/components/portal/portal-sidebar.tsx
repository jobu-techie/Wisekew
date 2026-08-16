"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Bell, MonitorPlay, UserCircle, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function PortalSidebar({ basePath }: { basePath: string }) {
  const pathname = usePathname();

  const navItems = [
    { href: basePath, label: "Dashboard", icon: LayoutDashboard },
    { href: `${basePath}/notifications`, label: "Notifications", icon: Bell },
    { href: `${basePath}/free-demos`, label: "Free Demos", icon: MonitorPlay },
    { href: `${basePath}/account`, label: "Account", icon: UserCircle },
    { href: `${basePath}/help`, label: "Help", icon: HelpCircle },
  ];

  return (
    <aside className="fixed top-18 bottom-0 left-0 z-30 hidden w-56 overflow-y-auto bg-stone-900 px-4 py-6 sm:block">
      <nav className="space-y-1">
        {navItems.map((item) => {
          const isActive =
            item.href === basePath ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-white/10 text-white"
                  : "text-stone-400 hover:bg-white/5 hover:text-stone-200",
              )}
            >
              <item.icon className={cn("h-4 w-4 shrink-0", isActive && "text-primary")} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
