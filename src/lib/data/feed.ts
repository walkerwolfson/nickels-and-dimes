import { prisma } from "@/lib/prisma";
import { colorForUser } from "@/lib/user-colors";
import { fmtRelativeTime } from "@/lib/domain";

export type FeedPost = {
  id: string;
  userId: string;
  person: string;
  photoUrl: string | null;
  initials: string;
  color: string;
  time: string;
  lines: string[];
  likes: number;
  likedByMe: boolean;
  comments: number;
};

function initials(name: string): string {
  return name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
}

// Real feed: posts from you and anyone you share a club with — matches the brief's
// "friends'/club posts" since clubs are the only social graph this app has.
export async function getFeed(userId: string): Promise<FeedPost[]> {
  if (!process.env.DATABASE_URL) return [];

  const memberships = await prisma.clubMembership.findMany({ where: { userId }, select: { clubId: true } });
  const clubIds = memberships.map((m) => m.clubId);

  const clubMates =
    clubIds.length > 0
      ? await prisma.clubMembership.findMany({ where: { clubId: { in: clubIds } }, select: { userId: true } })
      : [];

  const feedUserIds = Array.from(new Set([userId, ...clubMates.map((m) => m.userId)]));

  const logs = await prisma.workoutLog.findMany({
    where: { userId: { in: feedUserIds } },
    orderBy: { loggedAt: "desc" },
    take: 20,
    include: {
      profile: { select: { displayName: true, photoUrl: true } },
      _count: { select: { likes: true, comments: true } },
      likes: { where: { userId }, select: { id: true } },
    },
  });

  return logs.map((log) => ({
    id: log.id,
    userId: log.userId,
    person: log.profile.displayName,
    photoUrl: log.profile.photoUrl,
    initials: initials(log.profile.displayName),
    color: colorForUser(log.userId),
    time: fmtRelativeTime(log.loggedAt),
    lines: log.lines,
    likes: log._count.likes,
    likedByMe: log.likes.length > 0,
    comments: log._count.comments,
  }));
}
