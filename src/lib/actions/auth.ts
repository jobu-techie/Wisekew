"use server";

import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth, signIn } from "@/auth";

const signupSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email"),
    confirmEmail: z.string().email("Invalid email"),
    phone: z.string().min(7, "Enter a valid phone number"),
    country: z.string().min(1, "Country is required"),
    postalCode: z.string().min(1, "ZIP/postal code is required"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    role: z.enum(["STUDENT", "INSTRUCTOR"]),
  })
  .refine((data) => data.email === data.confirmEmail, {
    message: "Email addresses do not match",
    path: ["confirmEmail"],
  });

export type SignupState = {
  error?: string;
};

export async function signupAction(
  _prevState: SignupState,
  formData: FormData,
): Promise<SignupState> {
  const parsed = signupSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    confirmEmail: formData.get("confirmEmail"),
    phone: formData.get("phone"),
    country: formData.get("country"),
    postalCode: formData.get("postalCode"),
    password: formData.get("password"),
    role: formData.get("role"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const { firstName, lastName, email, phone, country, postalCode, password, role } = parsed.data;
  const name = `${firstName} ${lastName}`;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "An account with this email already exists" };
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: { name, email, phone, country, postalCode, passwordHash, role },
  });

  await signIn("credentials", {
    email,
    password,
    redirectTo: role === "INSTRUCTOR" ? "/instructor" : "/dashboard",
  });

  return {};
}

export async function becomeInstructorAction() {
  const session = await auth();
  if (!session?.user) throw new Error("Not authenticated");
  if (session.user.role !== "STUDENT") return;

  await prisma.user.update({
    where: { id: session.user.id },
    data: { role: "INSTRUCTOR" },
  });
}
