import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-black/5 bg-slate-50 dark:border-white/10 dark:bg-transparent">
      <div className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5">
          <div className="col-span-2 sm:col-span-1">
            <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight">
              <Image
                src="/logo/wisekew-icon.png"
                alt="Wisekew"
                width={32}
                height={26}
                className="h-8 w-auto"
              />
              Wise<span className="text-primary">kew</span>
            </Link>
            <p className="mt-3 text-sm text-muted-foreground">
              Learn. Practice. Get Certified.
            </p>

            <ul className="mt-5 space-y-2.5 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                <span>Contrust House, Moi Avenue, 2nd Floor, Room 13, Nairobi</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0" />
                <a href="tel:+254792491291" className="hover:text-primary">
                  +254 792 491 291
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0" />
                <a href="mailto:info@wisekew.com" className="hover:text-primary">
                  info@wisekew.com
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold">Learn</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/courses" className="hover:text-primary">
                  Browse courses
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-primary">
                  My learning
                </Link>
              </li>
              <li>
                <Link href="/signup" className="hover:text-primary">
                  Create account
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold">Exam Prep</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {["CPA", "CMA", "CIA", "EA", "FMAA", "CPE", "AFSP", "IAP"].map((cat) => (
                <li key={cat}>
                  <Link
                    href={`/courses?category=${encodeURIComponent(cat)}`}
                    className="hover:text-primary"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold">Teach</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/instructor" className="hover:text-primary">
                  Instructor dashboard
                </Link>
              </li>
              <li>
                <Link href="/become-instructor" className="hover:text-primary">
                  Become an instructor
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold">Company</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-primary">
                  About Wisekew
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-primary">
                  Log in
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-black/5 pt-6 text-sm text-muted-foreground dark:border-white/10">
          &copy; {new Date().getFullYear()} Wisekew Research and Consulting Company. All
          rights reserved.
        </div>
      </div>
    </footer>
  );
}
