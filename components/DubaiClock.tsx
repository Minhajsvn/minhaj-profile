"use client";

import { useEffect, useState } from "react";
import { formatDubaiTime, msToNextMinute } from "@/lib/format";

/** Live Dubai time, ticking on the minute. Renders "--:--" on the server so hydration never mismatches. */
export function DubaiClock({ className = "" }: { className?: string }) {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const tick = () => setTime(formatDubaiTime(new Date()));
    tick();
    let interval: ReturnType<typeof setInterval> | undefined;
    const align = setTimeout(() => {
      tick();
      interval = setInterval(tick, 60_000);
    }, msToNextMinute(new Date()));
    return () => {
      clearTimeout(align);
      clearInterval(interval);
    };
  }, []);

  return (
    <span className={`tabular-nums ${className}`}>
      <span className="sr-only">Dubai time </span>
      DXB {time ?? "--:--"}
    </span>
  );
}
