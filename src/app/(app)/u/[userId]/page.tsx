import { notFound } from "next/navigation";
import { Flame, MapPin } from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { Avatar } from "@/components/Avatar";
import { getPublicProfile } from "@/lib/data/public-profile";
import { colorForUser } from "@/lib/user-colors";
import { EXERCISES, WODS, fmtTime } from "@/lib/domain";

function initials(name: string) {
  return name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();
}

export default async function PublicProfilePage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;
  const profile = await getPublicProfile(userId);
  if (!profile) notFound();

  const prs = profile.prs;
  const allMovements = [
    ...EXERCISES.map((e) => ({ id: e.id, name: e.name, unit: e.unit })),
    ...WODS.map((w) => ({ id: w.id, name: w.name, unit: "reps" as const })),
  ];
  const prEntries = prs ? allMovements.filter((m) => prs[m.id] !== undefined) : [];

  return (
    <div className="flex-1 overflow-y-auto pb-8" style={{ background: "var(--bg)" }}>
      <TopBar title="Profile" />

      <div className="flex flex-col items-center gap-2 px-5">
        {profile.photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={profile.photoUrl} alt="" className="h-24 w-24 rounded-full object-cover" />
        ) : (
          <Avatar initials={initials(profile.displayName)} color={colorForUser(profile.id)} size={96} />
        )}
        <span className="mt-1 font-display text-2xl uppercase text-text">{profile.displayName}</span>
        {profile.hometown && (
          <div className="flex items-center gap-1 text-text-dim">
            <MapPin size={13} />
            <span className="text-[13px]">{profile.hometown}</span>
          </div>
        )}
      </div>

      <div className="mt-8 px-5">
        <span className="font-data text-xs tracking-wide text-text-dim">PERSONAL RECORDS</span>
      </div>
      {!prs ? (
        <div className="mt-3 px-5 text-[13px] text-text-faint">This member hasn&apos;t made their PRs public.</div>
      ) : prEntries.length === 0 ? (
        <div className="mt-3 px-5 text-[13px] text-text-faint">No PRs logged yet.</div>
      ) : (
        <div className="flex flex-col px-5">
          {prEntries.map((item) => (
            <div key={item.id} className="flex items-center justify-between border-b border-border py-4">
              <span className="text-[15px] font-medium text-text">{item.name}</span>
              <div className="flex items-center gap-1.5">
                <Flame size={14} color="var(--pink)" />
                <span className="font-display text-[19px] text-purple-deep">
                  {item.unit === "time" ? fmtTime(prs[item.id]) : prs[item.id]}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
