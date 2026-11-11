"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, type Variants } from "framer-motion";

type Phase = "idle" | "cover" | "reveal";

const ease = [0.76, 0, 0.24, 1] as const;

const curtain: Variants = {
  idle: { y: "100%", transition: { duration: 0 } },
  cover: { y: "0%", transition: { duration: 0.6, ease } },
  reveal: { y: "-100%", transition: { duration: 0.7, ease, delay: 0.15 } },
};

const title: Variants = {
  idle: { y: "110%", opacity: 0 },
  cover: { y: "0%", opacity: 1, transition: { duration: 0.6, ease, delay: 0.2 } },
  reveal: { y: "-60%", opacity: 0, transition: { duration: 0.4, ease } },
};

/**
 * Curtain transition between routes. Internal link clicks are caught in the capture phase
 * (before Next's <Link> handler), the curtain rises with the destination's name, then the
 * route changes and the curtain lifts away. Modified clicks, new tabs, same-page anchors
 * and reduced-motion users get plain navigation.
 */
export function PageTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const [phase, setPhase] = useState<Phase>("idle");
  const [label, setLabel] = useState("");
  const pending = useRef<string | null>(null);
  const navigated = useRef(false);
  const fallback = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  function go() {
    if (navigated.current || !pending.current) return;
    navigated.current = true;
    clearTimeout(fallback.current);
    router.push(pending.current);
  }

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a");
      if (!a || !a.href || (a.target && a.target !== "_self") || a.hasAttribute("download")) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || url.pathname === location.pathname) return;
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      e.preventDefault();
      pending.current = url.pathname + url.search + url.hash;
      navigated.current = false;
      setLabel(a.dataset.transitionLabel ?? "");
      setPhase("cover");
      // Navigate even if the cover animation never reports completion (e.g. a backgrounded tab).
      fallback.current = setTimeout(go, 900);
    }
    window.addEventListener("click", onClick, true);
    return () => window.removeEventListener("click", onClick, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // The new route has rendered: lift the curtain.
  useEffect(() => {
    if (pending.current && navigated.current) {
      pending.current = null;
      setPhase("reveal");
    }
  }, [pathname]);

  return (
    <motion.div
      aria-hidden
      initial="idle"
      animate={phase}
      variants={curtain}
      onAnimationComplete={(def) => {
        if (def === "cover") go();
        if (def === "reveal") setPhase("idle");
      }}
      className="pointer-events-none fixed inset-0 z-[70] grid place-items-center bg-ink text-paper"
    >
      <div className="overflow-hidden px-6 pb-[0.15em] text-center">
        <motion.p
          variants={title}
          className="text-balance text-4xl font-semibold tracking-tight sm:text-6xl md:text-7xl"
        >
          {label || (
            <span className="inline-flex items-center gap-3">
              <span className="h-3 w-3 rounded-full bg-lime" /> MM
            </span>
          )}
        </motion.p>
      </div>
    </motion.div>
  );
}
