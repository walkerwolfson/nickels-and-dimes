// Public SEO/marketing content. These render at /guides and /guides/[slug],
// outside the (app) route group, so they have no auth and no bottom nav.
// To add a guide: append an object to GUIDES. Nothing else needs to change —
// the index page, the [slug] page, the sitemap, and the JSON-LD all read from here.

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
    slug: "how-to-track-your-push-up-progress",
    title: "How to Track Your Push-Up Progress",
    description:
      "Push-ups are easy to stop counting once you hit twenty or thirty. That is exactly when tracking starts to matter. Here is how to log variations, volume, and a real benchmark.",
    updated: "2026-09-06",
    readingMinutes: 4,
    body: [
      {
        type: "p",
        text: "Push-ups are where most people start and where most people stop paying attention. Once you can do twenty or thirty, it is tempting to stop counting. That is exactly when tracking starts to matter, because progress from here comes from harder variations and higher volume, not just more reps.",
      },
      { type: "h2", text: "Log the variation, not just \"push-ups\"" },
      {
        type: "p",
        text: "Standard, diamond, archer, decline, pseudo planche, and ring push-ups are different exercises. Ten archer push-ups per side is not the same as ten standard reps. Give each variation its own entry so your log reflects what you actually did.",
      },
      { type: "h2", text: "Set a clean-form rep test" },
      {
        type: "p",
        text: "Pick one variation, usually standard push-ups, and test your max every two to four weeks: chest to fist height or the floor, full lockout, a straight line from head to heels, no sagging hips. Do it fresh. Half reps inflate the count and hide plateaus.",
      },
      { type: "h2", text: "Push weekly volume before chasing a max" },
      {
        type: "p",
        text: "Total push-ups per week predicts progress better than any single set. If you did 400 last week across all sessions and 250 this week, your max is not going to move. A tracker that adds up the week saves you the spreadsheet.",
      },
      { type: "h2", text: "Progress by making reps harder, not just longer" },
      {
        type: "p",
        text: "Once standard sets of 25 to 30 feel easy, add difficulty instead of reps: elevate your feet, slow the lowering phase to three seconds, move to archer or pseudo planche push-ups, or add a weighted vest. Track the new variation from its own starting point.",
      },
      { type: "h2", text: "Use push-ups as a daily minimum" },
      {
        type: "p",
        text: "Push-ups are low-fatigue enough to train most days. A small daily set, logged, builds a streak and a volume base that carries your bigger sessions. Grease the groove works well here: several short sets through the day, all logged, none taken to failure.",
      },
    ],
  },
  {
    slug: "calisthenics-progression",
    title: "How Calisthenics Progression Actually Works",
    description:
      "Calisthenics progression is not one line from easy to hard. It is three parallel tracks moving at different speeds: base strength, rep endurance, and skill work. Here is how they fit together.",
    updated: "2026-09-06",
    readingMinutes: 5,
    body: [
      {
        type: "p",
        text: "Calisthenics progression is not a straight line from easy to hard. It is a set of parallel tracks: your base strength, your rep endurance, and your skill work, all moving at different speeds. Understanding how they fit together is what keeps you from spinning your wheels.",
      },
      { type: "h2", text: "Build the base first" },
      {
        type: "p",
        text: "Before any serious skill work, you want rough targets in the basics: around 15 to 25 strict push-ups, 8 to 12 strict pull-ups, 10 to 15 dips, and a solid 30 to 60 second plank and hollow hold. These are not hard gates, but skill training goes much faster once they are there.",
      },
      { type: "h2", text: "Progress strength by leverage, not reps" },
      {
        type: "p",
        text: "To get stronger at a movement, make the version you are doing harder rather than doing more reps of an easy one. Push-ups to archer push-ups to pseudo planche push-ups. Rows to pull-ups to archer pull-ups to one-arm work. Each step is a new exercise with its own rep range, usually starting around 3 to 5 reps.",
      },
      { type: "h2", text: "Progress skills by position and hold time" },
      {
        type: "p",
        text: "Skills like the front lever, planche, and handstand are trained in stages: tuck, advanced tuck, straddle, full. You move up when you can hold the current stage for roughly 10 to 15 seconds with clean form. Track the hold time per stage, not a single number for the whole skill.",
      },
      { type: "h2", text: "Keep rep endurance on its own track" },
      {
        type: "p",
        text: "High-rep sets of the basics build work capacity and healthy joints, and they progress quickly. Run them alongside your strength and skill work, not instead of it. This is the track where daily volume and grease the groove pay off.",
      },
      { type: "h2", text: "Expect the tracks to move at different rates" },
      {
        type: "p",
        text: "Your push-up max might climb every week while a lever hold sits still for a month. That is normal. Logging all three tracks separately is what lets you see that something is progressing even when the thing you care about most is not.",
      },
    ],
  },
  {
    slug: "the-murph-workout",
    title: "The Murph Workout: How to Pace It and Track It",
    description:
      "Murph is a one-mile run, 100 pull-ups, 200 push-ups, 300 squats, and another mile, usually in a vest. It is a pacing test as much as a fitness test. Here is how to run it and log it.",
    updated: "2026-09-06",
    readingMinutes: 4,
    body: [
      {
        type: "p",
        text: "Murph is a benchmark workout done every Memorial Day in honor of Lt. Michael Murphy: a one-mile run, 100 pull-ups, 200 push-ups, 300 air squats, and another one-mile run, traditionally in a weighted vest. It is a test of pacing as much as fitness, and it is easy to blow up in the first ten minutes.",
      },
      { type: "h2", text: "The standard structure" },
      {
        type: "p",
        text: "One mile run, then 100 pull-ups, 200 push-ups, 300 squats, then one mile run. The middle work can be broken up however you want. Almost nobody does 100 pull-ups straight. The classic approach is Cindy rounds: 20 rounds of 5 pull-ups, 10 push-ups, and 15 squats, which adds up to exactly 100 / 200 / 300.",
      },
      { type: "h2", text: "Pace the first run" },
      {
        type: "p",
        text: "Run the opening mile at a pace you could hold a conversation at. The calisthenics middle is where the time is won or lost, and arriving there already redlined turns a 45-minute Murph into a 75-minute grind. If anything, negative-split it: easier out, harder back.",
      },
      { type: "h2", text: "Break the reps before you have to" },
      {
        type: "p",
        text: "Do not go to failure on early sets. If you can do 15 push-ups, do sets of 8. Small, sub-failure sets with short rests keep your overall pace higher than big sets followed by long recoveries. The Cindy-round structure enforces this for you.",
      },
      { type: "h2", text: "Scale it honestly" },
      {
        type: "p",
        text: "Half Murph, which is half of every number, is a legitimate scale. So is dropping the vest, using band-assisted pull-ups, or doing ring rows instead. Log what you actually did, including the scale, so next year's comparison means something.",
      },
      { type: "h2", text: "Track it as one entry" },
      {
        type: "p",
        text: "Log Murph as a single workout with the date and your total time, not 300 separate lines. In Nickels & Dimes it is a built-in workout: mark it complete and it records the full 100 / 200 / 300 breakdown for you, so it still counts toward your pull-up, push-up, and squat records and your monthly total.",
      },
    ],
  },
  {
    slug: "david-goggins-training-volume",
    title: "The David Goggins Approach to Training Volume",
    description:
      "The method under the intensity is simple: high volume, near-daily, tracked, and increased slowly. Here is how to apply a Goggins-style volume approach to calisthenics without getting hurt.",
    updated: "2026-09-06",
    readingMinutes: 4,
    body: [
      {
        type: "p",
        text: "David Goggins built his reputation on doing far more work than seems reasonable, then doing it again the next day. Whatever you think of the intensity, the method underneath is simple and it transfers well to calisthenics: high volume, near-daily, tracked, and increased slowly. Here is how to apply it without getting hurt.",
      },
      { type: "h2", text: "The core idea is accumulated volume" },
      {
        type: "p",
        text: "Goggins is known publicly for extreme feats, including breaking the Guinness World Record for pull-ups in 24 hours in 2013 with 4,030 reps. The record is not the lesson. The lesson is that the number was built from months of high daily volume done in small sets, most days, not from a handful of heroic sessions.",
      },
      { type: "h2", text: "Use small sets, spread out" },
      {
        type: "p",
        text: "The practical version is grease the groove: pick a movement, do sets well short of failure, spread across the day, every day. Five to ten pull-ups every time you walk past a bar adds up to a few hundred reps a day without ever leaving you too sore to train tomorrow.",
      },
      { type: "h2", text: "Track everything, because the point is the total" },
      {
        type: "p",
        text: "This approach only works if you can see the volume adding up. Log every set, even the two-rep ones. A weekly rep total is the number that tells you whether you are actually doing more over time or just feeling like it.",
      },
      { type: "h2", text: "Add volume slowly" },
      {
        type: "p",
        text: "The fast way to get injured is to double your daily reps in a week. Add roughly 10 to 20 percent per week, hold when your joints complain, and take a lighter week every fourth or fifth week. Goggins-level volume took Goggins years to build.",
      },
      { type: "h2", text: "Consistency beats intensity here" },
      {
        type: "p",
        text: "One brutal session that needs three days of recovery moves you less than a moderate session you can repeat tomorrow. The whole method rests on being able to show up daily, so protect that ability above all.",
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
