import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getAllGuides } from "@/lib/guides";

export const metadata: Metadata = {
  title: "Calisthenics Training Guides",
  description:
    "Short, practical guides on tracking calisthenics progress: pull-ups, planche work, timed holds, and picking a tracking app.",
  alternates: { canonical: "/guides" },
  openGraph: {
    title: "Calisthenics Training Guides | Nickels & Dimes",
    description:
      "Practical guides on tracking calisthenics progress: pull-ups, planche work, timed holds, and choosing a tracker.",
  },
};

export default function GuidesIndex() {
  const guides = getAllGuides();

  return (
    <div className="min-h-dvh bg-bg">
      <header className="mx-auto flex max-w-3xl items-center justify-between px-5 py-4">
        <Link href="/">
          <Image
            src="/brand/logo-lockup.png"
            alt="Nickels & Dimes"
            width={216}
            height={147}
            className="w-[88px]"
          />
        </Link>
        <Link
          href="/login"
          className="rounded-[10px] bg-purple px-4 py-2 font-display text-[13px] uppercase tracking-wide text-white hover:bg-purple-deep"
        >
          Open the app
        </Link>
      </header>

      <main className="mx-auto max-w-3xl px-5 pb-20 pt-8">
        <h1 className="font-stencil text-[30px] uppercase leading-tight text-text sm:text-[38px]">
          Training guides
        </h1>
        <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-text-dim">
          Short, practical notes on tracking calisthenics progress. No programs, no fluff.
        </p>

        <ul className="mt-9 space-y-4">
          {guides.map((g) => (
            <li key={g.slug}>
              <Link
                href={`/guides/${g.slug}`}
                className="block rounded-[16px] border-[1.5px] border-border bg-surface p-5 transition-colors hover:border-purple"
              >
                <h2 className="font-display text-[18px] uppercase text-text">{g.title}</h2>
                <p className="mt-2 text-[14px] leading-relaxed text-text-dim">{g.description}</p>
                <span className="mt-3 inline-block font-data text-[11px] uppercase tracking-widest text-purple-deep">
                  {g.readingMinutes} min read
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-2 px-5 py-6 text-[12.5px] text-text-faint">
          <div className="flex w-full items-center justify-between">
            <Link href="/" className="font-data hover:text-text-dim">
              Nickels &amp; Dimes
            </Link>
            <Link href="/login" className="hover:text-text-dim">
              Open the app
            </Link>
          </div>
          <p>
            Built by{" "}
            <a
              href="https://walker-wolfson.pages.dev"
              target="_blank"
              rel="noopener"
              className="hover:text-text-dim"
            >
              Walker Wolfson, AI Operations Consulting
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
