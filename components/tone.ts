import type { Tone } from "./Section";

/** Tone of the section under a viewport point. Defaults to paper. */
export function toneAt(x: number, y: number, ignore?: Element | null): Tone {
  const els = document.elementsFromPoint(x, y);
  for (const el of els) {
    if (ignore && ignore.contains(el)) continue;
    const t = el.closest("[data-tone]")?.getAttribute("data-tone");
    if (t === "ink" || t === "paper") return t;
  }
  return "paper";
}
