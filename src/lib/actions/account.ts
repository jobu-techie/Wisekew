"use server";

import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

const accountSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(7, "Enter a valid phone number"),
  country: z.string().min(1, "Country is required"),
  postalCode: z.string().min(1, "ZIP/postal code is required"),
});

export type AccountState = {
  error?: string;
  success?: boolean;
  name?: string;
  email?: string;
};

export async function updateAccountAction(
  _prevState: AccountState,
  formData: FormData,
): Promise<AccountState> {
  const session = await auth();
  if (!session?.user) return { error: "Not authenticated" };

  const parsed = accountSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    country: formData.get("country"),
    postalCode: formData.get("postalCode"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const { firstName, lastName, email, phone, country, postalCode } = parsed.data;
  const name = `${firstName} ${lastName}`;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing && existing.id !== session.user.id) {
    return { error: "An account with this email already exists" };
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { name, email, phone, country, postalCode },
  });

  return { success: true, name, email };
}

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "New password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "New passwords do not match",
    path: ["confirmPassword"],
  });

export type PasswordState = {
  error?: string;
  success?: boolean;
};

export async function changePasswordAction(
  _prevState: PasswordState,
  formData: FormData,
): Promise<PasswordState> {
  const session = await auth();
  if (!session?.user) return { error: "Not authenticated" };

  const parsed = passwordSchema.safeParse({
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) return { error: "Not authenticated" };

  const valid = await bcrypt.compare(parsed.data.currentPassword, user.passwordHash);
  if (!valid) return { error: "Current password is incorrect" };

  const passwordHash = await bcrypt.hash(parsed.data.newPassword, 10);
  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash },
  });

  return { success: true };
}
