"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { socials } from "@/lib/data";
import { DubaiClock } from "./DubaiClock";
import type { Tone } from "./Section";
import { toneAt } from "./tone";

export function SocialLinks({ className = "" }: { className?: string }) {
  return (
    <ul className={`flex items-center gap-1 text-sm ${className}`}>
      {socials.map((s, i) => (
        <li key={s.label} className="flex items-center gap-1">
          {i > 0 && (
            <span aria-hidden className="muted">
              /
            </span>
          )}
          <a href={s.href} target="_blank" rel="noopener noreferrer" className="px-1.5 py-2 underline-offset-4 hover:underline">
            {s.label}
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </li>
      ))}
    </ul>
  );
}

const links = [
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/#contact", label: "Contact" },
];

/** Fixed mono bar. Its colours follow the section underneath it. */
export function TopBar() {
  const ref = useRef<HTMLElement>(null);
  const [tone, setTone] = useState<Tone>("paper");

  useEffect(() => {
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setTone(toneAt(window.innerWidth / 2, 24, ref.current)));
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const ink = tone === "ink";

  return (
    <header
      ref={ref}
      className={`label fixed inset-x-0 top-0 z-50 grid grid-cols-3 items-center gap-4 px-4 py-4 transition-colors duration-300 md:px-6 ${
        ink ? "text-paper" : "text-ink"
      }`}
    >
      <Link href="/" data-transition-label="Home" className="justify-self-start">
        MINHAJ©26
      </Link>
      <nav aria-label="Site" className="flex justify-center gap-3 md:gap-5">
        {links.map((l) => (
          <Link key={l.href} href={l.href} data-transition-label={l.label} className="underline-offset-4 hover:underline">
            {l.label}
          </Link>
        ))}
      </nav>
      <div className="flex items-center justify-end gap-3">
        <DubaiClock className="hidden sm:inline" />
        <span className="flex items-center gap-1.5">
          <span aria-hidden className={`h-2 w-2 rounded-full ${ink ? "bg-lime" : "bg-ink"}`} />
          Available
        </span>
      </div>
    </header>
  );
}
