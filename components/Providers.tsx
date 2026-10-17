"use client";

import { ThemeProvider } from "next-themes";
import { MotionConfig } from "framer-motion";
import { PageTransition } from "./motion/PageTransition";
import { ScrollProgress } from "./motion/ScrollProgress";
import { SmoothScroll } from "./motion/SmoothScroll";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      {/* "user" makes every motion component honour prefers-reduced-motion */}
      <MotionConfig reducedMotion="user">
        <SmoothScroll />
        <ScrollProgress />
        <PageTransition />
        {children}
      </MotionConfig>
    </ThemeProvider>
  );
}
