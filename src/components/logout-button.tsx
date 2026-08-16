"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="rounded-md"
      onClick={() => signOut({ callbackUrl: "/" })}
    >
      Log out
    </Button>
  );
}
