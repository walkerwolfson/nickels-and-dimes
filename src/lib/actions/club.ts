"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";

export async function joinClub(clubId: string): Promise<void> {
  const userId = await getCurrentUserId();
  await prisma.clubMembership.upsert({
    where: { clubId_userId: { clubId, userId } },
    create: { clubId, userId },
    update: {},
  });
  revalidatePath("/club");
}

export async function createClub(name: string): Promise<{ id: string }> {
  const userId = await getCurrentUserId();
  const trimmed = name.trim();
  if (!trimmed) throw new Error("Club name can't be empty.");

  const club = await prisma.club.create({
    data: {
      name: trimmed,
      createdById: userId,
      isPublic: true,
      memberships: { create: { userId } },
    },
  });

  revalidatePath("/club");
  return { id: club.id };
}
