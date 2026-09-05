import { prisma } from "@/lib/prisma";
import { EXERCISES, EXERCISE_BY_ID } from "@/lib/domain";
import { colorForExercise, OTHER_COLOR } from "@/lib/exercise-colors";
import { generateSeedEntries, type SeedEntry } from "@/lib/data/seed";
import { DEMO_USER_ID } from "@/lib/demo-user";
import { APP_TIME_ZONE, zonedDayBounds, zonedMonthStart, zonedYearStart } from "@/lib/timezone";
import type { StackedBucket } from "@/components/charts/StackedBarChart";

export type HistoryRange = "W" | "M" | "Y" | "All";

export const RANGE_LABEL: Record<HistoryRange, string> = {
  W: "last 7 days",
  M: "last 4 weeks",
  Y: "last 12 months",
  All: "all time",
};

type Bucket = { start: Date; end: Date; label: string };

const DAY_MS = 24 * 60 * 60 * 1000;

function getBucketDefs(range: HistoryRange, referenceDate: Date, earliestDate: Date): Bucket[] {
  const today = zonedDayBounds(referenceDate).start;
  const buckets: Bucket[] = [];

  if (range === "W") {
    for (let i = 6; i >= 0; i--) {
      const start = new Date(today.getTime() - i * DAY_MS);
      const end = new Date(start.getTime() + DAY_MS);
      buckets.push({ start, end, label: start.toLocaleDateString("en-US", { weekday: "short", timeZone: APP_TIME_ZONE }) });
    }
  } else if (range === "M") {
    for (let i = 3; i >= 0; i--) {
      const end = new Date(today.getTime() - i * 7 * DAY_MS);
      const start = new Date(end.getTime() - 7 * DAY_MS);
      buckets.push({
        start,
        end,
        label: start.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: APP_TIME_ZONE }),
      });
    }
  } else if (range === "Y") {
    for (let i = 11; i >= 0; i--) {
      const start = zonedMonthStart(referenceDate, APP_TIME_ZONE, -i);
      const end = zonedMonthStart(referenceDate, APP_TIME_ZONE, -i + 1);
      buckets.push({ start, end, label: start.toLocaleDateString("en-US", { month: "short", timeZone: APP_TIME_ZONE }) });
    }
  } else {
    const startYear = Math.min(
      Number(earliestDate.toLocaleDateString("en-US", { year: "numeric", timeZone: APP_TIME_ZONE })),
      Number(today.toLocaleDateString("en-US", { year: "numeric", timeZone: APP_TIME_ZONE }))
    );
    const endYear = Number(today.toLocaleDateString("en-US", { year: "numeric", timeZone: APP_TIME_ZONE }));
    for (let year = startYear; year <= endYear; year++) {
      buckets.push({
        start: zonedYearStart(referenceDate, APP_TIME_ZONE, year - endYear),
        end: zonedYearStart(referenceDate, APP_TIME_ZONE, year - endYear + 1),
        label: String(year),
      });
    }
  }

  return buckets;
}

export type ExerciseRowData = {
  exerciseId: string;
  name: string;
  unit: "reps" | "time";
  total: number;
  series: { label: string; value: number }[];
};

export type HistoryData = {
  range: HistoryRange;
  heroTotal: number;
  breakdown: { exerciseId: string; name: string; value: number; color: string }[];
  chart: StackedBucket[];
  rows: ExerciseRowData[];
};

export type MonthOption = { key: string; label: string };

export type MonthSnapshot = Omit<HistoryData, "range"> & { monthKey: string; monthLabel: string };

const TOP_N_IN_CHART = 7; // matches the 7-color palette so no two shown exercises share a color

// Shared aggregation core: given entries and a set of buckets to group them into,
// compute the hero total, per-exercise breakdown, stacked chart, and per-exercise rows.
// Both the relative ranges (W/M/Y/All) and a specific calendar-month snapshot funnel
// through this — only how the buckets are built differs.
function aggregateFromBuckets(entries: SeedEntry[], buckets: Bucket[]) {
  const inRange = entries.filter((e) => e.date >= buckets[0].start && e.date < buckets[buckets.length - 1].end);

  // Totals per exercise across the whole range (reps-only for the hero/chart, all units for rows).
  const totalsByExercise = new Map<string, number>();
  for (const e of inRange) {
    totalsByExercise.set(e.exerciseId, (totalsByExercise.get(e.exerciseId) ?? 0) + e.value);
  }

  const repExerciseIds = EXERCISES.filter((e) => e.unit === "reps").map((e) => e.id);
  const repTotals = repExerciseIds
    .map((id) => ({ id, total: totalsByExercise.get(id) ?? 0 }))
    .filter((r) => r.total > 0)
    .sort((a, b) => b.total - a.total);

  const heroTotal = repTotals.reduce((sum, r) => sum + r.total, 0);

  const topIds = repTotals.slice(0, TOP_N_IN_CHART).map((r) => r.id);
  const otherTotal = repTotals.slice(TOP_N_IN_CHART).reduce((sum, r) => sum + r.total, 0);

  const breakdown = [
    ...repTotals.slice(0, TOP_N_IN_CHART).map((r) => ({
      exerciseId: r.id,
      name: EXERCISE_BY_ID[r.id].name,
      value: r.total,
      color: colorForExercise(r.id),
    })),
    ...(otherTotal > 0
      ? [{ exerciseId: "other", name: "Other", value: otherTotal, color: OTHER_COLOR }]
      : []),
  ];

  const chart: StackedBucket[] = buckets.map((bucket) => {
    const bucketEntries = inRange.filter((e) => e.date >= bucket.start && e.date < bucket.end);
    const byExercise = new Map<string, number>();
    for (const e of bucketEntries) {
      if (e.unit !== "reps") continue;
      byExercise.set(e.exerciseId, (byExercise.get(e.exerciseId) ?? 0) + e.value);
    }
    const segments = topIds
      .map((id) => ({ exerciseId: id, value: byExercise.get(id) ?? 0, color: colorForExercise(id) }))
      .filter((s) => s.value > 0);
    const otherValue = [...byExercise.entries()]
      .filter(([id]) => !topIds.includes(id))
      .reduce((sum, [, v]) => sum + v, 0);
    if (otherValue > 0) segments.push({ exerciseId: "other", value: otherValue, color: OTHER_COLOR });

    return {
      label: bucket.label,
      total: segments.reduce((sum, s) => sum + s.value, 0),
      segments,
    };
  });

  const rows: ExerciseRowData[] = EXERCISES.map((ex) => {
    const series = buckets.map((bucket) => {
      const value = inRange
        .filter((e) => e.exerciseId === ex.id && e.date >= bucket.start && e.date < bucket.end)
        .reduce((sum, e) => sum + e.value, 0);
      return { label: bucket.label, value };
    });
    return {
      exerciseId: ex.id,
      name: ex.name,
      unit: ex.unit,
      total: totalsByExercise.get(ex.id) ?? 0,
      series,
    };
  }).sort((a, b) => b.total - a.total);

  return { heroTotal, breakdown, chart, rows };
}

function aggregate(entries: SeedEntry[], range: HistoryRange, referenceDate: Date): HistoryData {
  const earliest = entries.reduce(
    (min, e) => (e.date < min ? e.date : min),
    entries[0]?.date ?? referenceDate
  );
  const buckets = getBucketDefs(range, referenceDate, earliest);
  return { range, ...aggregateFromBuckets(entries, buckets) };
}

// The Y/M the given instant reads as in `timeZone`, as numbers — used to walk between
// calendar months without caring what timezone the server's own clock is in.
function zonedYearMonth(date: Date, timeZone: string = APP_TIME_ZONE): { year: number; month: number } {
  return {
    year: Number(date.toLocaleDateString("en-US", { year: "numeric", timeZone })),
    month: Number(date.toLocaleDateString("en-US", { month: "numeric", timeZone })),
  };
}

function monthKeyOf(year: number, month: number): string {
  return `${year}-${String(month).padStart(2, "0")}`;
}

// Every calendar month from the user's earliest logged entry through the current month,
// most recent first — what the History screen's month picker lists.
function listMonthKeys(earliest: Date, referenceDate: Date): string[] {
  const start = zonedYearMonth(earliest);
  const end = zonedYearMonth(referenceDate);
  const keys: string[] = [];
  let { year, month } = start;
  while (year < end.year || (year === end.year && month <= end.month)) {
    keys.push(monthKeyOf(year, month));
    month += 1;
    if (month > 12) {
      month = 1;
      year += 1;
    }
  }
  return keys.reverse();
}

function monthKeyToLabel(key: string): string {
  const [year, month] = key.split("-").map(Number);
  // Noon UTC keeps the date on the same calendar day regardless of the small
  // America/Toronto offset — same trick as dateKeyToInstant in timezone.ts.
  const anyDayInMonth = new Date(Date.UTC(year, month - 1, 1, 12, 0, 0));
  return anyDayInMonth.toLocaleDateString("en-US", { month: "long", year: "numeric", timeZone: APP_TIME_ZONE });
}

// Splits a calendar month into ~7-day buckets (day 1-7, 8-14, ...), the last one
// truncated to the month's actual end — mirrors the "M" range's weekly buckets but
// anchored to the 1st of the month instead of trailing back from today.
function getMonthBucketDefs(start: Date, end: Date): Bucket[] {
  const buckets: Bucket[] = [];
  let cursor = start;
  while (cursor < end) {
    const bucketEnd = new Date(Math.min(cursor.getTime() + 7 * DAY_MS, end.getTime()));
    buckets.push({
      start: cursor,
      end: bucketEnd,
      label: cursor.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: APP_TIME_ZONE }),
    });
    cursor = bucketEnd;
  }
  return buckets;
}

function aggregateMonthSnapshot(entries: SeedEntry[], monthKey: string, referenceDate: Date): MonthSnapshot {
  const [year, month] = monthKey.split("-").map(Number);
  const ref = zonedYearMonth(referenceDate);
  const monthOffset = (year - ref.year) * 12 + (month - ref.month);
  const start = zonedMonthStart(referenceDate, APP_TIME_ZONE, monthOffset);
  const end = zonedMonthStart(referenceDate, APP_TIME_ZONE, monthOffset + 1);
  const buckets = getMonthBucketDefs(start, end);
  return { monthKey, monthLabel: monthKeyToLabel(monthKey), ...aggregateFromBuckets(entries, buckets) };
}

async function fetchUserEntries(userId: string, referenceDate: Date): Promise<SeedEntry[]> {
  if (!process.env.DATABASE_URL) {
    return generateSeedEntries(referenceDate);
  }

  const logEntries = await prisma.logEntry.findMany({
    where: { workoutLog: { userId } },
    select: { exerciseId: true, unit: true, value: true, workoutLog: { select: { loggedAt: true } } },
  });

  return logEntries.map((e) => ({
    date: e.workoutLog.loggedAt,
    exerciseId: e.exerciseId,
    unit: e.unit as "reps" | "time",
    value: e.value,
  }));
}

export async function getHistoryData(range: HistoryRange, userId: string = DEMO_USER_ID): Promise<HistoryData> {
  const referenceDate = new Date();
  const entries = await fetchUserEntries(userId, referenceDate);
  return aggregate(entries, range, referenceDate);
}

// Computes all four ranges from a single fetch — the History page needs every range at once
// for instant tab-switching, and re-fetching per range was hitting the database 4x for
// identical data (range filtering happens in-memory in `aggregate`, not in the query).
export async function getAllHistoryRanges(userId: string = DEMO_USER_ID): Promise<Record<HistoryRange, HistoryData>> {
  const referenceDate = new Date();
  const entries = await fetchUserEntries(userId, referenceDate);
  const ranges: HistoryRange[] = ["W", "M", "Y", "All"];
  return Object.fromEntries(ranges.map((r) => [r, aggregate(entries, r, referenceDate)])) as Record<
    HistoryRange,
    HistoryData
  >;
}

// Everything the History page needs in one fetch: the four relative ranges, the list of
// calendar months the user has logged anything in (for the month picker), and a
// pre-computed snapshot for each of those months (so picking one is instant, same
// reasoning as getAllHistoryRanges above).
export async function getHistoryPageData(userId: string = DEMO_USER_ID): Promise<{
  ranges: Record<HistoryRange, HistoryData>;
  months: MonthOption[];
  monthSnapshots: Record<string, MonthSnapshot>;
}> {
  const referenceDate = new Date();
  const entries = await fetchUserEntries(userId, referenceDate);

  const rangeKeys: HistoryRange[] = ["W", "M", "Y", "All"];
  const ranges = Object.fromEntries(rangeKeys.map((r) => [r, aggregate(entries, r, referenceDate)])) as Record<
    HistoryRange,
    HistoryData
  >;

  const earliest = entries.reduce(
    (min, e) => (e.date < min ? e.date : min),
    entries[0]?.date ?? referenceDate
  );
  const monthKeys = listMonthKeys(earliest, referenceDate);
  const months = monthKeys.map((key) => ({ key, label: monthKeyToLabel(key) }));
  const monthSnapshots = Object.fromEntries(
    monthKeys.map((key) => [key, aggregateMonthSnapshot(entries, key, referenceDate)])
  );

  return { ranges, months, monthSnapshots };
}
