import Link from "next/link";
import { ChevronRight, Heart, MessageCircle } from "lucide-react";
import { Avatar } from "@/components/Avatar";
import { Sidebar } from "@/components/Sidebar";
import { InstallPrompt } from "@/components/InstallPrompt";
import { getFeed } from "@/lib/data/feed";
import { toggleLike } from "@/lib/actions/feed";
import { getCurrentUserId } from "@/lib/auth";
import { getProfile } from "@/lib/data/profile";
import { getTodayBreakdown } from "@/lib/data/home";
import { fmtTime } from "@/lib/domain";

function todayStr() {
  return new Date().toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" });
}

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default async function HomePage() {
  const userId = await getCurrentUserId();
  const [breakdown, profile, feed] = await Promise.all([
    getTodayBreakdown(userId),
    getProfile(userId),
    getFeed(userId),
  ]);

  return (
    <div className="flex-1 overflow-y-auto pb-4" style={{ background: "var(--bg)" }}>
      <div className="flex items-start justify-between px-5 pt-6 pb-2">
        <div>
          <span className="font-data text-xs tracking-wide text-text-faint">{todayStr().toUpperCase()}</span>
          <h1 className="mt-1 font-stencil text-2xl uppercase tracking-wide text-text">Nickels &amp; Dimes</h1>
        </div>
        <Sidebar className="h-9 w-9 flex-shrink-0 overflow-hidden rounded-full">
          {profile.photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={profile.photoUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            <Avatar initials={initials(profile.displayName)} color="var(--purple)" size={36} />
          )}
        </Sidebar>
      </div>

      <InstallPrompt />

      <div className="mt-3 px-5">
        <Link
          href="/log"
          className="flex w-full flex-col rounded-[10px] border-2 border-[#2B2E00] px-5 py-4 shadow-[0_6px_16px_rgba(140,111,240,0.32)]"
          style={{ background: "var(--purple)" }}
        >
          <div className="flex items-center justify-between">
            <span className="font-data text-[11px] tracking-wide text-[#EAE3FF]">TODAY&apos;S WORK</span>
            <div className="flex items-center gap-1 text-white">
              <span className="font-data text-xs font-bold">Log a set</span>
              <ChevronRight size={16} />
            </div>
          </div>
          {breakdown.length === 0 ? (
            <span className="mt-2 text-left text-[13px] text-[#EAE3FF]">
              Nothing logged yet — get after it.
            </span>
          ) : (
            <div className="mt-3 flex flex-col gap-1">
              {breakdown.map((b) => (
                <div key={b.exerciseId} className="flex items-center justify-between">
                  <span className="font-display text-[17px] uppercase text-white">{b.name}</span>
                  <span className="font-data text-[15px] font-bold" style={{ color: "var(--yellow)" }}>
                    {b.unit === "time" ? fmtTime(b.value) : b.value}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Link>
      </div>

      <div className="mt-7 px-5">
        <span className="font-data text-xs tracking-wide text-text-dim">ACTIVITY</span>
      </div>
      <div className="mt-3 flex flex-col gap-3 px-5">
        {feed.length === 0 ? (
          <div className="rounded-[10px] border-[1.5px] border-border bg-surface p-4 text-center">
            <span className="text-[13px] text-text-dim">
              No activity yet. Join or start a club to see posts here from people you train with.
            </span>
          </div>
        ) : (
          feed.map((post) => (
            <div key={post.id} className="rounded-[10px] border-[1.5px] border-border bg-surface p-4">
              <div className="flex items-center gap-3">
                {post.photoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={post.photoUrl} alt="" className="h-10 w-10 flex-shrink-0 rounded-full object-cover" />
                ) : (
                  <Avatar initials={post.initials} color={post.color} />
                )}
                <div className="flex-1">
                  <div className="text-sm font-bold text-text">{post.person}</div>
                  <div className="font-data text-[11px] text-text-faint">{post.time}</div>
                </div>
              </div>
              <div className="mt-3 flex flex-col gap-1">
                {post.lines.map((l, i) => (
                  <span key={i} className="font-display text-lg uppercase text-text">
                    {l}
                  </span>
                ))}
              </div>
              <div className="mt-3 flex items-center gap-4 text-text-dim">
                <form action={toggleLike.bind(null, post.id)}>
                  <button type="submit" className="flex items-center gap-1.5">
                    <Heart size={15} color="var(--pink)" fill={post.likedByMe ? "var(--pink)" : "none"} />
                    <span className="font-data text-xs">{post.likes}</span>
                  </button>
                </form>
                <div className="flex items-center gap-1.5">
                  <MessageCircle size={15} />
                  <span className="font-data text-xs">{post.comments}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
