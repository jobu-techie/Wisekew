import { Card, CardContent } from "@/components/ui/card";
import { Mail, MapPin, Phone } from "lucide-react";

const FAQS = [
  {
    q: "How do I create a course?",
    a: "Click New Course in the sidebar, then add sections and lectures from the course's edit page.",
  },
  {
    q: "How do I publish a course so students can see it?",
    a: "Open the course from your Dashboard and use the Publish toggle on its edit page. Unpublished courses are only visible to you.",
  },
  {
    q: "How do I add a practice exam?",
    a: "From a course's edit page, click Manage exams to create a question bank, add questions, and configure a timed exam.",
  },
  {
    q: "How do I see who's enrolled or how much I've earned?",
    a: "Your Dashboard shows student counts and revenue per course, and the stats cards at the top summarize everything.",
  },
  {
    q: "How do I update my email, phone, or password?",
    a: "Go to Account to update your personal information or change your password.",
  },
];

export function InstructorHelpContent() {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">Help</h1>
      <p className="mt-1 text-muted-foreground">
        Answers to common questions, or reach out to us directly.
      </p>

      <div className="mt-8 space-y-3">
        {FAQS.map((item) => (
          <Card key={item.q} className="rounded-2xl border-black/10 dark:border-white/10">
            <CardContent className="py-4">
              <p className="font-medium">{item.q}</p>
              <p className="mt-1 text-sm text-muted-foreground">{item.a}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-8 rounded-2xl border-black/10 dark:border-white/10">
        <CardContent className="space-y-3 py-5">
          <p className="font-medium">Still need help?</p>
          <div className="flex items-start gap-2 text-sm text-muted-foreground">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
            <span>Contrust House, Moi Avenue, 2nd Floor, Room 13, Nairobi</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Phone className="h-4 w-4 shrink-0" />
            <a href="tel:+254792491291" className="hover:text-primary">
              +254 792 491 291
            </a>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Mail className="h-4 w-4 shrink-0" />
            <a href="mailto:info@wisekew.com" className="hover:text-primary">
              info@wisekew.com
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
