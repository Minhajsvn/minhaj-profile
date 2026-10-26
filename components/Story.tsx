"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { profile, story } from "@/lib/data";
import { Reveal } from "./Reveal";
import { SplitReveal } from "./motion/SplitReveal";
export function Story() {
  const reduce = useReducedMotion();
  const listRef = useRef<HTMLOListElement>(null);
  // Gold line down the timeline fills as the chapters scroll past.
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 0.75", "end 0.6"] });
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.3 });

  return (
    <section id="story" aria-labelledby="story-title" className="panel scroll-mt-6 px-4 py-16 sm:px-8 sm:py-24">
      <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        {/* Avatar — sticky beside the chapters on large screens */}
        <div className="lg:sticky lg:top-10 lg:self-start">
          <Reveal className="relative mx-auto max-w-sm lg:max-w-none">
            <motion.div
              animate={reduce ? undefined : { y: [0, -10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="relative aspect-square overflow-hidden rounded-panel border border-border/70 shadow-[0_40px_80px_-40px_rgb(0_46_35/0.45)]"
            >
              <Image
                src={profile.avatar}
                alt={profile.avatarAlt}
                fill
                sizes="(min-width: 1024px) 440px, (min-width: 640px) 384px, 90vw"
                className="object-cover"
              />
            </motion.div>
            <span className="absolute -left-2 top-8 -rotate-6 rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-medium shadow-sm sm:-left-4">
              Hi, I&rsquo;m {profile.firstName} <span aria-hidden>👋</span>
            </span>
            <span className="absolute -right-2 bottom-10 rotate-3 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-sm sm:-right-4">
              <span aria-hidden className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-accent align-middle" />
              {profile.location}
            </span>
          </Reveal>
        </div>

        <div>
          <p className="eyebrow">My story</p>
          <SplitReveal
            id="story-title"
            parts={[{ text: "From Kochi classrooms" }, { text: "to Dubai's gold trade.", soft: true }]}
            className="mt-4 text-balance text-3xl font-semibold leading-tight sm:text-[2.6rem]"
          />
          <Reveal delay={0.1}>
            <p className="mt-6 text-pretty text-lg leading-relaxed text-muted">{story.intro}</p>
          </Reveal>

          <ol ref={listRef} className="relative mt-12 space-y-10 pl-8">
            <span aria-hidden className="absolute bottom-2 left-[5px] top-2 w-px bg-border" />
            <motion.span
              aria-hidden
              style={{ scaleY: reduce ? 1 : fill }}
              className="absolute bottom-2 left-[5px] top-2 w-px origin-top bg-accent"
            />
            {story.chapters.map((c, i) => (
              <Reveal as="li" key={c.year} delay={i * 0.05} className="relative">
                <span
                  aria-hidden
                  className="absolute -left-8 top-1.5 h-[11px] w-[11px] rounded-full border-2 border-accent bg-surface"
                />
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-semibold tracking-tight sm:text-4xl">{c.year}</span>
                  <span className="text-xs font-medium uppercase tracking-wider text-muted">{c.place}</span>
                </div>
                <h3 className="mt-2 text-lg font-semibold">{c.title}</h3>
                <p className="mt-1 leading-relaxed text-muted">{c.body}</p>
                {c.cta && (
                  <a href="#contact" className="btn-primary mt-5 px-6">
                    Start a conversation
                  </a>
                )}
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
