"use client";

import { useRef, useState } from "react";
import { Heart, MessageCircle, Flame } from "lucide-react";
import { Avatar } from "@/components/Avatar";

const CLUB_ROWS = [
  { name: "Jordan M.", initials: "JM", color: "#8C6FF0", value: 1240 },
  { name: "Riley T.", initials: "RT", color: "#FF6FA0", value: 980 },
  { name: "Casey R.", initials: "CR", color: "#6FA4F0", value: 875 },
  { name: "Priya K.", initials: "PK", color: "#4E9E8C", value: 640 },
];

const FEED_POSTS = [
  { name: "Jordan M.", initials: "JM", color: "#8C6FF0", time: "3h ago", line: "150 PUSH-UPS", likes: 12, comments: 3 },
  { name: "Casey R.", initials: "CR", color: "#6FA4F0", time: "1d ago", line: "NICKELS AND DIMES — 15 ROUNDS", likes: 8, comments: 1 },
];

const PR_ROWS = [
  { name: "Push-ups", value: "185" },
  { name: "Pull-ups", value: "22" },
  { name: "Dips", value: "45" },
  { name: "Planks", value: "3:20" },
  { name: "Muscle-ups", value: "4" },
];

function SlideFrame({
  label,
  headline,
  children,
}: {
  label: string;
  headline: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex w-full flex-shrink-0 flex-col gap-3 px-6" style={{ scrollSnapAlign: "center" }}>
      <div className="flex flex-col items-center gap-1 text-center">
        <span className="font-data text-[10px] font-bold tracking-widest text-purple-deep">{label}</span>
        <span className="font-display text-xl uppercase text-text">{headline}</span>
      </div>
      <div className="rounded-[14px] border-[1.5px] border-border bg-surface p-4">{children}</div>
    </div>
  );
}

export function LandingCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  function handleScroll() {
    const el = scrollRef.current;
    if (!el) return;
    const index = Math.round(el.scrollLeft / el.clientWidth);
    setActive(index);
  }

  function goTo(index: number) {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ left: index * el.clientWidth, behavior: "smooth" });
  }

  return (
    <div className="flex flex-col gap-3">
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="no-scrollbar flex w-full overflow-x-auto"
        style={{ scrollSnapType: "x mandatory" }}
      >
        <SlideFrame label="PRIVATE LEADERBOARDS" headline="Compete with your crew">
          <div className="flex flex-col gap-0.5">
            {CLUB_ROWS.map((p, i) => (
              <div key={p.name} className="flex items-center gap-3 py-2">
                <span
                  className="font-display text-base"
                  style={{ width: 18, color: i < 3 ? "var(--purple-deep)" : "var(--text-faint)" }}
                >
                  {i + 1}
                </span>
                <Avatar initials={p.initials} color={p.color} size={32} />
                <span className="flex-1 text-[13.5px] text-text">{p.name}</span>
                <span className="font-data text-[12px] text-text-dim">{p.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </SlideFrame>

        <SlideFrame label="SHARE EVERY SET" headline="Post it, they'll see it">
          <div className="flex flex-col gap-3">
            {FEED_POSTS.map((post) => (
              <div key={post.name} className="flex flex-col gap-2 border-b border-border pb-3 last:border-0 last:pb-0">
                <div className="flex items-center gap-2.5">
                  <Avatar initials={post.initials} color={post.color} size={28} />
                  <div className="flex flex-col">
                    <span className="text-[12.5px] font-bold text-text">{post.name}</span>
                    <span className="font-data text-[10px] text-text-faint">{post.time}</span>
                  </div>
                </div>
                <span className="font-display text-[15px] uppercase text-text">{post.line}</span>
                <div className="flex items-center gap-3 text-text-dim">
                  <div className="flex items-center gap-1">
                    <Heart size={13} color="var(--pink)" fill="var(--pink)" />
                    <span className="font-data text-[11px]">{post.likes}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle size={13} />
                    <span className="font-data text-[11px]">{post.comments}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SlideFrame>

        <SlideFrame label="CHASE NEW RECORDS" headline="Track every PR">
          <div className="flex flex-col">
            {PR_ROWS.map((p) => (
              <div key={p.name} className="flex items-center justify-between border-b border-border py-2.5 last:border-0">
                <span className="text-[13.5px] font-medium text-text">{p.name}</span>
                <div className="flex items-center gap-1.5">
                  <Flame size={13} color="var(--pink)" />
                  <span className="font-display text-[16px] text-purple-deep">{p.value}</span>
                </div>
              </div>
            ))}
          </div>
        </SlideFrame>
      </div>

      <div className="flex items-center justify-center gap-1.5">
        {[0, 1, 2].map((i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className="rounded-full transition-all"
            style={{
              width: active === i ? 16 : 6,
              height: 6,
              background: active === i ? "var(--purple)" : "var(--border)",
            }}
          />
        ))}
      </div>
    </div>
  );
}
