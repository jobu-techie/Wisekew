import { Card, CardContent } from "@/components/ui/card";
import { Mail, MapPin, Phone } from "lucide-react";

const FAQS = [
  {
    q: "How do I access a course I've enrolled in?",
    a: "Go to Dashboard and click any course under \"Your courses\" to jump straight into the lecture player.",
  },
  {
    q: "How do I get a certificate?",
    a: "Complete every lecture in a course and your certificate appears automatically under Dashboard → Certificates.",
  },
  {
    q: "Can I try a course before buying it?",
    a: "Yes — open Free Demos in the sidebar to preview a lecture from any published course.",
  },
  {
    q: "How do I update my email, phone, or password?",
    a: "Go to Account to update your personal information or change your password.",
  },
  {
    q: "I want to teach on Wisekew. How do I start?",
    a: "Visit Become an Instructor from the Teach menu to upgrade your account — you'll keep your learning progress.",
  },
];

export function HelpContent() {
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
