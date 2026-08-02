import { Flame } from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { EXERCISES, WODS, fmtTime } from "@/lib/domain";
import { getPRs } from "@/lib/data/prs";
import { getCurrentUserId } from "@/lib/auth";

export default async function PRsPage() {
  const userId = await getCurrentUserId();
  const prs = await getPRs(userId);
  const all = [
    ...EXERCISES.map((e) => ({ id: e.id, name: e.name, unit: e.unit })),
    ...WODS.map((w) => ({ id: w.id, name: w.name, unit: "reps" as const })),
  ];

  return (
    <div className="flex-1 overflow-y-auto pb-4" style={{ background: "var(--bg)" }}>
      <TopBar title="Your PRs" subtitle="Personal records across every movement" />
      <div className="flex flex-col px-5">
        {all.map((item) => {
          const value = prs[item.id];
          return (
            <div key={item.id} className="flex items-center justify-between border-b border-border py-4">
              <span className="text-[15px] font-medium text-text">{item.name}</span>
              {value !== undefined ? (
                <div className="flex items-center gap-1.5">
                  <Flame size={14} color="var(--pink)" />
                  <span className="font-display text-[19px] text-purple-deep">
                    {item.unit === "time" ? fmtTime(value) : value}
                  </span>
                </div>
              ) : (
                <span className="font-data text-xs italic text-text-faint">Set a New PR!</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
