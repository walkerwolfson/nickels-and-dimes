import { prisma } from "@/lib/prisma";
import { generateSeedEntries } from "@/lib/data/seed";
import { DEMO_USER_ID } from "@/lib/demo-user";

// exerciseId/wodId -> PR value (reps, or seconds for time-based exercises)
export async function getPRs(userId: string = DEMO_USER_ID): Promise<Record<string, number>> {
  if (!process.env.DATABASE_URL) {
    const entries = generateSeedEntries();
    const best: Record<string, number> = {};
    for (const e of entries) {
      if (!best[e.exerciseId] || e.value > best[e.exerciseId]) best[e.exerciseId] = e.value;
    }
    return best;
  }

  const records = await prisma.personalRecord.findMany({ where: { userId } });
  return Object.fromEntries(records.map((r) => [r.exerciseId, r.value]));
}
