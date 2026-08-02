import { redirect } from "next/navigation";
import { TopBar } from "@/components/TopBar";
import { Avatar } from "@/components/Avatar";
import { getCurrentUserId } from "@/lib/auth";
import { isAdmin, getAllUsers } from "@/lib/data/admin";
import { colorForUser } from "@/lib/user-colors";

function initials(name: string) {
  return name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
}

export default async function AdminPage() {
  const userId = await getCurrentUserId();
  if (!(await isAdmin(userId))) {
    redirect("/home");
  }

  const users = await getAllUsers();

  return (
    <div className="flex-1 overflow-y-auto pb-8" style={{ background: "var(--bg)" }}>
      <TopBar title="Members" subtitle={`${users.length} signed up`} />
      <div className="flex flex-col gap-2 px-5">
        {users.map((u) => (
          <div
            key={u.id}
            className="flex items-center gap-3 rounded-[12px] border border-border bg-surface px-4 py-3"
          >
            {u.photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={u.photoUrl} alt="" className="h-10 w-10 flex-shrink-0 rounded-full object-cover" />
            ) : (
              <Avatar initials={initials(u.displayName)} color={colorForUser(u.id)} size={40} />
            )}
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-bold text-text">{u.displayName}</div>
              <div className="truncate font-data text-[11px] text-text-faint">{u.email}</div>
            </div>
            <div className="flex flex-shrink-0 flex-col items-end gap-0.5">
              <span className="font-data text-[11px] text-text-dim">
                {u.createdAt.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
              </span>
              <span className="font-data text-[10px] text-text-faint">
                {u.workoutCount} logs · {u.clubCount} club{u.clubCount === 1 ? "" : "s"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
