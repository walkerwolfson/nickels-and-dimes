import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Flame, Trophy, Rss, Dumbbell } from "lucide-react";

export const metadata: Metadata = {
  title: "Nickels & Dimes: Calisthenics Rep Tracker with PRs, Clubs and Leaderboards",
  description:
    "Free calisthenics rep tracker. Log push-ups, pull-ups, dips and timed holds, auto-track a personal record for every movement, join public or private clubs, and climb a monthly reps leaderboard.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Nickels & Dimes: Calisthenics Rep Tracker with PRs and Leaderboards",
    description:
      "Log your reps and timed holds, track every PR automatically, and compete with your club on a monthly leaderboard. Free.",
  },
};

const FAQ = [
  {
    q: "Is it really free?",
    a: "Yes. There's no paid tier right now and no ads. If that changes later, early users get told first.",
  },
  {
    q: "What equipment do I need?",
    a: "A pull-up bar covers most of the list. Floor movements like push-ups, squats, and planks need nothing.",
  },
  {
    q: "Which movements can I track?",
    a: "Nineteen so far, including push-ups, pull-ups, chin-ups, dips, muscle-ups, pistol squats, pike and handstand push-ups, inverted rows, leg raises, and timed holds like planks and dead hangs.",
  },
  {
    q: "How does the leaderboard work?",
    a: "Each club has one. It adds up total reps logged during the calendar month and resets on the 1st, so there's always a fresh race.",
  },
  {
    q: "Who can see my workouts?",
    a: "Nickels & Dimes is social by design. Sets you log appear in a feed other members can like and comment on, and you get a profile with your records. Private clubs are the closed part: that leaderboard is only visible to members you invite.",
  },
  {
    q: "Do I need to install anything?",
    a: "No. It runs in your browser. Add it to your home screen and it opens like an app.",
  },
];

function MiniLeaderboard() {
  const rows = [
    { r: 1, name: "Jordan M.", v: "12,400" },
    { r: 2, name: "You", v: "11,120" },
    { r: 3, name: "Priya K.", v: "9,860" },
  ];
  return (
    <div className="rounded-[12px] border-[1.5px] border-border bg-surface p-3">
      {rows.map((row) => (
        <div key={row.r} className="flex items-center gap-3 py-1.5">
          <span
            className="font-display text-sm"
            style={{ width: 16, color: row.r <= 3 ? "var(--purple-deep)" : "var(--text-faint)" }}
          >
            {row.r}
          </span>
          <span className="flex-1 text-[13px] text-text">{row.name}</span>
          <span className="font-data text-[11.5px] text-text-dim">{row.v}</span>
        </div>
      ))}
    </div>
  );
}

function MiniPRs() {
  const rows = [
    { name: "Pull-ups", v: "24" },
    { name: "Dips", v: "48" },
    { name: "Dead-hang", v: "2:10" },
  ];
  return (
    <div className="rounded-[12px] border-[1.5px] border-border bg-surface p-3">
      {rows.map((row) => (
        <div
          key={row.name}
          className="flex items-center justify-between border-b border-border py-2 last:border-0"
        >
          <span className="text-[13px] font-medium text-text">{row.name}</span>
          <span className="flex items-center gap-1.5">
            <Flame size={12} color="var(--pink)" />
            <span className="font-display text-[15px] text-purple-deep">{row.v}</span>
          </span>
        </div>
      ))}
    </div>
  );
}

function MiniFeed() {
  return (
    <div className="rounded-[12px] border-[1.5px] border-border bg-surface p-3">
      <div className="flex items-center gap-2.5">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-purple font-data text-[10px] font-semibold text-white">
          CR
        </span>
        <div className="flex flex-col">
          <span className="text-[12px] font-bold text-text">Casey R.</span>
          <span className="font-data text-[9.5px] text-text-faint">3h ago</span>
        </div>
      </div>
      <p className="mt-2 font-display text-[14px] uppercase text-text">150 push-ups</p>
      <div className="mt-1.5 flex items-center gap-3 text-text-dim">
        <span className="flex items-center gap-1">
          <Flame size={12} color="var(--pink)" />
          <span className="font-data text-[10.5px]">12</span>
        </span>
        <span className="font-data text-[10.5px]">3 comments</span>
      </div>
    </div>
  );
}

function MiniWod() {
  return (
    <div className="rounded-[12px] border-[1.5px] border-border bg-surface p-3">
      <span className="font-data text-[10px] font-bold tracking-widest text-purple-deep">
        WORKOUT
      </span>
      <p className="mt-1 font-display text-[14px] uppercase text-text">Nickels and Dimes</p>
      <p className="mt-1 text-[12px] leading-snug text-text-dim">
        EMOM: 5 pull-ups + 10 push-ups per round. Log the rounds, it does the rep math.
      </p>
    </div>
  );
}

const FEATURES = [
  {
    icon: Flame,
    title: "Every PR, tracked for you",
    body:
      "Log a movement and the app checks it against your best. Beat it and the record updates on its own. Rep movements and timed holds are handled the same way.",
    visual: <MiniPRs />,
  },
  {
    icon: Trophy,
    title: "Clubs with a monthly leaderboard",
    body:
      "Start a public club anyone can join, or a private one for your training partners. The leaderboard ranks total reps for the month and clears on the 1st.",
    visual: <MiniLeaderboard />,
  },
  {
    icon: Rss,
    title: "A feed for your sets",
    body:
      "Every workout you log lands in the feed, where other members can like it and leave a comment. This is the social layer the serious weighted-calisthenics apps leave out.",
    visual: <MiniFeed />,
  },
  {
    icon: Dumbbell,
    title: "Named workouts, built in",
    body:
      "Log the Nickels and Dimes EMOM by the round and it converts to 5 pull-ups and 10 push-ups per round. Murph and a few others are ready to go too.",
    visual: <MiniWod />,
  },
];

export default function LandingPage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };

  return (
    <div className="min-h-dvh bg-bg">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        dangerouslySetInnerHTML={{
          __html:
            "document.addEventListener('click',function(e){var t=e.target.closest&&e.target.closest('[data-cta]');if(t&&typeof window.gtag==='function'){window.gtag('event','landing_cta_click',{cta_location:t.getAttribute('data-cta')})}},true);",
        }}
      />

      <header className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
        <Image
          src="/brand/logo-lockup.png"
          alt="Nickels & Dimes"
          width={216}
          height={147}
          priority
          className="w-[92px]"
        />
        <nav className="flex items-center gap-2">
          <Link
            href="/login"
            className="rounded-[10px] px-3 py-2 text-[13px] font-semibold text-text-dim hover:text-text"
          >
            Log in
          </Link>
          <Link
            href="/login"
            data-cta="header"
            className="rounded-[10px] bg-purple px-4 py-2 font-display text-[13px] uppercase tracking-wide text-white hover:bg-purple-deep"
          >
            Start free
          </Link>
        </nav>
      </header>

      <main>
        {/* Hero */}
        <section className="mx-auto max-w-3xl px-5 pb-14 pt-10 text-center sm:pt-16">
          <span className="font-data text-[11px] font-bold tracking-widest text-purple-deep">
            CALISTHENICS REP TRACKER
          </span>
          <h1 className="mx-auto mt-3 max-w-2xl font-stencil text-[34px] uppercase leading-[1.05] text-text sm:text-[46px]">
            Tracking built for people who keep score
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-[15.5px] leading-relaxed text-text-dim sm:text-base">
            Nickels &amp; Dimes logs your reps and timed holds, keeps a personal record for every
            movement, and drops you into a monthly leaderboard against your club. It&apos;s free, and
            there are no ads.
          </p>
          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/login"
              data-cta="hero"
              className="w-full rounded-[10px] bg-purple px-6 py-3.5 font-display text-[15px] uppercase tracking-wide text-white hover:bg-purple-deep sm:w-auto"
            >
              Start free
            </Link>
            <a
              href="#features"
              className="w-full rounded-[10px] border-[1.5px] border-border bg-surface px-6 py-3.5 text-[14px] font-semibold text-text hover:border-purple sm:w-auto"
            >
              See how it works
            </a>
          </div>
        </section>

        {/* What it looks like */}
        <section className="border-b border-border">
          <div className="mx-auto max-w-5xl px-5 pb-14">
            <h2 className="text-center font-display text-xl uppercase text-text sm:text-2xl">
              What it looks like
            </h2>
            <div className="mt-9 grid gap-5 sm:grid-cols-3">
              {[
                {
                  src: "/marketing/history.png",
                  w: 740,
                  h: 833,
                  alt: "Weekly rep totals broken down by movement with a bar chart",
                  cap: "Your last 7 days",
                },
                {
                  src: "/marketing/club.png",
                  w: 740,
                  h: 779,
                  alt: "A club leaderboard ranking members by push-ups this month",
                  cap: "Club leaderboard",
                },
                {
                  src: "/marketing/home.png",
                  w: 740,
                  h: 833,
                  alt: "The home feed showing a logged set with likes and comments",
                  cap: "The feed",
                },
              ].map((s) => (
                <figure key={s.src} className="m-0">
                  <Image
                    src={s.src}
                    alt={s.alt}
                    width={s.w}
                    height={s.h}
                    className="w-full rounded-[16px] border-[1.5px] border-border shadow-sm"
                  />
                  <figcaption className="mt-2.5 text-center font-data text-[10px] uppercase tracking-widest text-text-faint">
                    {s.cap}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* Why it exists */}
        <section className="border-y border-border bg-surface">
          <div className="mx-auto max-w-3xl px-5 py-12">
            <h2 className="font-display text-xl uppercase text-text sm:text-2xl">Why it exists</h2>
            <div className="mt-4 space-y-3 text-[15px] leading-relaxed text-text-dim">
              <p>
                I was logging my own sets in the Notes app and none of the trackers I tried fit the
                job. Most were packed with coaching programs I didn&apos;t want. The rest were barbell
                apps with bodyweight reps bolted on.
              </p>
              <p>
                The two good apps for serious weighted calisthenics, Weighted and StreetLifter, both
                leave out anything social on purpose. Nickels &amp; Dimes is the piece they skip: the
                same careful logging, plus clubs, a leaderboard, and a feed.
              </p>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="mx-auto max-w-5xl px-5 py-14">
          <h2 className="text-center font-display text-xl uppercase text-text sm:text-2xl">
            What you get
          </h2>
          <div className="mt-9 grid gap-6 sm:grid-cols-2">
            {FEATURES.map(({ icon: Icon, title, body, visual }) => (
              <div
                key={title}
                className="flex flex-col rounded-[16px] border-[1.5px] border-border bg-surface p-5"
              >
                <div className="flex items-center gap-2.5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-purple-soft">
                    <Icon size={17} color="var(--purple-deep)" />
                  </span>
                  <h3 className="font-display text-[17px] uppercase text-text">{title}</h3>
                </div>
                <p className="mt-3 text-[14px] leading-relaxed text-text-dim">{body}</p>
                <div className="mt-4">{visual}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Who it's for */}
        <section className="border-y border-border bg-surface">
          <div className="mx-auto max-w-3xl px-5 py-12">
            <h2 className="font-display text-xl uppercase text-text sm:text-2xl">Who it&apos;s for</h2>
            <p className="mt-4 text-[15px] leading-relaxed text-text-dim">
              You&apos;re already working a progression like the planche, front lever, one-arm
              pull-up, or a heavy weighted dip. You track your training somewhere, whether that&apos;s
              a spreadsheet or a notes app. You&apos;d rather see the number than a motivational
              quote. That&apos;s the person this is built for. If you&apos;re earlier on and running
              the r/bodyweightfitness routine, it works for you too.
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section className="mx-auto max-w-3xl px-5 py-14">
          <h2 className="font-display text-xl uppercase text-text sm:text-2xl">Questions</h2>
          <dl className="mt-6 divide-y divide-border border-y border-border">
            {FAQ.map(({ q, a }) => (
              <div key={q} className="py-5">
                <dt className="text-[15px] font-semibold text-text">{q}</dt>
                <dd className="mt-2 text-[14px] leading-relaxed text-text-dim">{a}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Final CTA */}
        <section className="mx-auto max-w-3xl px-5 pb-20 text-center">
          <h2 className="font-stencil text-[26px] uppercase leading-tight text-text sm:text-[32px]">
            Start logging today
          </h2>
          <p className="mx-auto mt-3 max-w-md text-[14.5px] text-text-dim">
            Make an account in under a minute. Bring your numbers, or start from your next set.
          </p>
          <Link
            href="/login"
            data-cta="footer_cta"
            className="mt-6 inline-block rounded-[10px] bg-purple px-8 py-3.5 font-display text-[15px] uppercase tracking-wide text-white hover:bg-purple-deep"
          >
            Start free
          </Link>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 px-5 py-6 text-[12.5px] text-text-faint sm:flex-row">
          <span className="font-data">Nickels &amp; Dimes</span>
          <div className="flex items-center gap-4">
            <Link href="/login" className="hover:text-text-dim">
              Log in
            </Link>
            <a
              href="https://www.producthunt.com/products/nickels-dimes"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-text-dim"
            >
              Product Hunt
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
