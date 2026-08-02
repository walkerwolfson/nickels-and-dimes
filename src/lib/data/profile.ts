import { cache } from "react";
import { prisma } from "@/lib/prisma";

// Cached per-request: the layout and most pages each need the profile, so this avoids
// hitting the database twice for the same row on every single navigation.
export const getProfile = cache(async (userId: string) => {
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
});
