import { TopBar } from "@/components/TopBar";
import { getCurrentUserId } from "@/lib/auth";
import { getProfile } from "@/lib/data/profile";
import { SettingsForm } from "@/components/settings/SettingsForm";

export default async function SettingsPage() {
  const userId = await getCurrentUserId();
  const profile = await getProfile(userId);

  return (
    <div className="flex-1 overflow-y-auto pb-8" style={{ background: "var(--bg)" }}>
      <TopBar title="Settings" />
      <SettingsForm units={profile.units} fontSize={profile.fontSize} />
    </div>
  );
}
