"use client";

import { motion } from "framer-motion";
import { profile, stats } from "@/lib/data";
import { ArrowDown } from "./Icons";
import { Magnetic } from "./motion/Magnetic";
import { SplitReveal, type Part } from "./motion/SplitReveal";
import { TopBar } from "./TopBar";

// Alternate weights of ink, like the reference headline.
const headline: Part[] = [
  { text: "Building" },
  { text: "Shopify stores,", soft: true },
  { text: "real-time apps," },
  { text: "and fast", soft: true },
  { text: "web experiences." },
];

const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease },
});

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="panel overflow-hidden bg-background px-4 pb-14 sm:px-8 sm:pb-20">
      <TopBar />

      <div className="mx-auto flex max-w-3xl flex-col items-center pt-10 text-center sm:pt-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease }}
          className="relative"
        >
          {/* Monogram stands in for a headshot — swap for next/image when a photo is ready. */}
          <div
            role="img"
            aria-label={`${profile.name} monogram`}
            className="relative grid h-24 w-24 place-items-center rounded-full bg-primary text-primary-foreground ring-4 ring-surface sm:h-28 sm:w-28"
          >
            <span className="text-3xl font-semibold tracking-tight sm:text-4xl">MM</span>
            <span aria-hidden className="absolute -right-0.5 top-2 h-3 w-3 rounded-full bg-accent ring-4 ring-background" />
          </div>
          <motion.span
            initial={{ opacity: 0, rotate: 0, x: -8 }}
            animate={{ opacity: 1, rotate: -8, x: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 14, delay: 0.5 }}
            className="absolute left-[60%] top-[72%] whitespace-nowrap rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground shadow-sm sm:left-[78%] sm:top-[68%]"
          >
            <span className="sm:hidden">{profile.firstName}</span>
            <span className="hidden sm:inline">{profile.name}</span> <span aria-hidden>👋</span>
          </motion.span>
        </motion.div>

        <motion.p
          {...fadeUp(0.15)}
          className="mt-10 text-balance text-xs font-medium uppercase tracking-[0.14em] text-muted sm:tracking-[0.18em]"
        >
          <span aria-hidden className="mr-2 inline-block h-1.5 w-1.5 -translate-y-px rounded-full bg-accent align-middle" />
          {profile.role} · {profile.location}
        </motion.p>

        <SplitReveal
          as="h1"
          id="hero-title"
          immediate
          delay={0.2}
          parts={headline}
          className="mt-5 text-balance text-[2.25rem] font-semibold leading-[1.1] sm:text-5xl md:text-[3.75rem]"
        />

        <motion.p
          {...fadeUp(0.75)}
          className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-muted sm:text-lg"
        >
          I build Shopify stores and apps, Next.js websites and Node.js backends for jewellery, bullion and real
          estate brands across the UAE and GCC.
        </motion.p>

        <motion.div {...fadeUp(0.9)} className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <Magnetic>
            <a href="#work" className="btn-primary px-6">
              Selected work <ArrowDown />
            </a>
          </Magnetic>
          <Magnetic>
            <a href="#contact" className="btn-ghost px-6">
              Get in touch
            </a>
          </Magnetic>
        </motion.div>

        <motion.dl
          {...fadeUp(1.05)}
          className="mt-14 grid w-full max-w-xl grid-cols-3 gap-2 border-t border-border pt-8"
        >
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col-reverse items-center gap-1">
              <dt className="text-xs leading-snug text-muted sm:text-sm">{s.label}</dt>
              <dd className="text-2xl font-semibold tracking-tight sm:text-3xl">{s.value}</dd>
            </div>
          ))}
        </motion.dl>
      </div>
    </section>
  );
}
