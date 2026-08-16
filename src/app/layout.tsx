import type { Metadata } from "next";
import { Montserrat, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { ConditionalFooter } from "@/components/conditional-footer";
import { Toaster } from "@/components/ui/sonner";
import { SessionProvider } from "@/components/session-provider";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Wisekew — Learn. Practice. Get Certified.",
  description:
    "Wisekew is a course and exam-prep platform: learn from video courses and master exams with structured practice question banks.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${montserrat.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SessionProvider>
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <ConditionalFooter />
          <Toaster />
        </SessionProvider>
      </body>
    </html>
  );
}
