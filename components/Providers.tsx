"use client";

import { MotionConfig } from "framer-motion";
import { Cursor } from "./Cursor";
import { Intro } from "./Intro";
import { PageTransition } from "./motion/PageTransition";
import { ScrollProgress } from "./motion/ScrollProgress";
import { SmoothScroll } from "./motion/SmoothScroll";
import { TopBar } from "./TopBar";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    // "user" makes every motion component honour prefers-reduced-motion
    <MotionConfig reducedMotion="user">
      <SmoothScroll />
      <ScrollProgress />
      <PageTransition />
      <TopBar />
      <Cursor />
      <Intro />
      {children}
    </MotionConfig>
  );
}
