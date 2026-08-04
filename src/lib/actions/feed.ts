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
