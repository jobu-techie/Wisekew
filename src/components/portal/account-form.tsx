"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { updateAccountAction, type AccountState } from "@/lib/actions/account";
import type { User } from "@/generated/prisma/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { COUNTRIES } from "@/lib/countries";

export function AccountForm({ user }: { user: User }) {
  const [state, formAction, isPending] = useActionState<AccountState, FormData>(
    updateAccountAction,
    {},
  );
  const { update } = useSession();
  const router = useRouter();
  const [country, setCountry] = useState(user.country ?? "Kenya");
  const nameParts = user.name.trim().split(/\s+/);
  const firstName = nameParts[0] ?? "";
  const lastName = nameParts.slice(1).join(" ");

  useEffect(() => {
    if (state.success) {
      update({ name: state.name, email: state.email }).then(() => router.refresh());
    }
  }, [state.success, state.name, state.email, update, router]);

  return (
    <form action={formAction} className="space-y-4">
      {state.error && (
        <Alert variant="destructive">
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}
      {state.success && (
        <Alert>
          <AlertDescription>Your account information has been updated.</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="firstName">First name</Label>
          <Input id="firstName" name="firstName" defaultValue={firstName} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last name</Label>
          <Input id="lastName" name="lastName" defaultValue={lastName} required />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" defaultValue={user.email} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone number</Label>
        <Input id="phone" name="phone" type="tel" defaultValue={user.phone ?? ""} required />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="country">Country</Label>
          <input type="hidden" name="country" value={country} />
          <Select value={country} onValueChange={(v) => setCountry(v ?? "Kenya")}>
            <SelectTrigger id="country" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {COUNTRIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="postalCode">ZIP/Postal code</Label>
          <Input
            id="postalCode"
            name="postalCode"
            defaultValue={user.postalCode ?? ""}
            required
          />
        </div>
      </div>

      <Button type="submit" className="rounded-md" disabled={isPending}>
        {isPending ? "Saving..." : "Save changes"}
      </Button>
    </form>
  );
}
