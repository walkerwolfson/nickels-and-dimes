import { ViewTransition } from "react";
import { NavBar } from "@/components/NavBar";
import { getCurrentUserId } from "@/lib/auth";
import { getProfile } from "@/lib/data/profile";

const FONT_SCALE: Record<string, number> = { SMALL: 0.9, MEDIUM: 1, LARGE: 1.15 };

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const userId = await getCurrentUserId();
  const profile = await getProfile(userId);

  return (
    <div
      className="mx-auto flex h-dvh max-w-[480px] flex-col overflow-hidden bg-bg"
      style={{ zoom: FONT_SCALE[profile.fontSize] ?? 1 }}
    >
      <ViewTransition>{children}</ViewTransition>
      <NavBar />
    </div>
  );
}
