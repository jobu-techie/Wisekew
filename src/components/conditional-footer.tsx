"use client";

import { usePathname } from "next/navigation";
import { SiteFooter } from "./site-footer";

const HIDE_FOOTER_PREFIXES = ["/dashboard", "/instructor"];

export function ConditionalFooter() {
  const pathname = usePathname();
  if (HIDE_FOOTER_PREFIXES.some((prefix) => pathname.startsWith(prefix))) return null;
  return <SiteFooter />;
}
