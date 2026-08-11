// The app has one group of users, all in the same region, so "today"/"this month"
// are computed against a single fixed timezone rather than per-user — otherwise the
// server's UTC clock rolls the calendar day over ~8pm Eastern, well before midnight.
export const APP_TIME_ZONE = "America/Toronto";

function zonedParts(instant: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(instant);
  const map = Object.fromEntries(parts.map((p) => [p.type, p.value]));
  return {
    year: Number(map.year),
    month: Number(map.month),
    day: Number(map.day),
    hour: Number(map.hour) % 24,
    minute: Number(map.minute),
    second: Number(map.second),
  };
}

// The Y/M/D/H/M/S the given instant reads as, in `timeZone`, e.g. "2026-08-02" for
// same-day comparisons that don't care about the server's own timezone.
export function zonedDateKey(instant: Date, timeZone: string = APP_TIME_ZONE): string {
  const p = zonedParts(instant, timeZone);
  return `${p.year}-${String(p.month).padStart(2, "0")}-${String(p.day).padStart(2, "0")}`;
}

// Midnight-to-midnight bounds (as real UTC instants) for the calendar day `instant`
// falls on in `timeZone`.
export function zonedDayBounds(instant: Date = new Date(), timeZone: string = APP_TIME_ZONE): { start: Date; end: Date } {
  const p = zonedParts(instant, timeZone);
  const zonedAsUTC = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second);
  const offset = instant.getTime() - zonedAsUTC;
  const startZonedAsUTC = Date.UTC(p.year, p.month - 1, p.day, 0, 0, 0);
  const start = new Date(startZonedAsUTC + offset);
  const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
  return { start, end };
}

// Midnight (as a real UTC instant) for the calendar month `instant` falls on in `timeZone`.
export function zonedMonthStart(instant: Date, timeZone: string = APP_TIME_ZONE, monthOffset = 0): Date {
  const p = zonedParts(instant, timeZone);
  const zonedAsUTC = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second);
  const offset = instant.getTime() - zonedAsUTC;
  const startZonedAsUTC = Date.UTC(p.year, p.month - 1 + monthOffset, 1, 0, 0, 0);
  return new Date(startZonedAsUTC + offset);
}

// A real UTC instant guaranteed to read as `dateKey` (e.g. "2026-08-02") in `timeZone`,
// for turning a plain date picked in the UI into a storable timestamp. Uses noon UTC on
// that date — APP_TIME_ZONE's offset (-4/-5h) is small enough that noon UTC always still
// falls on the same calendar day locally, no zonedParts round-trip needed.
export function dateKeyToInstant(dateKey: string): Date {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
}

// Midnight (as a real UTC instant) for the calendar year `instant` falls on in `timeZone`.
export function zonedYearStart(instant: Date, timeZone: string = APP_TIME_ZONE, yearOffset = 0): Date {
  const p = zonedParts(instant, timeZone);
  const zonedAsUTC = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second);
  const offset = instant.getTime() - zonedAsUTC;
  const startZonedAsUTC = Date.UTC(p.year + yearOffset, 0, 1, 0, 0, 0);
  return new Date(startZonedAsUTC + offset);
}
