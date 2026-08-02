import { prisma } from "@/lib/prisma";
import { EXERCISE_BY_ID } from "@/lib/domain";

export type TodayBreakdownItem = { exerciseId: string; name: string; unit: "reps" | "time"; value: number };

export async function getTodayBreakdown(userId: string): Promise<TodayBreakdownItem[]> {
  if (!process.env.DATABASE_URL) return [];

  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);

  const entries = await prisma.logEntry.findMany({
    where: { workoutLog: { userId, loggedAt: { gte: start, lt: end } } },
    select: { exerciseId: true, unit: true, value: true },
  });

  const totals = new Map<string, number>();
  for (const e of entries) {
    totals.set(e.exerciseId, (totals.get(e.exerciseId) ?? 0) + e.value);
  }

  return [...totals.entries()]
    .map(([exerciseId, value]) => ({
      exerciseId,
      name: EXERCISE_BY_ID[exerciseId]?.name ?? exerciseId,
      unit: (EXERCISE_BY_ID[exerciseId]?.unit ?? "reps") as "reps" | "time",
      value,
    }))
    .sort((a, b) => b.value - a.value);
}
