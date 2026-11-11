"use client";

import { useEffect, useState } from "react";
import { formatDubaiTime } from "@/lib/format";

/** Live Dubai time. Renders "--:--" on the server so hydration never mismatches. */
export function DubaiClock({ className = "" }: { className?: string }) {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const tick = () => setTime(formatDubaiTime(new Date()));
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <span aria-label="Dubai time" className={`tabular-nums ${className}`}>
      DXB {time ?? "--:--"}
    </span>
  );
}
