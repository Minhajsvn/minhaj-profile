import { test } from "node:test";
import assert from "node:assert/strict";
import { formatDubaiTime, indexNumber, msToNextMinute, projectYearLabel } from "./format.ts";

test("msToNextMinute counts to the next minute boundary", () => {
  assert.equal(msToNextMinute(new Date("2026-11-11T10:02:45.500Z")), 14_500);
});

test("msToNextMinute gives a full minute exactly on a boundary", () => {
  assert.equal(msToNextMinute(new Date("2026-11-11T10:02:00.000Z")), 60_000);
});

test("formatDubaiTime shifts UTC to Dubai (UTC+4)", () => {
  assert.equal(formatDubaiTime(new Date("2026-11-11T10:02:00Z")), "14:02");
});

test("formatDubaiTime wraps past midnight in 24-hour form", () => {
  assert.equal(formatDubaiTime(new Date("2026-11-11T20:30:00Z")), "00:30");
});

test("indexNumber pads a 0-based index to two digits", () => {
  assert.equal(indexNumber(0), "01");
  assert.equal(indexNumber(9), "10");
});

test("projectYearLabel prefers the year", () => {
  assert.equal(projectYearLabel({ year: "2025", category: "web" }), "2025");
});

test("projectYearLabel falls back to the category label", () => {
  assert.equal(projectYearLabel({ category: "app" }), "Apps & platforms");
});
