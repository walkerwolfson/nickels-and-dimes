// Cyclic palette for per-exercise chart segments — stays within the app's established
// purple/blue/pink/yellow system rather than introducing arbitrary chart colors.
const PALETTE = [
  "#8C6FF0", // purple
  "#6FA4F0", // blue
  "#FF6FA0", // pink
  "#6E4FE0", // purpleDeep
  "#4E9E8C", // teal (already used for a friend avatar in the prototype)
  "#E0A23E", // amber (already used for a friend avatar in the prototype)
  "#B06FDB", // violet (already used for a friend avatar in the prototype)
];

import { hash } from "@/lib/hash";

// Deterministic per-exerciseId — same color every render, regardless of call order.
export function colorForExercise(exerciseId: string): string {
  return PALETTE[hash(exerciseId) % PALETTE.length];
}

export const OTHER_COLOR = "#9C9AB6"; // text-faint
