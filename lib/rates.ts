"use client";

import { useSyncExternalStore } from "react";

export type Rates = { gold: number; silver: number; updatedAt: string };
export type Dir = "up" | "down" | "flat";
type State = { rates: Rates | null; dir: Dir; failed: boolean };

export const AED_PER_USD = 3.6725; // pegged
export const GRAMS_PER_OZ = 31.1034768;
export const KARATS = [
  { k: "24K", purity: 1 },
  { k: "22K", purity: 22 / 24 },
  { k: "21K", purity: 21 / 24 },
  { k: "18K", purity: 18 / 24 },
] as const;

export const money = (n: number, digits = 2) =>
  n.toLocaleString("en-US", { minimumFractionDigits: digits, maximumFractionDigits: digits });

/** 24K gold in AED per gram, from spot USD per troy ounce. */
export const aedPerGram24 = (goldUsdPerOz: number) => (goldUsdPerOz * AED_PER_USD) / GRAMS_PER_OZ;

const POLL_MS = 30_000;
const SERVER: State = { rates: null, dir: "flat", failed: false };
let state: State = SERVER;
const listeners = new Set<() => void>();
let timer: ReturnType<typeof setInterval> | undefined;

function set(next: Partial<State>) {
  state = { ...state, ...next };
  listeners.forEach((l) => l());
}

async function load() {
  if (document.hidden) return;
  try {
    const res = await fetch("/api/rates", { cache: "no-store" });
    if (!res.ok) throw new Error();
    const next = (await res.json()) as Rates;
    const prev = state.rates?.gold;
    set({
      rates: next,
      failed: false,
      dir: prev === undefined ? state.dir : next.gold > prev ? "up" : next.gold < prev ? "down" : "flat",
    });
  } catch {
    set({ failed: true });
  }
}

/** One polling loop shared by every subscriber (ticker, calculator…), started on first use. */
function subscribe(listener: () => void) {
  listeners.add(listener);
  if (listeners.size === 1) {
    load();
    timer = setInterval(load, POLL_MS);
    document.addEventListener("visibilitychange", load);
  }
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", load);
    }
  };
}

export function useRates() {
  return useSyncExternalStore(subscribe, () => state, () => SERVER);
}
