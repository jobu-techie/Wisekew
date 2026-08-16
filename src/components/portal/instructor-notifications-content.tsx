import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { formatPrice } from "@/lib/format";
import { Award, CreditCard, UserPlus } from "lucide-react";

type Notification = {
  id: string;
  icon: typeof Award;
  message: string;
  date: Date;
};

export async function InstructorNotificationsContent() {
  const session = await auth();
  const userId = session!.user.id;

  const [enrollments, payments, certificates] = await Promise.all([
    prisma.enrollment.findMany({
      where: { course: { instructorId: userId } },
      include: { user: { select: { name: true } }, course: { select: { title: true } } },
      orderBy: { enrolledAt: "desc" },
      take: 20,
    }),
    prisma.payment.findMany({
      where: { course: { instructorId: userId } },
      include: { user: { select: { name: true } }, course: { select: { title: true } } },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
    prisma.certificate.findMany({
      where: { course: { instructorId: userId } },
      include: { user: { select: { name: true } }, course: { select: { title: true } } },
      orderBy: { issuedAt: "desc" },
      take: 20,
    }),
  ]);

  const notifications: Notification[] = [
    ...enrollments.map((e) => ({
      id: `enrollment-${e.id}`,
      icon: UserPlus,
      message: `${e.user.name} enrolled in ${e.course.title}.`,
      date: e.enrolledAt,
    })),
    ...payments.map((p) => ({
      id: `payment-${p.id}`,
      icon: CreditCard,
      message: `${p.user.name} paid ${formatPrice(p.amount.toString())} for ${p.course.title}.`,
      date: p.createdAt,
    })),
    ...certificates.map((c) => ({
      id: `certificate-${c.id}`,
      icon: Award,
      message: `${c.user.name} earned a certificate for ${c.course.title}.`,
      date: c.issuedAt,
    })),
  ]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 20);

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>

      {notifications.length === 0 ? (
        <p className="mt-8 text-sm text-muted-foreground">
          Nothing here yet — publish a course to start seeing enrollment activity.
        </p>
      ) : (
        <div className="mt-8 space-y-2">
          {notifications.map((n) => (
            <Card key={n.id} className="rounded-xl border-black/10 dark:border-white/10">
              <CardContent className="flex items-center gap-3 py-3.5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <n.icon className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-sm">{n.message}</p>
                  <p className="text-xs text-muted-foreground">{n.date.toLocaleString()}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
