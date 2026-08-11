import { EXERCISES } from "@/lib/domain";

// One color per exercise, assigned by fixed position in EXERCISES — not a hash, so two
// exercises can never land on the same color (a hash mod N can and did collide here).
// First 7 are the requested palette; the rest are generated to stay visually distinct
// from those 7 and from each other. Sized to cover every current exercise with headroom;
// bump this if EXERCISES grows past its length.
const PALETTE = [
  "#E1F87E", // Mindaro
  "#CBB8EF",
  "#FF8FAB",
  "#ECE75F",
  "#38D1B4",
  "#FF7F00",
  "#312E81",
  "#EB5757", // red
  "#2F80ED", // blue
  "#27AE60", // green
  "#9B51E0", // violet
  "#B8860B", // dark goldenrod
  "#56CCF2", // sky
  "#D946EF", // fuchsia
  "#219653", // dark green
  "#F2994A", // peach
  "#6FCF97", // mint
  "#8D6E63", // taupe
  "#F45D9C", // hot pink
];

const COLOR_BY_EXERCISE: Record<string, string> = Object.fromEntries(
  EXERCISES.map((ex, i) => [ex.id, PALETTE[i % PALETTE.length]])
);

export const OTHER_COLOR = "#9C9AB6"; // text-faint

// Deterministic per-exerciseId — same color every render, everywhere, never shared with
// another exercise as long as EXERCISES.length <= PALETTE.length.
export function colorForExercise(exerciseId: string): string {
  return COLOR_BY_EXERCISE[exerciseId] ?? OTHER_COLOR;
}
