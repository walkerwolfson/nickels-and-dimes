"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";

export async function toggleLike(workoutLogId: string): Promise<void> {
  const userId = await getCurrentUserId();

  const existing = await prisma.feedLike.findUnique({
    where: { workoutLogId_userId: { workoutLogId, userId } },
  });

  if (existing) {
    await prisma.feedLike.delete({ where: { id: existing.id } });
  } else {
    await prisma.feedLike.create({ data: { workoutLogId, userId } });
  }

  revalidatePath("/home");
}
