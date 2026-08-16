import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight, UserCircle, CreditCard, Ticket, RefreshCw } from "lucide-react";

export function AccountMenuContent({
  basePath,
  role,
}: {
  basePath: string;
  role: "student" | "instructor";
}) {
  const links = [
    {
      href: `${basePath}/account/information`,
      icon: UserCircle,
      title: "Account Information",
      description: "Update your email address, password, and/or personal information.",
    },
    {
      href: `${basePath}/account/purchases`,
      icon: CreditCard,
      title: "Purchase History",
      description: "View details of your order history.",
    },
    ...(role === "student"
      ? [
          {
            href: `${basePath}/account/redeem`,
            icon: Ticket,
            title: "Redeem Access Code",
            description: "Have an access code? Enter it below to unlock a course.",
          },
          {
            href: `${basePath}/account/updates`,
            icon: RefreshCw,
            title: "Course Updates",
            description: "See what's changed in the courses you're enrolled in.",
          },
        ]
      : []),
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">Account</h1>

      <div className="mt-8 space-y-3">
        {links.map((item) => (
          <Link key={item.href} href={item.href}>
            <Card className="rounded-2xl border-black/10 transition-shadow hover:shadow-md dark:border-white/10">
              <CardContent className="flex items-center gap-4 py-5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <item.icon className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{item.title}</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">{item.description}</p>
                </div>
                <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
