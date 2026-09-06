import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllGuides, getGuide, type GuideBlock } from "@/lib/guides";

export function generateStaticParams() {
  return getAllGuides().map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) return {};
  return {
    title: guide.title,
    description: guide.description,
    alternates: { canonical: `/guides/${guide.slug}` },
    openGraph: {
      type: "article",
      title: `${guide.title} | Nickels & Dimes`,
      description: guide.description,
    },
  };
}

function Block({ block }: { block: GuideBlock }) {
  if (block.type === "h2") {
    return (
      <h2 className="mt-8 font-display text-[19px] uppercase text-text">{block.text}</h2>
    );
  }
  if (block.type === "ul") {
    return (
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-[15px] leading-relaxed text-text-dim">
        {block.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    );
  }
  return <p className="mt-3 text-[15px] leading-relaxed text-text-dim">{block.text}</p>;
}

export default async function GuidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();

  const related = getAllGuides().filter((g) => g.slug !== guide.slug);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.description,
    dateModified: guide.updated,
    datePublished: guide.updated,
    author: { "@type": "Organization", name: "Nickels & Dimes" },
    publisher: { "@type": "Organization", name: "Nickels & Dimes" },
    mainEntityOfPage: `https://nickelsanddimes.app/guides/${guide.slug}`,
  };

  return (
    <div className="min-h-dvh bg-bg">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

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

      <main className="mx-auto max-w-3xl px-5 pb-16 pt-6">
        <Link
          href="/guides"
          className="font-data text-[11px] uppercase tracking-widest text-purple-deep hover:underline"
        >
          &larr; All guides
        </Link>

        <article className="mt-4">
          <h1 className="font-stencil text-[28px] uppercase leading-tight text-text sm:text-[36px]">
            {guide.title}
          </h1>
          <p className="mt-2 font-data text-[11px] uppercase tracking-widest text-text-faint">
            {guide.readingMinutes} min read
          </p>

          {guide.body.map((block, i) => (
            <Block key={i} block={block} />
          ))}
        </article>

        <div className="mt-10 rounded-[16px] border-[1.5px] border-border bg-surface p-6 text-center">
          <p className="font-display text-[17px] uppercase text-text">Track it in the app</p>
          <p className="mx-auto mt-2 max-w-md text-[14px] leading-relaxed text-text-dim">
            Nickels &amp; Dimes logs every set and timed hold, keeps a personal record for each
            movement, and sums your reps for the month against your club. Free, no ads.
          </p>
          <Link
            href="/login"
            className="mt-4 inline-block rounded-[10px] bg-purple px-7 py-3 font-display text-[14px] uppercase tracking-wide text-white hover:bg-purple-deep"
          >
            Start free
          </Link>
        </div>

        {related.length > 0 && (
          <section className="mt-12">
            <h2 className="font-display text-[15px] uppercase text-text">More guides</h2>
            <ul className="mt-4 space-y-3">
              {related.map((g) => (
                <li key={g.slug}>
                  <Link
                    href={`/guides/${g.slug}`}
                    className="text-[14px] font-medium text-purple-deep hover:underline"
                  >
                    {g.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-2 px-5 py-6 text-[12.5px] text-text-faint">
          <div className="flex w-full items-center justify-between">
            <Link href="/" className="font-data hover:text-text-dim">
              Nickels &amp; Dimes
            </Link>
            <Link href="/guides" className="hover:text-text-dim">
              All guides
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
