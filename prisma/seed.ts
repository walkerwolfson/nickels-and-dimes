import { PrismaClient } from "@prisma/client";
import { generateSeedEntries } from "../src/lib/data/seed";
import { DEMO_USER_ID } from "../src/lib/demo-user";

const prisma = new PrismaClient();

async function main() {
  await prisma.profile.upsert({
    where: { id: DEMO_USER_ID },
    create: { id: DEMO_USER_ID, displayName: "Walker Wolfson", email: "demo@nickelsanddimes.app" },
    update: {},
  });

  const entries = generateSeedEntries();

  // Group flat entries by day into one WorkoutLog per day (matching the real "session" shape).
  const byDay = new Map<string, typeof entries>();
  for (const e of entries) {
    const key = e.date.toISOString().slice(0, 10);
    if (!byDay.has(key)) byDay.set(key, []);
    byDay.get(key)!.push(e);
  }

  await prisma.logEntry.deleteMany({ where: { workoutLog: { userId: DEMO_USER_ID } } });
  await prisma.workoutLog.deleteMany({ where: { userId: DEMO_USER_ID } });
  await prisma.personalRecord.deleteMany({ where: { userId: DEMO_USER_ID } });

  const bestByExercise = new Map<string, number>();

  for (const [day, dayEntries] of byDay) {
    await prisma.workoutLog.create({
      data: {
        userId: DEMO_USER_ID,
        loggedAt: new Date(`${day}T12:00:00Z`),
        totalReps: dayEntries.filter((e) => e.unit === "reps").reduce((s, e) => s + e.value, 0),
        lines: dayEntries.map((e) => `${e.value} ${e.exerciseId}`),
        entries: {
          create: dayEntries.map((e) => ({ exerciseId: e.exerciseId, unit: e.unit, value: e.value })),
        },
      },
    });
    for (const e of dayEntries) {
      if (!bestByExercise.has(e.exerciseId) || e.value > bestByExercise.get(e.exerciseId)!) {
        bestByExercise.set(e.exerciseId, e.value);
      }
    }
  }

  for (const [exerciseId, value] of bestByExercise) {
    await prisma.personalRecord.create({ data: { userId: DEMO_USER_ID, exerciseId, value } });
  }

  console.log(`Seeded ${byDay.size} workout logs and ${bestByExercise.size} PRs for ${DEMO_USER_ID}.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
