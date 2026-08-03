import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const profiles = await prisma.profile.findMany({ select: { id: true } });
  if (profiles.length === 0) {
    console.log("No profiles to backfill.");
    return;
  }

  let defaultClub = await prisma.club.findFirst({ where: { isDefault: true } });
  if (!defaultClub) {
    defaultClub = await prisma.club.create({
      data: { name: "Public", createdById: profiles[0].id, isPublic: true, isDefault: true },
    });
  }

  for (const { id: userId } of profiles) {
    await prisma.clubMembership.upsert({
      where: { clubId_userId: { clubId: defaultClub.id, userId } },
      create: { clubId: defaultClub.id, userId },
      update: {},
    });
  }

  console.log(`Backfilled ${profiles.length} profile(s) into default club "${defaultClub.name}" (${defaultClub.id}).`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
