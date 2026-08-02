export type ExerciseUnit = "reps" | "time";

export type Exercise = {
  id: string;
  name: string;
  unit: ExerciseUnit;
};

export const EXERCISES: Exercise[] = [
  { id: "pushups", name: "Push-ups", unit: "reps" },
  { id: "pullups", name: "Pull-ups", unit: "reps" },
  { id: "chinups", name: "Chin-ups", unit: "reps" },
  { id: "dips", name: "Dips", unit: "reps" },
  { id: "muscleups", name: "Muscle-ups", unit: "reps" },
  { id: "squats", name: "Squats", unit: "reps" },
  { id: "lunges", name: "Lunges", unit: "reps" },
  { id: "pistols", name: "Pistol squats", unit: "reps" },
  { id: "planks", name: "Planks", unit: "time" },
  { id: "legraises", name: "Leg raises", unit: "reps" },
  { id: "rows", name: "Inverted rows", unit: "reps" },
  { id: "pike", name: "Pike push-ups", unit: "reps" },
  { id: "hspu", name: "Handstand push-ups", unit: "reps" },
  { id: "burpees", name: "Burpees", unit: "reps" },
  { id: "mtnclimbers", name: "Mountain climbers", unit: "reps" },
  { id: "calfraises", name: "Calf raises", unit: "reps" },
  { id: "glutebridges", name: "Glute bridges", unit: "reps" },
];

export const EXERCISE_BY_ID: Record<string, Exercise> = Object.fromEntries(
  EXERCISES.map((e) => [e.id, e])
);

export type Wod = {
  id: string;
  name: string;
  desc: string;
  inputLabel: string;
  fixed?: boolean;
  convert: (rounds: number, partial?: Record<string, number>) => Record<string, number>;
};

export const WODS: Wod[] = [
  {
    id: "nickelsdimes",
    name: "Nickels and Dimes",
    desc: "EMOM: 5 pull-ups + 10 push-ups per round",
    inputLabel: "Rounds completed",
    convert: (rounds) => ({ pullups: rounds * 5, pushups: rounds * 10 }),
  },
  {
    id: "murph",
    name: "Murph",
    desc: "1mi run, 100 pull-ups, 200 push-ups, 300 squats, 1mi run",
    inputLabel: "Completed",
    fixed: true,
    convert: () => ({ pullups: 100, pushups: 200, squats: 300 }),
  },
  {
    id: "cindy",
    name: "Cindy",
    desc: "20-min AMRAP: 5 pull-ups, 10 push-ups, 15 air squats",
    inputLabel: "Full rounds + partial reps",
    convert: (rounds, partial = {}) => ({
      pullups: rounds * 5 + (partial.pullups || 0),
      pushups: rounds * 10 + (partial.pushups || 0),
      squats: rounds * 15 + (partial.squats || 0),
    }),
  },
];

export const WOD_BY_ID: Record<string, Wod> = Object.fromEntries(WODS.map((w) => [w.id, w]));

export function fmtTime(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = Math.floor(totalSeconds % 60);
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function fmtDateTime(date: Date): string {
  const today = new Date();
  const isToday = date.toDateString() === today.toDateString();
  const time = date.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
  if (isToday) return `Today, ${time}`;
  return `${date.toLocaleDateString(undefined, { month: "short", day: "numeric" })}, ${time}`;
}
