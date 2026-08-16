import Link from "next/link";
import Image from "next/image";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "@/components/logout-button";
import { NavDropdown, type NavDropdownLink } from "@/components/nav-dropdown";

export async function SiteHeader() {
  const [session, categories] = await Promise.all([
    auth(),
    prisma.course.findMany({
      where: { published: true },
      select: { category: true },
      distinct: ["category"],
      orderBy: { category: "asc" },
    }),
  ]);
  const user = session?.user;

  const courseLinks: NavDropdownLink[] = [
    { label: "All Courses", href: "/courses" },
    ...categories.map((c, i) => ({
      label: c.category,
      href: `/courses?category=${encodeURIComponent(c.category)}`,
      separatorBefore: i === 0,
    })),
  ];

  const teachLinks: NavDropdownLink[] = [
    { label: "Become an Instructor", href: "/become-instructor" },
    { label: "Instructor Dashboard", href: "/instructor" },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-white shadow-sm dark:border-white/10 dark:bg-background">
      <div className="mx-auto flex h-18 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight">
          <Image
            src="/logo/wisekew-icon.png"
            alt="Wisekew"
            width={36}
            height={29}
            className="h-9 w-auto"
            priority
          />
          Wise<span className="text-primary">kew</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <NavDropdown label="Courses" links={courseLinks} />
          <NavDropdown label="Teach" links={teachLinks} />
          {user && user.role !== "ADMIN" && (
            <Link href="/dashboard" className="text-foreground/70 hover:text-primary transition-colors">
              My Learning
            </Link>
          )}
          {user?.role === "ADMIN" && (
            <Link href="/admin" className="text-foreground/70 hover:text-primary transition-colors">
              Admin
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="hidden sm:inline text-sm text-muted-foreground mr-1">
                {user.name}
              </span>
              <LogoutButton />
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="rounded-md"
                render={<Link href="/login" />}
              >
                Log in
              </Button>
              <Button size="sm" className="rounded-md px-5" render={<Link href="/signup" />}>
                Sign up
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
