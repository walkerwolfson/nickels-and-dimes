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

// Global feed: every logged-in user's posts, visible to everyone — clubs are a
// separate, private/opt-in leaderboard grouping and don't gate feed visibility.
export async function getFeed(userId: string): Promise<FeedPost[]> {
  if (!process.env.DATABASE_URL) return [];

  const logs = await prisma.workoutLog.findMany({
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
