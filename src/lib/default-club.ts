import { prisma } from "@/lib/prisma";

const DEFAULT_CLUB_NAME = "Public";

// Every user is auto-joined to this club so the feed and leaderboard work as
// a single shared community out of the box, without requiring anyone to
// create or find a club first.
export async function ensureDefaultClubMembership(userId: string): Promise<void> {
  let defaultClub = await prisma.club.findFirst({ where: { isDefault: true } });
  if (!defaultClub) {
    defaultClub = await prisma.club.create({
      data: { name: DEFAULT_CLUB_NAME, createdById: userId, isPublic: true, isDefault: true },
    });
  }

  await prisma.clubMembership.upsert({
    where: { clubId_userId: { clubId: defaultClub.id, userId } },
    create: { clubId: defaultClub.id, userId },
    update: {},
  });
}
