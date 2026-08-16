"use client";

import { useActionState, useState } from "react";
import { signupAction, type SignupState } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { COUNTRIES } from "@/lib/countries";

export function SignupForm() {
  const [state, formAction, isPending] = useActionState<SignupState, FormData>(
    signupAction,
    {},
  );
  const [role, setRole] = useState<"STUDENT" | "INSTRUCTOR">("STUDENT");
  const [country, setCountry] = useState("Kenya");

  return (
    <form action={formAction} className="space-y-4">
      {state.error && (
        <Alert variant="destructive">
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="firstName">First name</Label>
          <Input
            id="firstName"
            name="firstName"
            required
            autoComplete="given-name"
            className="h-11 rounded-xl"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last name</Label>
          <Input
            id="lastName"
            name="lastName"
            required
            autoComplete="family-name"
            className="h-11 rounded-xl"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="h-11 rounded-xl"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmEmail">Confirm email</Label>
        <Input
          id="confirmEmail"
          name="confirmEmail"
          type="email"
          required
          autoComplete="email"
          className="h-11 rounded-xl"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone number</Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          required
          autoComplete="tel"
          className="h-11 rounded-xl"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="country">Country</Label>
          <input type="hidden" name="country" value={country} />
          <Select value={country} onValueChange={(v) => setCountry(v ?? "Kenya")}>
            <SelectTrigger id="country" className="h-11 w-full rounded-xl">
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
            required
            autoComplete="postal-code"
            className="h-11 rounded-xl"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <PasswordInput
          id="password"
          name="password"
          required
          minLength={8}
          autoComplete="new-password"
          className="h-11 rounded-xl"
        />
      </div>

      <div className="space-y-2">
        <Label>I want to</Label>
        <input type="hidden" name="role" value={role} />
        <RadioGroup
          value={role}
          onValueChange={(v) => setRole(v as "STUDENT" | "INSTRUCTOR")}
          className="grid grid-cols-2 gap-3"
        >
          <Label
            htmlFor="role-student"
            className={`flex cursor-pointer items-center gap-2 rounded-xl border p-3 text-sm font-normal transition-colors ${
              role === "STUDENT" ? "border-primary bg-primary/5" : "border-input"
            }`}
          >
            <RadioGroupItem value="STUDENT" id="role-student" />
            Learn
          </Label>
          <Label
            htmlFor="role-instructor"
            className={`flex cursor-pointer items-center gap-2 rounded-xl border p-3 text-sm font-normal transition-colors ${
              role === "INSTRUCTOR" ? "border-primary bg-primary/5" : "border-input"
            }`}
          >
            <RadioGroupItem value="INSTRUCTOR" id="role-instructor" />
            Teach
          </Label>
        </RadioGroup>
      </div>

      <Button type="submit" className="h-11 w-full rounded-md" disabled={isPending}>
        {isPending ? "Creating account..." : "Create account"}
      </Button>
    </form>
  );
}
