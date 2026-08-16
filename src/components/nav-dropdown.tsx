"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLinkItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type NavDropdownLink = {
  label: string;
  href: string;
  separatorBefore?: boolean;
};

export function NavDropdown({ label, links }: { label: string; links: NavDropdownLink[] }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-1 text-foreground/70 outline-none transition-colors hover:text-primary data-popup-open:text-primary">
        {label}
        <ChevronDown className="h-3.5 w-3.5" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-52">
        {links.map((link) => (
          <div key={link.href}>
            {link.separatorBefore && <DropdownMenuSeparator />}
            <DropdownMenuLinkItem render={<Link href={link.href} />}>
              {link.label}
            </DropdownMenuLinkItem>
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
