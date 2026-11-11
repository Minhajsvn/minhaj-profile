"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * Reduced-motion preference that is `false` until after hydration, so server and first client render match.
 * Use it wherever the preference changes rendered markup (attributes, labels, styles).
 */
export function useSafeReducedMotion(): boolean {
  const reduce = useReducedMotion();
  const [value, setValue] = useState(false);
  useEffect(() => setValue(!!reduce), [reduce]);
  return value;
}
