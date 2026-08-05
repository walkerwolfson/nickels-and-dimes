"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Lock } from "lucide-react";
import type { ClubSummary } from "@/lib/data/club";

export function DiscoverClubs({
  clubs,
  query,
  onJoin,
  onClose,
}: {
  clubs: ClubSummary[];
  query: string;
  onJoin: (club: ClubSummary) => void;
  onClose: () => void;
}) {
  const router = useRouter();
  const [value, setValue] = useState(query);

  function updateQuery(next: string) {
    setValue(next);
    const params = new URLSearchParams(window.location.search);
    params.set("view", "discover");
    if (next) params.set("q", next);
    else params.delete("q");
    router.replace(`/club?${params.toString()}`);
  }

  return (
    <div className="absolute inset-0 z-20 flex flex-col" style={{ background: "var(--bg)" }}>
      <div className="flex items-center justify-between px-5 pt-6 pb-4">
        <h1 className="font-display text-2xl uppercase text-text">Find a club</h1>
        <button onClick={onClose} className="text-text-dim">
          <X size={22} />
        </button>
      </div>
      <div className="px-5">
        <input
          autoFocus
          value={value}
          onChange={(e) => updateQuery(e.target.value)}
          placeholder="Search clubs"
          className="w-full rounded-[10px] border-[1.5px] border-border bg-surface px-3.5 py-2.5 text-sm text-text outline-none"
        />
      </div>
      <div className="mt-4 flex flex-col gap-2 overflow-y-auto px-5">
        {clubs.length === 0 && (
          <span className="mt-3 text-[13px] text-text-faint">
            {value ? "No clubs match that search." : "No public clubs yet — be the first to create one."}
          </span>
        )}
        {clubs.map((c) => (
          <div
            key={c.id}
            className="flex items-center justify-between rounded-xl border border-border bg-surface px-4 py-3"
          >
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-[15px] font-bold text-text">{c.name}</span>
                {!c.isPublic && <Lock size={11} color="var(--text-faint)" />}
              </div>
              <span className="font-data text-[11px] text-text-faint">
                {c.memberCount.toLocaleString()} member{c.memberCount === 1 ? "" : "s"}
              </span>
            </div>
            <button
              onClick={() => onJoin(c)}
              className="rounded-full px-4 py-1.5 font-data text-xs font-bold text-white"
              style={{ background: "var(--purple)" }}
            >
              Join
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
