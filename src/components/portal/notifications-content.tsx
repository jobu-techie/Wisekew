import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { formatPrice } from "@/lib/format";
import { Award, BookOpen, CreditCard } from "lucide-react";

type Notification = {
  id: string;
  icon: typeof Award;
  message: string;
  date: Date;
};

export async function NotificationsContent() {
  const session = await auth();
  const userId = session!.user.id;

  const [enrollments, certificates, payments] = await Promise.all([
    prisma.enrollment.findMany({
      where: { userId },
      include: { course: { select: { title: true } } },
    }),
    prisma.certificate.findMany({
      where: { userId },
      include: { course: { select: { title: true } } },
    }),
    prisma.payment.findMany({
      where: { userId },
      include: { course: { select: { title: true } } },
    }),
  ]);

  const notifications: Notification[] = [
    ...enrollments.map((e) => ({
      id: `enrollment-${e.id}`,
      icon: BookOpen,
      message: `You enrolled in ${e.course.title}.`,
      date: e.enrolledAt,
    })),
    ...certificates.map((c) => ({
      id: `certificate-${c.id}`,
      icon: Award,
      message: `You earned a certificate for ${c.course.title}.`,
      date: c.issuedAt,
    })),
    ...payments.map((p) => ({
      id: `payment-${p.id}`,
      icon: CreditCard,
      message: `Payment of ${formatPrice(p.amount.toString())} for ${p.course.title} completed.`,
      date: p.createdAt,
    })),
  ].sort((a, b) => b.date.getTime() - a.date.getTime());

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>

      {notifications.length === 0 ? (
        <p className="mt-8 text-sm text-muted-foreground">
          Nothing here yet — enroll in a course to get started.
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
