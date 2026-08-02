import Link from "next/link";
import { TopBar } from "@/components/TopBar";
import { getCurrentUserId } from "@/lib/auth";
import { getProfile } from "@/lib/data/profile";
import { isAdmin } from "@/lib/data/admin";
import { SettingsForm } from "@/components/settings/SettingsForm";

export default async function SettingsPage() {
  const userId = await getCurrentUserId();
  const [profile, admin] = await Promise.all([getProfile(userId), isAdmin(userId)]);

  return (
    <div className="flex-1 overflow-y-auto pb-8" style={{ background: "var(--bg)" }}>
      <TopBar title="Settings" />
      <SettingsForm units={profile.units} fontSize={profile.fontSize} />
      {admin && (
        <div className="mt-8 px-5">
          <Link
            href="/admin"
            className="block w-full py-3 text-center font-data text-xs font-bold text-purple-deep"
            style={{ background: "var(--purple-soft)", borderRadius: 12 }}
          >
            Members (admin)
          </Link>
        </div>
      )}
    </div>
  );
}
