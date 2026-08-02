import { ClubScreen } from "@/components/club/ClubScreen";
import { getCurrentUserId } from "@/lib/auth";
import { getMyClubs, getDiscoverableClubs, getClubLeaderboard, type LeaderboardRange } from "@/lib/data/club";

type SearchParams = { club?: string; exercise?: string; range?: string; view?: string; q?: string };

export default async function ClubPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const sp = await searchParams;
  const userId = await getCurrentUserId();
  const myClubs = await getMyClubs(userId);

  const selectedClubId = sp.club && myClubs.some((c) => c.id === sp.club) ? sp.club : myClubs[0]?.id;
  const exercise = sp.exercise || "pushups";
  const range = (sp.range as LeaderboardRange) || "This month";
  const view = sp.view === "discover" || sp.view === "create" ? sp.view : null;
  const query = sp.q || "";

  const [board, discoverClubs] = await Promise.all([
    selectedClubId ? getClubLeaderboard(selectedClubId, exercise, range) : Promise.resolve([]),
    view === "discover" ? getDiscoverableClubs(userId, query) : Promise.resolve([]),
  ]);

  return (
    <ClubScreen
      userId={userId}
      myClubs={myClubs}
      selectedClubId={selectedClubId}
      exercise={exercise}
      range={range}
      board={board}
      discoverClubs={discoverClubs}
      view={view}
      query={query}
    />
  );
}
