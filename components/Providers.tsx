"use client";

import { ThemeProvider } from "next-themes";
import { MotionConfig } from "framer-motion";
import { PageTransition } from "./motion/PageTransition";
import { ScrollProgress } from "./motion/ScrollProgress";
import { SmoothScroll } from "./motion/SmoothScroll";
import { Cursor } from "./Cursor";
import { Intro } from "./Intro";
import { TopBar } from "./TopBar";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      {/* "user" makes every motion component honour prefers-reduced-motion */}
      <MotionConfig reducedMotion="user">
        <SmoothScroll />
        <ScrollProgress />
        <PageTransition />
        <TopBar />
        <Cursor />
        <Intro />
        {children}
      </MotionConfig>
    </ThemeProvider>
  );
}
