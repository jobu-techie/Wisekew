import Image from "next/image";
import { CheckCircle2 } from "lucide-react";

const points = [
  "Learn from real video courses, at your own pace",
  "Practice with Gleim-style timed exams and explanations",
  "Earn a certificate when you finish",
];

export function AuthBrandPanel() {
  return (
    <div className="relative hidden overflow-hidden bg-gradient-to-br from-primary to-brand-dark px-12 py-16 text-white lg:flex lg:flex-col lg:justify-between">
      <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute -bottom-32 -left-16 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

      <div className="relative flex items-center gap-2 text-xl font-bold">
        <Image
          src="/logo/wisekew-icon.png"
          alt="Wisekew"
          width={40}
          height={32}
          className="h-10 w-auto"
        />
        Wisekew
      </div>

      <div className="relative">
        <h2 className="max-w-sm text-3xl font-bold leading-tight">
          Learn it, then prove it.
        </h2>
        <ul className="mt-8 space-y-4">
          {points.map((p) => (
            <li key={p} className="flex items-start gap-3 text-white/90">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-white" />
              <span>{p}</span>
            </li>
          ))}
        </ul>
      </div>

      <p className="relative text-sm text-white/60">
        &copy; {new Date().getFullYear()} Wisekew
      </p>
    </div>
  );
}
