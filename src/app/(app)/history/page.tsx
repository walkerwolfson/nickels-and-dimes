import { HistoryScreen } from "@/components/history/HistoryScreen";
import { getAllHistoryRanges } from "@/lib/data/history";
import { getCurrentUserId } from "@/lib/auth";

export default async function HistoryPage() {
  const userId = await getCurrentUserId();
  const dataByRange = await getAllHistoryRanges(userId);

  return <HistoryScreen dataByRange={dataByRange} />;
}
