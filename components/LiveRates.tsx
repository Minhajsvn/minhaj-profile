"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight } from "./Icons";

type Rates = { gold: number; silver: number; updatedAt: string };
type Dir = "up" | "down" | "flat";

const POLL_MS = 30_000;
const AED_PER_USD = 3.6725; // pegged
const GRAMS_PER_OZ = 31.1034768;
const KARATS = [
  { k: "24K", purity: 1 },
  { k: "22K", purity: 22 / 24 },
  { k: "21K", purity: 21 / 24 },
  { k: "18K", purity: 18 / 24 },
];

const usd = (n: number) => n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function useRates() {
  const [rates, setRates] = useState<Rates | null>(null);
  const [dir, setDir] = useState<Dir>("flat");
  const [failed, setFailed] = useState(false);
  const last = useRef<number | null>(null);

  useEffect(() => {
    let alive = true;
    async function load() {
      if (document.hidden) return;
      try {
        const res = await fetch("/api/rates", { cache: "no-store" });
        if (!res.ok) throw new Error();
        const next = (await res.json()) as Rates;
        if (!alive) return;
        if (last.current !== null) {
          setDir(next.gold > last.current ? "up" : next.gold < last.current ? "down" : "flat");
        }
        last.current = next.gold;
        setRates(next);
        setFailed(false);
      } catch {
        if (alive) setFailed(true);
      }
    }
    load();
    const id = setInterval(load, POLL_MS);
    document.addEventListener("visibilitychange", load);
    return () => {
      alive = false;
      clearInterval(id);
      document.removeEventListener("visibilitychange", load);
    };
  }, []);

  return { rates, dir, failed };
}

/** A number that rolls to its new value whenever it changes. */
function Rolling({ value, dir }: { value: string; dir: Dir }) {
  return (
    <span className="relative inline-flex overflow-hidden tabular-nums">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value}
          initial={{ y: dir === "down" ? "-100%" : "100%" }}
          animate={{ y: "0%" }}
          exit={{ y: dir === "down" ? "100%" : "-100%" }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="inline-block"
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function Item({ label, value, unit, dir }: { label: string; value: string; unit: string; dir: Dir }) {
  return (
    <li className="flex shrink-0 items-baseline gap-2 whitespace-nowrap text-sm">
      <span className="text-xs font-medium uppercase tracking-wider text-muted">{label}</span>
      <span className="font-semibold">
        <Rolling value={value} dir={dir} />
      </span>
      <span className="text-xs text-muted">{unit}</span>
    </li>
  );
}

export function LiveRates() {
  const { rates, dir, failed } = useRates();
  if (failed && !rates) return null; // feed down: leave no broken widget behind

  const arrow = dir === "up" ? "▲" : dir === "down" ? "▼" : "•";
  const aedPerGram = rates ? (rates.gold * AED_PER_USD) / GRAMS_PER_OZ : 0;
  const time = rates
    ? new Date(rates.updatedAt).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Dubai" })
    : "";

  const items = rates ? (
    <>
      <Item label="Gold" value={`$${usd(rates.gold)}`} unit="/oz" dir={dir} />
      <Item label="Silver" value={`$${usd(rates.silver)}`} unit="/oz" dir={dir} />
      {KARATS.map(({ k, purity }) => (
        <Item key={k} label={k} value={`AED ${usd(aedPerGram * purity)}`} unit="/g" dir={dir} />
      ))}
    </>
  ) : (
    <li className="text-sm text-muted">Connecting to market feed…</li>
  );

  return (
    <section
      aria-label="Live precious-metal prices"
      className="flex items-center gap-3 overflow-hidden rounded-full border border-border/70 bg-surface py-2 pl-2 pr-2 sm:gap-4"
    >
      <span className="flex shrink-0 items-center gap-2 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary-foreground">
        <span className="relative flex h-2 w-2" aria-hidden>
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-70" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
        </span>
        Live
      </span>

      <div
        tabIndex={0}
        aria-label="Prices"
        className="min-w-0 flex-1 overflow-x-auto rounded-full [mask-image:linear-gradient(to_right,transparent,black_4%,black_92%,transparent)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <ul className="flex w-max items-center gap-8 pr-8">
          <li aria-hidden className="text-xs text-muted">
            {arrow}
          </li>
          {items}
          {rates && (
            <li className="shrink-0 text-xs text-muted">
              Spot-derived, indicative · Dubai {time}
            </li>
          )}
        </ul>
      </div>

      <Link
        href="/work/live-rate-app"
        data-transition-label="Live Rate App"
        className="hidden shrink-0 items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:text-foreground md:inline-flex"
      >
        I build feeds like this <ArrowUpRight width={14} height={14} />
      </Link>
    </section>
  );
}
