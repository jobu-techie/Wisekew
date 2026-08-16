import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GraduationCap, BookOpen, ClipboardCheck, Users, Mail } from "lucide-react";

export function BecomeInstructorCard({ name, email }: { name: string; email: string }) {
  const subject = encodeURIComponent("Instructor application - Wisekew");
  const body = encodeURIComponent(
    `Hi Wisekew team,\n\nI'd like to apply to become an instructor on Wisekew.\n\nName: ${name}\nAccount email: ${email}\nWhat I'd like to teach: \n\nThanks!`,
  );
  const mailtoHref = `mailto:info@wisekew.com?subject=${subject}&body=${body}`;

  return (
    <Card className="w-full rounded-2xl border-black/10 dark:border-white/10">
      <CardContent className="py-8 text-center">
        <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <GraduationCap className="h-7 w-7" />
        </span>
        <h1 className="text-2xl font-bold tracking-tight">Become an instructor</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Hey {name}, want to teach on Wisekew? Send our team a quick email and
          we&apos;ll set up your instructor account for you.
        </p>

        <div className="mt-6 space-y-3 text-left text-sm">
          <div className="flex items-center gap-3">
            <BookOpen className="h-4 w-4 shrink-0 text-primary" />
            <span>Publish video courses with sections and lectures</span>
          </div>
          <div className="flex items-center gap-3">
            <ClipboardCheck className="h-4 w-4 shrink-0 text-primary" />
            <span>Build exam-prep question banks and timed exams</span>
          </div>
          <div className="flex items-center gap-3">
            <Users className="h-4 w-4 shrink-0 text-primary" />
            <span>Reach students and track enrollments</span>
          </div>
        </div>

        <Button size="lg" className="mt-8 w-full gap-2 rounded-md" render={<a href={mailtoHref} />}>
          <Mail className="h-4 w-4" />
          Email us to apply
        </Button>
      </CardContent>
    </Card>
  );
}
