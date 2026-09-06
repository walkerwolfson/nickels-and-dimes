"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Users } from "lucide-react";
import { joinClub } from "@/lib/actions/club";
import { track } from "@/lib/analytics";
import type { ClubSummary } from "@/lib/data/club";

export function JoinClubScreen({ club, alreadyMember }: { club: ClubSummary; alreadyMember: boolean }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function handleJoin() {
    startTransition(async () => {
      await joinClub(club.id);
      track("club_joined", { source: "invite_link" });
      router.push(`/club?club=${club.id}`);
    });
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 px-8 text-center" style={{ background: "var(--bg)" }}>
      <div className="flex h-16 w-16 items-center justify-center rounded-full" style={{ background: "var(--purple-soft)" }}>
        <Users size={26} color="var(--purple-deep)" />
      </div>
      <span className="font-data text-xs tracking-wide text-text-dim">YOU&apos;RE INVITED TO</span>
      <span className="font-display text-2xl uppercase text-text">{club.name}</span>
      <span className="text-[13px] text-text-dim">
        {club.memberCount} member{club.memberCount === 1 ? "" : "s"}
      </span>

      {alreadyMember ? (
        <button
          onClick={() => router.push(`/club?club=${club.id}`)}
          className="mt-4 w-full max-w-xs py-3.5 font-display text-[15px] uppercase text-white"
          style={{ background: "var(--purple)", borderRadius: 12 }}
        >
          View club
        </button>
      ) : (
        <button
          onClick={handleJoin}
          disabled={pending}
          className="mt-4 w-full max-w-xs py-3.5 font-display text-[15px] uppercase text-white"
          style={{ background: "var(--purple)", borderRadius: 12, opacity: pending ? 0.6 : 1 }}
        >
          {pending ? "Joining…" : "Join club"}
        </button>
      )}
    </div>
  );
}
