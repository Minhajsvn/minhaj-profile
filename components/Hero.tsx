"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { profile } from "@/lib/data";
import { SplitReveal } from "./motion/SplitReveal";
import { Section } from "./Section";

const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease },
});

const meta = [
  { k: "Role", v: profile.role },
  { k: "Based", v: profile.location },
  { k: "Index", v: "© 2026" },
  { k: "Status", v: "Open to projects" },
];

export function Hero() {
  return (
    <Section tone="paper" labelledBy="hero-title" className="flex min-h-[100svh] flex-col pt-20">
      <div className="gutter grid-12 gap-y-8">
        <motion.dl {...fadeUp(0.1)} className="col-span-12 grid grid-cols-2 gap-x-4 gap-y-4 md:col-span-8 md:grid-cols-4">
          {meta.map((m) => (
            <div key={m.k} className="rule border-t pt-2">
              <dt className="label muted">{m.k}</dt>
              <dd className="mt-1 text-sm font-medium">{m.v}</dd>
            </div>
          ))}
        </motion.dl>

        <motion.div {...fadeUp(0.2)} className="col-span-5 md:col-span-3 md:col-start-10 md:row-span-2">
          <div className="group relative aspect-[4/5] w-full overflow-hidden">
            <Image
              src={profile.avatar}
              alt={profile.avatarAlt}
              fill
              priority
              sizes="(min-width: 768px) 25vw, 40vw"
              className="object-cover object-[50%_35%] grayscale transition-[filter] duration-500 group-hover:grayscale-0"
            />
          </div>
        </motion.div>

        <motion.p
          {...fadeUp(0.35)}
          className="col-span-7 self-end text-pretty text-lg leading-snug md:col-span-6 md:text-2xl"
        >
          Shopify stores, Next.js sites and real-time apps for GCC brands.
        </motion.p>
      </div>

      <div className="mt-auto overflow-hidden">
        <SplitReveal
          as="h1"
          id="hero-title"
          immediate
          delay={0.15}
          parts={[{ text: "MINHAJ" }]}
          className="text-hero -mb-[0.14em] whitespace-nowrap pl-[0.02em] pt-8"
        />
      </div>
    </Section>
  );
}
