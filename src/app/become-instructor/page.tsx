import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { BecomeInstructorCard } from "./become-instructor-card";

export default async function BecomeInstructorPage() {
  const session = await auth();

  if (!session?.user) redirect("/signup");
  if (session.user.role !== "STUDENT") redirect("/instructor");

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md items-center px-4">
      <BecomeInstructorCard name={session.user.name ?? "there"} email={session.user.email ?? ""} />
    </div>
  );
}
