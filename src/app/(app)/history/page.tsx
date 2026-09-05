import { HistoryScreen } from "@/components/history/HistoryScreen";
import { getHistoryPageData } from "@/lib/data/history";
import { getCurrentUserId } from "@/lib/auth";

export default async function HistoryPage() {
  const userId = await getCurrentUserId();
  const { ranges, months, monthSnapshots } = await getHistoryPageData(userId);

  return <HistoryScreen dataByRange={ranges} months={months} monthSnapshots={monthSnapshots} />;
}
