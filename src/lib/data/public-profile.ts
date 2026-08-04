import { prisma } from "@/lib/prisma";
import { getPRs } from "@/lib/data/prs";

export type PublicProfile = {
  id: string;
  displayName: string;
  photoUrl: string | null;
  hometown: string | null;
  prs: Record<string, number> | null; // null when the member hasn't opted in to sharing PRs
};

export async function getPublicProfile(userId: string): Promise<PublicProfile | null> {
  const profile = await prisma.profile.findUnique({
    where: { id: userId },
    select: { id: true, displayName: true, photoUrl: true, hometown: true, showPRs: true },
  });
  if (!profile) return null;

  return {
    id: profile.id,
    displayName: profile.displayName,
    photoUrl: profile.photoUrl,
    hometown: profile.hometown,
    prs: profile.showPRs ? await getPRs(userId) : null,
  };
}
