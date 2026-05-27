export function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export function addDays(date: string, days: number): string {
  const parsedDate = new Date(`${date}T00:00:00.000Z`);
  parsedDate.setUTCDate(parsedDate.getUTCDate() + days);

  return parsedDate.toISOString().slice(0, 10);
}

export function parseIsoDate(date: string): Date {
  return new Date(`${date}T00:00:00.000Z`);
}

export function isIsoDate(value: string | undefined): value is string {
  return Boolean(value && /^\d{4}-\d{2}-\d{2}$/.test(value));
}

export function getTodayIsoDate(): string {
  const timeZone = process.env.PAGESTRIDER_TIME_ZONE ?? "Europe/Minsk";
  const parts = new Intl.DateTimeFormat("en", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(new Date());
  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;

  if (!year || !month || !day) {
    return new Date().toISOString().slice(0, 10);
  }

  return `${year}-${month}-${day}`;
}
