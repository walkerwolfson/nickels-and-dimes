import { HistoryScreen } from "@/components/history/HistoryScreen";
import { getHistoryData, type HistoryRange } from "@/lib/data/history";
import { getCurrentUserId } from "@/lib/auth";

export default async function HistoryPage() {
  const userId = await getCurrentUserId();
  const ranges: HistoryRange[] = ["W", "M", "Y", "All"];
  const results = await Promise.all(ranges.map((r) => getHistoryData(r, userId)));
  const dataByRange = Object.fromEntries(ranges.map((r, i) => [r, results[i]])) as Record<
    HistoryRange,
    (typeof results)[number]
  >;

  return <HistoryScreen dataByRange={dataByRange} />;
}
