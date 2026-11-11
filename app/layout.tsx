import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { introPendingScript } from "@/lib/intro";
import { Providers } from "@/components/Providers";
import { profile } from "@/lib/data";
import "lenis/dist/lenis.css";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${profile.name} — ${profile.role}`,
  description: profile.summary,
  openGraph: {
    title: `${profile.name} — ${profile.role}`,
    description: profile.summary,
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0E0E0C",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // The inline script may add "intro-pending" before hydration; that is expected.
    <html lang="en" className={`${geist.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: introPendingScript }} />
      </head>
      <body>
        <a
          href="#main"
          className="sr-only bg-ink px-4 py-2 text-paper focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80]"
        >
          Skip to content
        </a>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
