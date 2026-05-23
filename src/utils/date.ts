export function getTodayDateString(): string {
  return toDateString(new Date());
}

export function formatDisplayDate(date: string): string {
  const parsed = new Date(`${date}T00:00:00`);
  return new Intl.DateTimeFormat("zh-CN", {
    month: "long",
    day: "numeric",
    weekday: "short"
  }).format(parsed);
}

export function getMonthRange(
  year: number,
  month: number
): { start: string; end: string } {
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0);
  return {
    start: toDateString(start),
    end: toDateString(end)
  };
}

function toDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
