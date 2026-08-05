"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Share2, Check, Lock } from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { Dropdown } from "@/components/Dropdown";
import { Avatar } from "@/components/Avatar";
import { DiscoverClubs } from "@/components/club/DiscoverClubs";
import { CreateClub } from "@/components/club/CreateClub";
import { EXERCISES, fmtTime } from "@/lib/domain";
import { joinClub, createClub } from "@/lib/actions/club";
import { LEADERBOARD_RANGES, type ClubSummary, type LeaderboardRange, type LeaderboardRow } from "@/lib/data/club";

const ORDINAL = (n: number) => (["st", "nd", "rd"][n - 1] ?? "th");

function ShareClubButton({ club }: { club: ClubSummary }) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const url = `${window.location.origin}/club/join/${club.id}`;
    const text = `Join my club "${club.name}" on Nickels and Dimes!`;

    if (navigator.share) {
      try {
        await navigator.share({ title: club.name, text, url });
      } catch {
        // user cancelled the share sheet — no-op
      }
      return;
    }

    await navigator.clipboard.writeText(`${text} ${url}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      onClick={handleShare}
      className="flex flex-shrink-0 items-center gap-1.5 rounded-[20px] border px-3.5 py-2 font-data text-xs font-bold"
      style={{ background: "var(--surface)", color: "var(--text-dim)", borderColor: "var(--border)" }}
    >
      {copied ? (
        <>
          <Check size={13} color="var(--purple-deep)" />
          Copied!
        </>
      ) : (
        <>
          <Share2 size={13} />
          Share
        </>
      )}
    </button>
  );
}

export function ClubScreen({
  userId,
  myClubs,
  selectedClubId,
  exercise,
  range,
  board,
  discoverClubs,
  view,
  query,
}: {
  userId: string;
  myClubs: ClubSummary[];
  selectedClubId: string | undefined;
  exercise: string;
  range: LeaderboardRange;
  board: LeaderboardRow[];
  discoverClubs: ClubSummary[];
  view: "discover" | "create" | null;
  query: string;
}) {
  const router = useRouter();
  const exObj = EXERCISES.find((e) => e.id === exercise)!;
  const selectedClub = myClubs.find((c) => c.id === selectedClubId);

  function navigate(patch: Record<string, string | null>) {
    const params = new URLSearchParams(window.location.search);
    Object.entries(patch).forEach(([k, v]) => {
      if (v === null) params.delete(k);
      else params.set(k, v);
    });
    router.push(`/club?${params.toString()}`);
  }

  async function handleJoin(club: ClubSummary) {
    await joinClub(club.id);
    navigate({ club: club.id, view: null, q: null });
  }

  async function handleCreate(name: string, isPublic: boolean) {
    const { id } = await createClub(name, isPublic);
    navigate({ club: id, view: null, q: null });
  }

  const myIndex = board.findIndex((p) => p.userId === userId);
  const myRow = board[myIndex];
  const ahead = myIndex > 0 ? board[myIndex - 1] : undefined;

  return (
    <div className="relative flex-1 overflow-y-auto pb-4" style={{ background: "var(--bg)" }}>
      <TopBar title="Clubs" />

      {myClubs.length > 0 && (
        <div className="flex items-center justify-between gap-2 px-5">
          <div className="flex flex-1 gap-2 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
            {myClubs.map((c) => {
              const active = c.id === selectedClubId;
              return (
                <button
                  key={c.id}
                  onClick={() => navigate({ club: c.id })}
                  className="flex flex-shrink-0 items-center gap-1.5 rounded-[20px] border px-4 py-2 font-data text-xs font-bold"
                  style={{
                    background: active ? "var(--purple)" : "var(--surface)",
                    color: active ? "#fff" : "var(--text-dim)",
                    borderColor: active ? "var(--purple)" : "var(--border)",
                  }}
                >
                  {!c.isPublic && <Lock size={11} color={active ? "#fff" : "var(--text-faint)"} />}
                  {c.name}
                </button>
              );
            })}
          </div>
          {selectedClub && <ShareClubButton club={selectedClub} />}
        </div>
      )}

      <div className="mt-3 flex gap-2 px-5">
        <button
          onClick={() => navigate({ view: "discover" })}
          className="flex-1 rounded-[10px] py-2 font-data text-xs font-bold text-text"
          style={{ background: "var(--blue-soft)" }}
        >
          Find a club
        </button>
        <button
          onClick={() => navigate({ view: "create" })}
          className="flex-1 rounded-[10px] py-2 font-data text-xs font-bold text-text"
          style={{ background: "var(--purple-soft)" }}
        >
          Create a club
        </button>
      </div>

      {myClubs.length === 0 ? (
        <div className="mt-10 flex flex-col items-center gap-2 px-5 text-center">
          <span className="font-display text-xl uppercase text-text">No clubs yet</span>
          <span className="text-[13px] text-text-dim">
            Find a public club to join, or start your own — it begins solo until others join.
          </span>
        </div>
      ) : !selectedClub ? null : board.length <= 1 ? (
        <div className="mt-10 flex flex-col items-center gap-2 px-5 text-center">
          <span className="font-display text-xl uppercase text-text">{selectedClub.name}</span>
          <span className="text-[13px] text-text-dim">
            It&apos;s just you in here so far. Invite friends to start a leaderboard.
          </span>
        </div>
      ) : (
        <>
          <div className="mt-4 flex gap-2 px-5">
            <div className="flex-1">
              <Dropdown
                value={exercise}
                onChange={(v) => navigate({ exercise: EXERCISES.find((e) => e.name === v)?.id ?? v })}
                options={EXERCISES.map((e) => e.name)}
              />
            </div>
            {exObj.unit === "reps" && (
              <div className="flex-1">
                <Dropdown value={range} onChange={(v) => navigate({ range: v })} options={[...LEADERBOARD_RANGES]} />
              </div>
            )}
          </div>

          {board.every((p) => p.value === 0) ? (
            <div className="mt-10 flex flex-col items-center gap-2 px-5 text-center">
              <span className="font-display text-lg uppercase text-text">No data to show</span>
              <span className="text-[13px] text-text-dim">
                Nobody in this club has logged {exObj.name.toLowerCase()}
                {exObj.unit === "reps" ? ` ${range.toLowerCase()}` : ""} yet.
              </span>
            </div>
          ) : (
            <>
              {myRow && (
                <div className="mt-2 flex flex-col items-center border-b border-border px-5 py-5">
                  <span className="font-display text-[44px] text-text">
                    {exObj.unit === "time" ? fmtTime(myRow.value) : myRow.value.toLocaleString()}
                  </span>
                  <span className="font-data text-xs tracking-wide text-text-dim">
                    {exObj.name.toUpperCase()} {exObj.unit === "time" ? "· BEST HOLD" : `· ${range.toUpperCase()}`}
                  </span>
                  <span className="mt-2.5 font-display text-lg uppercase text-purple-deep">
                    {myIndex === 0 ? "1st place" : `${myIndex + 1}${ORDINAL(myIndex + 1)} place`}
                  </span>
                  {ahead && (
                    <span className="mt-0.5 font-data text-xs text-text-faint">
                      {exObj.unit === "time"
                        ? `${fmtTime(ahead.value - myRow.value)} behind ${ahead.name}`
                        : `${(ahead.value - myRow.value).toLocaleString()} reps behind ${ahead.name}`}
                    </span>
                  )}
                </div>
              )}

              <div className="mt-4 flex flex-col gap-1 px-5">
                {board.map((p, i) => {
                  const isMe = p.userId === userId;
                  return (
                    <Link
                      key={p.userId}
                      href={`/u/${p.userId}`}
                      className="flex items-center gap-3 rounded-[10px] py-3 pl-2.5 pr-2.5"
                      style={{ background: isMe ? "var(--purple-soft)" : "transparent" }}
                    >
                      <span
                        className="font-display text-lg"
                        style={{ width: 22, color: i < 3 ? "var(--purple-deep)" : "var(--text-faint)" }}
                      >
                        {i + 1}
                      </span>
                      <Avatar
                        initials={p.name.split(" ").map((s) => s[0]).slice(0, 2).join("")}
                        color={p.color}
                        size={36}
                      />
                      <span className="flex-1 text-sm text-text" style={{ fontWeight: isMe ? 700 : 400 }}>
                        {p.name}
                      </span>
                      <span className="font-data text-[13px] text-text-dim">
                        {exObj.unit === "time" ? fmtTime(p.value) : p.value.toLocaleString()}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </>
          )}
        </>
      )}

      {view === "discover" && (
        <DiscoverClubs clubs={discoverClubs} query={query} onJoin={handleJoin} onClose={() => navigate({ view: null, q: null })} />
      )}
      {view === "create" && <CreateClub onCreate={handleCreate} onClose={() => navigate({ view: null })} />}
    </div>
  );
}
