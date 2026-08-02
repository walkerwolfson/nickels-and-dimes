import { prisma } from "@/lib/prisma";
import { EXERCISES, EXERCISE_BY_ID } from "@/lib/domain";
import { colorForExercise, OTHER_COLOR } from "@/lib/exercise-colors";
import { generateSeedEntries, type SeedEntry } from "@/lib/data/seed";
import { DEMO_USER_ID } from "@/lib/demo-user";
import type { StackedBucket } from "@/components/charts/StackedBarChart";

export type HistoryRange = "W" | "M" | "Y" | "All";

export const RANGE_LABEL: Record<HistoryRange, string> = {
  W: "last 7 days",
  M: "last 4 weeks",
  Y: "last 12 months",
  All: "all time",
};

type Bucket = { start: Date; end: Date; label: string };

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function getBucketDefs(range: HistoryRange, referenceDate: Date, earliestDate: Date): Bucket[] {
  const today = startOfDay(referenceDate);
  const buckets: Bucket[] = [];

  if (range === "W") {
    for (let i = 6; i >= 0; i--) {
      const start = new Date(today);
      start.setDate(start.getDate() - i);
      const end = new Date(start);
      end.setDate(end.getDate() + 1);
      buckets.push({ start, end, label: start.toLocaleDateString(undefined, { weekday: "short" }) });
    }
  } else if (range === "M") {
    for (let i = 3; i >= 0; i--) {
      const end = new Date(today);
      end.setDate(end.getDate() - i * 7);
      const start = new Date(end);
      start.setDate(start.getDate() - 7);
      buckets.push({
        start,
        end,
        label: start.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
      });
    }
  } else if (range === "Y") {
    for (let i = 11; i >= 0; i--) {
      const start = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const end = new Date(today.getFullYear(), today.getMonth() - i + 1, 1);
      buckets.push({ start, end, label: start.toLocaleDateString(undefined, { month: "short" }) });
    }
  } else {
    const startYear = Math.min(earliestDate.getFullYear(), today.getFullYear());
    for (let year = startYear; year <= today.getFullYear(); year++) {
      buckets.push({
        start: new Date(year, 0, 1),
        end: new Date(year + 1, 0, 1),
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

const TOP_N_IN_CHART = 7; // matches the 7-color palette so no two shown exercises share a color

function aggregate(entries: SeedEntry[], range: HistoryRange, referenceDate: Date): HistoryData {
  const earliest = entries.reduce(
    (min, e) => (e.date < min ? e.date : min),
    entries[0]?.date ?? referenceDate
  );
  const buckets = getBucketDefs(range, referenceDate, earliest);

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

  return { range, heroTotal, breakdown, chart, rows };
}

export async function getHistoryData(range: HistoryRange, userId: string = DEMO_USER_ID): Promise<HistoryData> {
  const referenceDate = new Date();

  if (!process.env.DATABASE_URL) {
    return aggregate(generateSeedEntries(referenceDate), range, referenceDate);
  }

  const logEntries = await prisma.logEntry.findMany({
    where: { workoutLog: { userId } },
    select: { exerciseId: true, unit: true, value: true, workoutLog: { select: { loggedAt: true } } },
  });

  const entries: SeedEntry[] = logEntries.map((e) => ({
    date: e.workoutLog.loggedAt,
    exerciseId: e.exerciseId,
    unit: e.unit as "reps" | "time",
    value: e.value,
  }));

  return aggregate(entries, range, referenceDate);
}
