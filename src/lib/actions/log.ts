"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";
import { dateKeyToInstant } from "@/lib/timezone";

export type PostWorkoutInput = {
  lines: string[];
  totalReps: number;
  breakdown: Record<string, { name: string; unit: "reps" | "time"; value: number }>;
  durationSec?: number;
  loggedAtDateKey?: string; // "YYYY-MM-DD" — set when backfilling a past workout, omit for "now"
};

export async function postWorkout(input: PostWorkoutInput): Promise<void> {
  if (!process.env.DATABASE_URL) {
    // No database configured yet — the log flow still works end-to-end in the UI,
    // it just doesn't persist. Swap in once Supabase is connected.
    return;
  }

  const userId = await getCurrentUserId();

  await prisma.workoutLog.create({
    data: {
      userId,
      lines: input.lines,
      totalReps: input.totalReps,
      durationSec: input.durationSec,
      ...(input.loggedAtDateKey ? { loggedAt: dateKeyToInstant(input.loggedAtDateKey) } : {}),
      entries: {
        create: Object.entries(input.breakdown).map(([exerciseId, info]) => ({
          exerciseId,
          unit: info.unit,
          value: info.value,
        })),
      },
    },
  });

  const existingRecords = await prisma.personalRecord.findMany({
    where: { userId, exerciseId: { in: Object.keys(input.breakdown) } },
  });
  const existingByExercise = new Map(existingRecords.map((r) => [r.exerciseId, r.value]));

  await Promise.all(
    Object.entries(input.breakdown).map(([exerciseId, info]) => {
      const best = Math.max(info.value, existingByExercise.get(exerciseId) ?? 0);
      return prisma.personalRecord.upsert({
        where: { userId_exerciseId: { userId, exerciseId } },
        create: { userId, exerciseId, value: best },
        update: { value: best },
      });
    })
  );

  revalidatePath("/home");
  revalidatePath("/history");
  revalidatePath("/prs");
}
