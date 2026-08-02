import { FRIENDS } from "@/lib/data/friends";

export const RANGES = ["This month", "Last month", "This year", "Last year", "All time"] as const;
export type LeaderboardRange = (typeof RANGES)[number];

const RANGE_MULTIPLIER: Record<LeaderboardRange, number> = {
  "This month": 1,
  "Last month": 0.85,
  "This year": 7,
  "Last year": 6.5,
  "All time": 14,
};

function hash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h;
}

export function repLeaderboard(exerciseKey: string, range: LeaderboardRange) {
  const mult = RANGE_MULTIPLIER[range];
  return FRIENDS.map((f) => {
    const factor = 0.5 + (hash(f.name + exerciseKey) % 1000) / 1000;
    const base = 60 + (hash(f.name) % 40) * 4;
    const value = Math.round(base * factor * mult);
    return { ...f, value };
  }).sort((a, b) => b.value - a.value);
}

// value = seconds held, for time-based exercises (same field name as repLeaderboard so
// callers don't need to branch on which property to read, only on how to format it).
export function timeLeaderboard(exerciseKey: string) {
  return FRIENDS.map((f) => {
    const value = 45 + (hash(f.name + exerciseKey) % 320);
    return { ...f, value };
  }).sort((a, b) => b.value - a.value);
}
