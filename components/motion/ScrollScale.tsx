"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useSafeReducedMotion } from "./useSafeReducedMotion";

const tags = { article: motion.article, div: motion.div } as const;

/** Grows from slightly inset to full size as it scrolls into view. */
export function ScrollScale({
  children,
  className = "",
  as = "article",
  from = 0.9,
}: {
  children: React.ReactNode;
  className?: string;
  as?: keyof typeof tags;
  /** Starting scale before the element scrolls in. */
  from?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useSafeReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 0.3"] });
  const scale = useTransform(scrollYProgress, [0, 1], [from, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.4], [0.4, 1]);
  const Tag = tags[as] as typeof motion.div;

  return (
    <Tag ref={ref} style={reduce ? undefined : { scale, opacity }} className={className}>
      {children}
    </Tag>
  );
}
