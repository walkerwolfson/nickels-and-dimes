import Link from "next/link";
import { ChevronRight, Menu } from "lucide-react";
import { Avatar } from "@/components/Avatar";
import { Sidebar } from "@/components/Sidebar";
import { InstallPrompt } from "@/components/InstallPrompt";
import { FeedPostCard } from "@/components/feed/FeedPostCard";
import { getFeed } from "@/lib/data/feed";
import { getCurrentUserId } from "@/lib/auth";
import { getProfile } from "@/lib/data/profile";
import { getTodayBreakdown } from "@/lib/data/home";
import { fmtTime } from "@/lib/domain";
import { APP_TIME_ZONE } from "@/lib/timezone";

function todayStr() {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    timeZone: APP_TIME_ZONE,
  });
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
      <div className="flex items-center justify-between px-5 pt-6">
        <Link href="/profile" className="h-11 w-11 flex-shrink-0 overflow-hidden rounded-full">
          {profile.photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={profile.photoUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            <Avatar initials={initials(profile.displayName)} color="var(--purple)" size={44} />
          )}
        </Link>
        <Sidebar className="text-text-dim">
          <Menu size={20} />
        </Sidebar>
      </div>

      <div className="px-5 pt-3 pb-2">
        <span className="font-data text-xs tracking-wide text-text-faint">{todayStr().toUpperCase()}</span>
        <h1 className="mt-1 font-stencil text-2xl uppercase tracking-wide text-text">Nickels &amp; Dimes</h1>
        <span
          className="mt-1.5 inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-data text-[9px] font-bold tracking-widest"
          style={{ background: "var(--yellow)", color: "#2B2E00" }}
        >
          <span className="h-1 w-1 rounded-full" style={{ background: "#2B2E00" }} />
          BETA
        </span>
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
          feed.map((post) => <FeedPostCard key={post.id} post={post} />)
        )}
      </div>
    </div>
  );
}
