"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";
import { colorForUser } from "@/lib/user-colors";
import { fmtRelativeTime } from "@/lib/domain";

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

export type CommentItem = {
  id: string;
  userId: string;
  person: string;
  photoUrl: string | null;
  initials: string;
  color: string;
  body: string;
  time: string;
};

function initials(name: string): string {
  return name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
}

export async function getComments(workoutLogId: string): Promise<CommentItem[]> {
  const comments = await prisma.feedComment.findMany({
    where: { workoutLogId },
    orderBy: { createdAt: "asc" },
    include: { profile: { select: { displayName: true, photoUrl: true } } },
  });

  return comments.map((c) => ({
    id: c.id,
    userId: c.userId,
    person: c.profile.displayName,
    photoUrl: c.profile.photoUrl,
    initials: initials(c.profile.displayName),
    color: colorForUser(c.userId),
    body: c.body,
    time: fmtRelativeTime(c.createdAt),
  }));
}

export async function addComment(workoutLogId: string, body: string): Promise<void> {
  const userId = await getCurrentUserId();
  const trimmed = body.trim().slice(0, 500);
  if (!trimmed) return;

  await prisma.feedComment.create({ data: { workoutLogId, userId, body: trimmed } });
  revalidatePath("/home");
}

export async function deleteWorkoutLog(workoutLogId: string): Promise<{ error?: string }> {
  const userId = await getCurrentUserId();

  const log = await prisma.workoutLog.findUnique({
    where: { id: workoutLogId },
    select: { userId: true, entries: { select: { exerciseId: true } } },
  });
  if (!log) return {};
  if (log.userId !== userId) {
    return { error: "You can only delete your own posts." };
  }

  const exerciseIds = [...new Set(log.entries.map((e) => e.exerciseId))];

  // Deleting the log cascades its LogEntry/FeedLike/FeedComment rows, but the
  // separate PersonalRecord cache needs recomputing in case this log held the PR.
  await prisma.workoutLog.delete({ where: { id: workoutLogId } });

  await Promise.all(
    exerciseIds.map(async (exerciseId) => {
      const remaining = await prisma.logEntry.findMany({
        where: { exerciseId, workoutLog: { userId } },
        select: { value: true },
      });
      if (remaining.length === 0) {
        await prisma.personalRecord.deleteMany({ where: { userId, exerciseId } });
        return;
      }
      const best = Math.max(...remaining.map((e) => e.value));
      await prisma.personalRecord.upsert({
        where: { userId_exerciseId: { userId, exerciseId } },
        create: { userId, exerciseId, value: best },
        update: { value: best },
      });
    })
  );

  revalidatePath("/home");
  revalidatePath("/history");
  revalidatePath("/prs");
  revalidatePath("/club");
  return {};
}
