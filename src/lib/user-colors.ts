import { hash } from "@/lib/hash";

// Same family as exercise-colors, kept separate since the seed space (user ids) differs
// and we don't want a user's color to happen to collide conceptually with exercise colors.
const PALETTE = ["#8C6FF0", "#6FA4F0", "#FF6FA0", "#4E9E8C", "#E0A23E", "#B06FDB", "#3EA0A0"];

export function colorForUser(userId: string): string {
  return PALETTE[hash(userId) % PALETTE.length];
}
