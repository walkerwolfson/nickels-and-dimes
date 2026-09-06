// Public SEO/marketing content. These render at /guides and /guides/[slug],
// outside the (app) route group, so they have no auth and no bottom nav.

export type GuideBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "ul"; items: string[] };

export type Guide = {
  slug: string;
  title: string;
  description: string;
  updated: string; // ISO date
  readingMinutes: number;
  body: GuideBlock[];
};

export const GUIDES: Guide[] = [
  {
    slug: "how-to-track-pull-up-progress",
    title: "How to Track Your Pull-Up Progress",
    description:
      "A simple system for logging pull-ups so you can actually tell whether you are getting stronger: per-set records, a fixed benchmark test, and weekly volume.",
    updated: "2026-09-06",
    readingMinutes: 4,
    body: [
      {
        type: "p",
        text: "Pull-ups are the movement most people want to improve and most people track badly. A number in your head, or a note that says \"did some pull-ups,\" tells you nothing three weeks later. Here is a system that works.",
      },
      { type: "h2", text: "Log every working set, not just the total" },
      {
        type: "p",
        text: "Write down each set the day you do it: the rep count, and whether it was strict, kipping, or assisted. Five sets of six is a different session from one set of twelve plus four sets of three, even though both add up to thirty. Over a month, the set-by-set record is what shows whether your endurance or your top-end strength is moving.",
      },
      { type: "h2", text: "Keep one benchmark test" },
      {
        type: "p",
        text: "Pick a single test and repeat it every two to four weeks under the same conditions: max strict reps from a dead hang, no kip, full lockout at the bottom, chin clearly over the bar. Do it fresh, early in the session. That one number is your progress marker. Everything else is training volume.",
      },
      { type: "h2", text: "Separate the variations" },
      {
        type: "p",
        text: "Strict pull-ups, chin-ups, and weighted pull-ups are different lifts. Chin-ups usually let you do more reps because the biceps contribute more. If you mix them into one line, your log looks like progress when you have just switched to an easier variation. Give each its own entry.",
      },
      { type: "h2", text: "Watch weekly volume, not single workouts" },
      {
        type: "p",
        text: "Total reps per week is the number that predicts progress. If last week was 120 strict pull-ups across all sessions and this week is 90, you either deloaded on purpose or something slipped. A tracker that sums the week for you makes that obvious without spreadsheet work.",
      },
      { type: "h2", text: "Add load once bodyweight reps stall" },
      {
        type: "p",
        text: "When you can do roughly twelve to fifteen clean strict reps, adding weight is usually more productive than chasing a higher rep count. Start with five to ten pounds on a belt and track the weighted max the same way you tracked the bodyweight one.",
      },
    ],
  },
  {
    slug: "how-to-track-a-planche-progression",
    title: "How to Track a Planche Progression",
    description:
      "The planche is a multi-year project where real progress is slow enough to feel like a plateau. Here is how to log holds, drills, and benchmarks so you can see it moving.",
    updated: "2026-09-06",
    readingMinutes: 4,
    body: [
      {
        type: "p",
        text: "The planche is a long project. Most people train it for a year or more before a clean full planche, and the progress between milestones is slow enough that it is easy to feel stuck when you are actually moving. Tracking is what keeps you honest.",
      },
      { type: "h2", text: "Track holds by time, per progression" },
      {
        type: "p",
        text: "The planche is trained in stages: tuck, advanced tuck, straddle, full. Each is its own movement for logging purposes. Record the length of your best hold in each session, in seconds, for whichever stage you are working. A jump from an eight-second advanced tuck to a twelve-second one is real progress even if it does not feel like much in the moment.",
      },
      { type: "h2", text: "Log the leans and drills too" },
      {
        type: "p",
        text: "Planche leans, pseudo planche push-ups, and band-assisted holds all build the same positions. Note the sets and reps, or the lean angle if you can estimate it. When your main hold stalls for a few weeks, the assistance log tells you whether you kept the supporting work up or let it slide.",
      },
      { type: "h2", text: "Use a consistent test position" },
      {
        type: "p",
        text: "Pick one stage as your benchmark, usually the hardest one you can hold for at least three to five seconds with clean form: full scapular protraction, hips at shoulder height, arms straight. Test it fresh once every two weeks. Film it occasionally so form creep does not inflate your numbers.",
      },
      { type: "h2", text: "Expect plateaus and plan around them" },
      {
        type: "p",
        text: "Planche progress comes in steps. You will hold a position for weeks with no change, then add several seconds across a few sessions. A log that spans months shows you this pattern and stops you from program-hopping every time a plateau shows up.",
      },
      { type: "h2", text: "Keep straight-arm and bent-arm work separate" },
      {
        type: "p",
        text: "Planche strength is straight-arm work. Pseudo planche push-ups are bent-arm. Both matter, but they progress on different timelines, so track them as separate entries rather than lumping them into one planche line.",
      },
    ],
  },
  {
    slug: "choosing-a-calisthenics-tracking-app",
    title: "What to Look for in a Calisthenics Tracking App",
    description:
      "Most training apps are built for barbell lifting, and most calisthenics apps are built around coaching programs. If you just want to log your own training, here is what actually matters.",
    updated: "2026-09-06",
    readingMinutes: 3,
    body: [
      {
        type: "p",
        text: "Most training apps are built for barbell lifting, and most calisthenics apps are built around coaching programs you have to follow. If you already know what you are doing and just want to log it, here is what actually matters.",
      },
      { type: "h2", text: "Reps and timed holds treated equally" },
      {
        type: "p",
        text: "Calisthenics is half reps, half holds: pull-ups and dips on one side, planks, L-sits, and planche holds on the other. An app that only does reps forces you to fake your hold work as a single rep. Timed movements should be first-class, with their own records.",
      },
      { type: "h2", text: "Automatic personal records" },
      {
        type: "p",
        text: "You should not have to remember your best set. The app should compare every entry against your history and update the record on its own, per movement and per variation.",
      },
      { type: "h2", text: "Weekly totals, not just single sessions" },
      {
        type: "p",
        text: "Progress in calisthenics tracks closely with weekly volume. An app that sums your reps for the week, and resets on a schedule, saves you from doing that math by hand.",
      },
      { type: "h2", text: "A social or competitive layer, if that is what keeps you training" },
      {
        type: "p",
        text: "The two most focused apps for serious weighted calisthenics, Weighted and StreetLifter, deliberately leave out anything social. That is the right call for some people and a dealbreaker for others. If a leaderboard or a feed is what gets you to show up, you need an app that has one. That is the gap Nickels & Dimes was built around.",
      },
      { type: "h2", text: "Low friction to log" },
      {
        type: "p",
        text: "If logging a set takes more than a few taps, you will stop doing it. Test the logging flow before you commit. The best tracker is the one you actually keep using.",
      },
    ],
  },
];

export function getAllGuides(): Guide[] {
  return GUIDES;
}

export function getGuide(slug: string): Guide | undefined {
  return GUIDES.find((g) => g.slug === slug);
}
