"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { INTRO_KEY as KEY } from "@/lib/intro";
const DURATION = 900; // counter time; the wipe adds ~300 ms, total ≤ 1.2 s

function seen(): boolean {
  try {
    return sessionStorage.getItem(KEY) === "1";
  } catch {
    return true; // storage blocked: treat as seen, never block the page
  }
}

function markSeen() {
  try {
    sessionStorage.setItem(KEY, "1");
  } catch {}
}

/** Drop the pre-hydration ink cover set by introPendingScript (lib/intro.ts). */
function uncover() {
  document.documentElement.classList.remove("intro-pending");
}

/**
 * First visit per session: an ink screen counts to 100 then wipes up.
 * The page underneath is rendered normally, so no-JS and crawlers see it.
 */
export function Intro() {
  const reduce = useReducedMotion();
  const [show, setShow] = useState(false);
  const [count, setCount] = useState(0);
  const [gone, setGone] = useState(false);

  // Once the overlay is on screen it covers the page itself, so the CSS cover can go.
  useEffect(() => {
    if (show) uncover();
  }, [show]);

  useEffect(() => {
    if (reduce || seen()) {
      uncover();
      return;
    }
    markSeen();
    setShow(true);
    const start = performance.now();
    let frame = requestAnimationFrame(function tick(now) {
      const p = Math.min(1, (now - start) / DURATION);
      setCount(Math.round(p * 100));
      if (p < 1) frame = requestAnimationFrame(tick);
      else setShow(false);
    });
    const skip = () => setShow(false);
    // rAF pauses in hidden or throttled tabs, and the exit animation needs rAF too.
    // A plain timer removes the overlay outright, so it can never block the page.
    const failsafe = setTimeout(() => setGone(true), DURATION + 800);
    window.addEventListener("pointerdown", skip);
    window.addEventListener("keydown", skip);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(failsafe);
      window.removeEventListener("pointerdown", skip);
      window.removeEventListener("keydown", skip);
    };
  }, [reduce]);

  if (gone) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          data-intro
          aria-hidden
          exit={{ y: "-100%" }}
          transition={{ duration: 0.3, ease: [0.7, 0, 0.84, 0] }}
          className="fixed inset-0 z-[70] flex flex-col justify-between bg-ink p-4 text-paper md:p-6"
        >
          <span className="label">Mohammad Minhaj — Portfolio</span>
          <div className="flex items-end justify-between">
            <span className="text-title">MINHAJ</span>
            <span className="label tabular-nums text-lime">{String(count).padStart(3, "0")}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
