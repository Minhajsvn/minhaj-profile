"use client";

import { motion, type HTMLMotionProps } from "framer-motion";

const tags = { div: motion.div, li: motion.li, article: motion.article } as const;

type RevealProps = HTMLMotionProps<"div"> & {
  as?: keyof typeof tags;
  delay?: number;
  y?: number;
};

/** Fades and lifts content into view once. MotionConfig reducedMotion="user" disables the movement. */
export function Reveal({ as = "div", delay = 0, y = 16, children, ...rest }: RevealProps) {
  const Tag = tags[as] as typeof motion.div;
  return (
    <Tag
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
