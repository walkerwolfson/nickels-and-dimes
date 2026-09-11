import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Flame } from "lucide-react";

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

// Rendered mockups instead of static screenshots for the "What it looks like" section —
// a real screenshot needs re-capturing (and can crop mid-scroll, exactly what was wrong
// with the old ones) every time the app's UI changes; these are just JSX, so they stay
// accurate for free and never cut off content unintentionally.
function TabMockup({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="h-full rounded-[16px] border-[1.5px] border-border bg-surface p-4 shadow-sm">
      <h3 className="font-stencil text-[15px] uppercase tracking-wide text-text">{title}</h3>
      <span className="font-data text-[10px] text-text-faint">{subtitle}</span>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function PRsMockup() {
  const rows = [
    { name: "Pull-ups", v: "24" },
    { name: "Push-ups", v: "150" },
    { name: "Dips", v: "48" },
    { name: "Muscle-ups", v: null },
  ];
  return (
    <div>
      {rows.map((row) => (
        <div
          key={row.name}
          className="flex items-center justify-between border-b border-border py-2.5 last:border-0"
        >
          <span className="text-[13px] font-medium text-text">{row.name}</span>
          {row.v ? (
            <span className="flex items-center gap-1.5">
              <Flame size={12} color="var(--pink)" />
              <span className="font-display text-[16px] text-purple-deep">{row.v}</span>
            </span>
          ) : (
            <span className="font-data text-[10.5px] italic text-text-faint">Set a New PR!</span>
          )}
        </div>
      ))}
    </div>
  );
}

function ClubsMockup() {
  const rows = [
    { r: 1, name: "You", v: "120" },
    { r: 2, name: "Jordan M.", v: "98" },
    { r: 3, name: "Priya K.", v: "76" },
  ];
  return (
    <div>
      <span className="inline-block rounded-[8px] bg-purple-soft px-2.5 py-1 font-data text-[10px] font-bold text-purple-deep">
        New York Calisthenics
      </span>
      <div className="mt-3 flex items-end justify-between">
        <div>
          <span className="font-data text-[10px] uppercase tracking-wide text-text-faint">
            Push-ups · this month
          </span>
          <div className="font-display text-[28px] leading-none text-text">120</div>
        </div>
        <span className="font-data text-[11px] font-bold text-purple-deep">1st place</span>
      </div>
      <div className="mt-3 divide-y divide-border border-t border-border">
        {rows.map((row) => (
          <div key={row.r} className="flex items-center gap-3 py-2">
            <span
              className="font-display text-sm"
              style={{ width: 16, color: row.r === 1 ? "var(--purple-deep)" : "var(--text-faint)" }}
            >
              {row.r}
            </span>
            <span className="flex-1 text-[13px] text-text">{row.name}</span>
            <span className="font-data text-[11.5px] text-text-dim">{row.v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function FeedMockup() {
  return (
    <div>
      <div className="rounded-[12px] border-[1.5px] border-border bg-bg p-3">
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
      <span className="mt-2.5 block font-data text-[10px] text-text-faint">
        + 12 more sets logged today
      </span>
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-dvh bg-bg">
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
            Sign Up
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
          <div className="mt-7 flex justify-center">
            <Link
              href="/login"
              data-cta="hero"
              className="w-full rounded-[10px] bg-purple px-6 py-3.5 font-display text-[15px] uppercase tracking-wide text-white hover:bg-purple-deep sm:w-auto"
            >
              Sign Up
            </Link>
          </div>
        </section>

        {/* What it looks like */}
        <section>
          <div className="mx-auto max-w-5xl px-5 pb-14">
            <h2 className="text-center font-display text-xl uppercase text-text sm:text-2xl">
              What it looks like
            </h2>
            <div className="mt-9 grid gap-5 sm:grid-cols-3">
              <TabMockup title="PRs" subtitle="Personal records across every movement">
                <PRsMockup />
              </TabMockup>
              <TabMockup title="Clubs" subtitle="Push-ups · this month">
                <ClubsMockup />
              </TabMockup>
              <TabMockup title="The Feed" subtitle="Sunday, Sep 6">
                <FeedMockup />
              </TabMockup>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-3 px-5 py-6 text-[12.5px] text-text-faint">
          <div className="flex w-full flex-col items-center justify-between gap-3 sm:flex-row">
            <span className="font-data">Nickels &amp; Dimes</span>
            <div className="flex items-center gap-4">
              <Link href="/guides" className="hover:text-text-dim">
                Guides
              </Link>
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
          <p>
            Built by{" "}
            <a
              href="https://walker-wolfson.pages.dev"
              target="_blank"
              rel="noopener"
              className="hover:text-text-dim"
            >
              Walker Wolfson
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
