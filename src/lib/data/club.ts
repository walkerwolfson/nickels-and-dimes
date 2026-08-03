import { prisma } from "@/lib/prisma";
import { colorForUser } from "@/lib/user-colors";
import { EXERCISE_BY_ID } from "@/lib/domain";
import { zonedMonthStart, zonedYearStart } from "@/lib/timezone";

export type ClubSummary = { id: string; name: string; memberCount: number };

export async function getMyClubs(userId: string): Promise<ClubSummary[]> {
  const memberships = await prisma.clubMembership.findMany({
    where: { userId },
    include: { club: { include: { _count: { select: { memberships: true } } } } },
    orderBy: { joinedAt: "asc" },
  });
  return memberships.map((m) => ({
    id: m.club.id,
    name: m.club.name,
    memberCount: m.club._count.memberships,
  }));
}

export async function getDiscoverableClubs(userId: string, query: string): Promise<ClubSummary[]> {
  const clubs = await prisma.club.findMany({
    where: {
      isPublic: true,
      ...(query ? { name: { contains: query, mode: "insensitive" } } : {}),
      memberships: { none: { userId } },
    },
    include: { _count: { select: { memberships: true } } },
    orderBy: { createdAt: "desc" },
    take: 30,
  });
  return clubs.map((c) => ({ id: c.id, name: c.name, memberCount: c._count.memberships }));
}

export const LEADERBOARD_RANGES = ["This month", "Last month", "This year", "Last year", "All time"] as const;
export type LeaderboardRange = (typeof LEADERBOARD_RANGES)[number];

function rangeBounds(range: LeaderboardRange): { gte?: Date; lt?: Date } {
  const now = new Date();
  switch (range) {
    case "This month":
      return { gte: zonedMonthStart(now) };
    case "Last month":
      return { gte: zonedMonthStart(now, undefined, -1), lt: zonedMonthStart(now) };
    case "This year":
      return { gte: zonedYearStart(now) };
    case "Last year":
      return { gte: zonedYearStart(now, undefined, -1), lt: zonedYearStart(now) };
    case "All time":
      return {};
  }
}

export type LeaderboardRow = { userId: string; name: string; color: string; value: number };

export async function getClubLeaderboard(
  clubId: string,
  exerciseId: string,
  range: LeaderboardRange
): Promise<LeaderboardRow[]> {
  const members = await prisma.clubMembership.findMany({
    where: { clubId },
    include: { profile: true },
  });
  if (members.length === 0) return [];

  const unit = EXERCISE_BY_ID[exerciseId]?.unit ?? "reps";
  const memberIds = members.map((m) => m.userId);

  const entries = await prisma.logEntry.findMany({
    where: {
      exerciseId,
      workoutLog: {
        userId: { in: memberIds },
        // Time-based exercises rank by best-ever hold, not a sum within a range.
        ...(unit === "time" ? {} : { loggedAt: rangeBounds(range) }),
      },
    },
    select: { value: true, workoutLog: { select: { userId: true } } },
  });

  const totals = new Map<string, number>();
  for (const e of entries) {
    const uid = e.workoutLog.userId;
    if (unit === "time") {
      totals.set(uid, Math.max(totals.get(uid) ?? 0, e.value));
    } else {
      totals.set(uid, (totals.get(uid) ?? 0) + e.value);
    }
  }

  return members
    .map((m) => ({
      userId: m.userId,
      name: m.profile.displayName,
      color: colorForUser(m.userId),
      value: totals.get(m.userId) ?? 0,
    }))
    .sort((a, b) => b.value - a.value);
}
