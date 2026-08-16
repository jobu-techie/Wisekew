import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/format";
import { ArrowLeft } from "lucide-react";

export async function PurchaseHistoryContent({ basePath }: { basePath: string }) {
  const session = await auth();
  const userId = session!.user.id;

  const payments = await prisma.payment.findMany({
    where: { userId },
    include: { course: { select: { title: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <Link
        href={`${basePath}/account`}
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Account
      </Link>
      <h1 className="text-3xl font-bold tracking-tight">Purchase history</h1>
      <p className="mt-1 text-muted-foreground">View details of your order history.</p>

      <div className="mt-8">
        {payments.length === 0 ? (
          <p className="text-sm text-muted-foreground">No purchases yet.</p>
        ) : (
          <div className="space-y-2">
            {payments.map((p) => (
              <Card key={p.id} className="rounded-xl border-black/10 dark:border-white/10">
                <CardContent className="flex items-center justify-between py-3.5">
                  <div>
                    <p className="font-medium text-sm">{p.course.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {p.createdAt.toLocaleDateString()} · {p.provider}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={p.status === "COMPLETED" ? "default" : "secondary"}>
                      {p.status}
                    </Badge>
                    <span className="font-medium">{formatPrice(p.amount.toString())}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
