import { EXERCISES } from "@/lib/domain";

export type SeedEntry = {
  date: Date;
  exerciseId: string;
  unit: "reps" | "time";
  value: number;
};

function hash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h;
}

const DAYS_OF_HISTORY = 820; // a bit over 2 years, enough for All-time to span multiple years

// Deterministic fake workout history for local/demo use before a real database is connected.
// Same shape as what the Prisma-backed data layer returns, so swapping it out is a one-line change.
export function generateSeedEntries(referenceDate: Date = new Date()): SeedEntry[] {
  const entries: SeedEntry[] = [];
  const start = new Date(referenceDate);
  start.setHours(0, 0, 0, 0);

  for (let dayOffset = 0; dayOffset < DAYS_OF_HISTORY; dayOffset++) {
    const date = new Date(start);
    date.setDate(date.getDate() - dayOffset);
    const dayKey = date.toISOString().slice(0, 10);

    const worksOut = hash(dayKey) % 10 < 6; // ~60% of days
    if (!worksOut) continue;

    const exerciseCount = 1 + (hash(dayKey + "n") % 3); // 1-3 exercises that day
    for (let i = 0; i < exerciseCount; i++) {
      const ex = EXERCISES[hash(dayKey + "ex" + i) % EXERCISES.length];
      const value =
        ex.unit === "time"
          ? 30 + (hash(dayKey + ex.id) % 270) // 30-300s
          : 8 + (hash(dayKey + ex.id) % 60); // 8-67 reps
      entries.push({ date, exerciseId: ex.id, unit: ex.unit, value });
    }
  }

  return entries;
}
