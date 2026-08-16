import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatPrice } from "@/lib/format";
import { AdminPublishToggle } from "./admin-publish-toggle";
import { UserRow } from "./user-row";
import { Users, BookOpen, ClipboardList, DollarSign } from "lucide-react";

export const dynamic = "force-dynamic";

const roleBadgeVariant = {
  ADMIN: "default",
  INSTRUCTOR: "outline",
  STUDENT: "secondary",
} as const;

export default async function AdminPage() {
  const [users, courses, revenueAgg] = await Promise.all([
    prisma.user.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.course.findMany({
      include: { instructor: { select: { name: true } }, _count: { select: { enrollments: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.payment.aggregate({ _sum: { amount: true } }),
  ]);

  const publishedCount = courses.filter((c) => c.published).length;
  const totalRevenue = revenueAgg._sum.amount?.toString() ?? "0";

  const stats = [
    { label: "Users", value: users.length, icon: Users },
    { label: "Courses", value: courses.length, icon: BookOpen },
    { label: "Published", value: publishedCount, icon: ClipboardList },
    { label: "Total revenue", value: formatPrice(totalRevenue), icon: DollarSign },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="mb-8 text-3xl font-bold tracking-tight">Admin</h1>

      <div className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label} className="rounded-2xl border-black/10 dark:border-white/10">
            <CardContent className="py-5">
              <s.icon className="mb-2 h-5 w-5 text-primary" />
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mb-10 rounded-2xl border-black/10 dark:border-white/10">
        <CardHeader>
          <CardTitle className="text-lg">Courses ({courses.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Instructor</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Students</TableHead>
                <TableHead>Status</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.title}</TableCell>
                  <TableCell>{c.instructor.name}</TableCell>
                  <TableCell>{formatPrice(c.price.toString())}</TableCell>
                  <TableCell>{c._count.enrollments}</TableCell>
                  <TableCell>
                    <Badge variant={c.published ? "default" : "secondary"}>
                      {c.published ? "Published" : "Draft"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <AdminPublishToggle courseId={c.id} published={c.published} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-black/10 dark:border-white/10">
        <CardHeader>
          <CardTitle className="text-lg">Users ({users.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Joined</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((u) => (
                <UserRow key={u.id} href={`/admin/users/${u.id}`}>
                  <TableCell className="font-medium">{u.name}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>
                    <Badge variant={roleBadgeVariant[u.role]}>{u.role}</Badge>
                  </TableCell>
                  <TableCell>{u.createdAt.toLocaleDateString()}</TableCell>
                </UserRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
