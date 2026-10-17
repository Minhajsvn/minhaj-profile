"use client";

import { motion, type Variants } from "framer-motion";

export type Part = { text: string; soft?: boolean };

const ease = [0.22, 1, 0.36, 1] as const;

const word: Variants = {
  hidden: { y: "110%" },
  show: { y: "0%", transition: { duration: 0.9, ease } },
};

type Props = {
  parts: Part[];
  as?: "h1" | "h2" | "p";
  id?: string;
  className?: string;
  delay?: number;
  /** Animate on mount (hero) instead of when scrolled into view. */
  immediate?: boolean;
};

/**
 * Words slide up from behind a mask, one after another — the site's signature heading motion.
 * Only transforms animate, so with reduced motion the text is simply there.
 */
export function SplitReveal({ parts, as = "h2", id, className = "", delay = 0, immediate = false }: Props) {
  const Tag = motion[as];
  const label = parts.map((p) => p.text).join(" ");
  const words = parts.flatMap((p) => p.text.split(" ").map((w) => ({ w, soft: p.soft })));

  return (
    <Tag
      id={id}
      aria-label={label}
      className={className}
      initial="hidden"
      {...(immediate ? { animate: "show" } : { whileInView: "show", viewport: { once: true, margin: "-80px" } })}
      variants={{ show: { transition: { staggerChildren: 0.06, delayChildren: delay } } }}
    >
      {words.map(({ w, soft }, i) => (
        <span key={i} aria-hidden className="-mb-[0.12em] inline-block overflow-hidden pb-[0.12em] align-bottom">
          <motion.span variants={word} className={`inline-block ${soft ? "font-light text-muted" : ""}`}>
            {w}
            {i < words.length - 1 && " "}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
