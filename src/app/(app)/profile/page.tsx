import Link from "next/link";
import { Settings } from "lucide-react";
import { getCurrentUserId } from "@/lib/auth";
import { getProfile } from "@/lib/data/profile";
import { ProfileForm } from "@/components/profile/ProfileForm";

export default async function ProfilePage() {
  const userId = await getCurrentUserId();
  const profile = await getProfile(userId);

  return (
    <div className="flex-1 overflow-y-auto pb-8" style={{ background: "var(--bg)" }}>
      <div className="flex items-center justify-between px-5 pt-6 pb-4">
        <h1 className="font-stencil text-[22px] uppercase tracking-wide text-text">Profile</h1>
        <Link href="/settings" className="text-text-dim">
          <Settings size={20} />
        </Link>
      </div>
      <ProfileForm profile={profile} />
    </div>
  );
}
