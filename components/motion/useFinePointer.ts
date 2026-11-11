"use client";

import { useEffect, useState } from "react";

/** True while the primary pointer is fine (a mouse). Follows changes, e.g. a laptop that switches to touch. False on the server. */
export function useFinePointer(): boolean {
  const [fine, setFine] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine)");
    const update = () => setFine(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return fine;
}
