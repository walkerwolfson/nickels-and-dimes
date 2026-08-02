import { prisma } from "@/lib/prisma";

export async function isAdmin(userId: string): Promise<boolean> {
  const profile = await prisma.profile.findUnique({ where: { id: userId }, select: { isAdmin: true } });
  return profile?.isAdmin ?? false;
}

export type AdminUserRow = {
  id: string;
  displayName: string;
  email: string | null;
  photoUrl: string | null;
  createdAt: Date;
  marketingOptIn: boolean;
  workoutCount: number;
  clubCount: number;
};

export async function getAllUsers(): Promise<AdminUserRow[]> {
  const profiles = await prisma.profile.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { workoutLogs: true, clubMemberships: true } } },
  });
  return profiles.map((p) => ({
    id: p.id,
    displayName: p.displayName,
    email: p.email,
    photoUrl: p.photoUrl,
    createdAt: p.createdAt,
    marketingOptIn: p.marketingOptIn,
    workoutCount: p._count.workoutLogs,
    clubCount: p._count.clubMemberships,
  }));
}
