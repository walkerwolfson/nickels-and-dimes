import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";
import { getClubById } from "@/lib/data/club";
import { JoinClubScreen } from "@/components/club/JoinClubScreen";

export default async function JoinClubPage({ params }: { params: Promise<{ clubId: string }> }) {
  const { clubId } = await params;
  const club = await getClubById(clubId);
  if (!club) notFound();

  const userId = await getCurrentUserId();
  const membership = await prisma.clubMembership.findUnique({
    where: { clubId_userId: { clubId, userId } },
  });

  return <JoinClubScreen club={club} alreadyMember={!!membership} />;
}
