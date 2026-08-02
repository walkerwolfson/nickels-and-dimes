import { prisma } from "@/lib/prisma";

export async function getProfile(userId: string) {
  const profile = await prisma.profile.findUnique({ where: { id: userId } });
  if (profile) return profile;

  // Shouldn't normally happen (the auth callback creates this on first login), but
  // fall back to sane defaults rather than crash if a profile is somehow missing.
  return {
    id: userId,
    email: null,
    displayName: "Athlete",
    photoUrl: null,
    heightCm: null,
    weightKg: null,
    birthday: null,
    units: "LB" as const,
    fontSize: "MEDIUM" as const,
    marketingOptIn: false,
    createdAt: new Date(),
  };
}
