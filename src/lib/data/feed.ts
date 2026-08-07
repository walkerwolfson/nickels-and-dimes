import { prisma } from "@/lib/prisma";
import { colorForUser } from "@/lib/user-colors";
import { fmtRelativeTime, fmtTime, EXERCISE_BY_ID } from "@/lib/domain";

export type FeedPost = {
  id: string;
  userId: string;
  person: string;
  photoUrl: string | null;
  initials: string;
  color: string;
  time: string;
  lines: string[];
  durationSec: number | null;
  likes: number;
  likedByMe: boolean;
  comments: number;
};

function initials(name: string): string {
  return name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
}

// Collapses every logged entry down to one line per exercise (summed), the same
// way the home page's "Today's Work" hero does — a workout with several sets of
// the same movement shouldn't read as a wall of repeated lines in the feed.
function summarizeEntries(entries: { exerciseId: string; unit: string; value: number }[]): string[] {
  const totals = new Map<string, { unit: string; value: number }>();
  for (const e of entries) {
    const existing = totals.get(e.exerciseId);
    if (existing) existing.value += e.value;
    else totals.set(e.exerciseId, { unit: e.unit, value: e.value });
  }
  return [...totals.entries()]
    .sort((a, b) => b[1].value - a[1].value)
    .map(([exerciseId, { unit, value }]) => {
      const name = EXERCISE_BY_ID[exerciseId]?.name ?? exerciseId;
      return unit === "time" ? `${name} — ${fmtTime(value)}` : `${value} ${name}`;
    });
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
      entries: { select: { exerciseId: true, unit: true, value: true } },
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
    lines: summarizeEntries(log.entries),
    durationSec: log.durationSec,
    likes: log._count.likes,
    likedByMe: log.likes.length > 0,
    comments: log._count.comments,
  }));
}
