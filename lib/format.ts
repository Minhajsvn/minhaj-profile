// Pure display helpers. Relative `.ts` import so Node's test runner resolves it without the `@/` alias.
import { categories, type Category } from "./projects.ts";

const dubaiClock = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Asia/Dubai",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

/** "HH:MM" in Dubai, 24-hour. */
export const formatDubaiTime = (date: Date): string => dubaiClock.format(date);

/** Milliseconds until the next whole minute, so a clock can tick on the minute. */
export const msToNextMinute = (date: Date): number => 60_000 - (date.getTime() % 60_000);

/** 0-based index → "01", "02" … */
export const indexNumber = (i: number): string => String(i + 1).padStart(2, "0");

/** The project's year, or its category label when no year is set. */
export function projectYearLabel(p: { year?: string; category: Category }): string {
  return p.year ?? categories.find((c) => c.id === p.category)?.label ?? p.category;
}
