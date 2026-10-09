// Russian formatting for interface text (UX.md "Тексты"): numbers with units after a space, relative time for
// recent moments and a date for older ones.

/** Plural form for a count: plural(5, ["голос", "голоса", "голосов"]) is "голосов". */
export function plural(n: number, forms: [one: string, few: string, many: string]): string {
  const mod10 = Math.abs(n) % 10;
  const mod100 = Math.abs(n) % 100;
  if (mod10 === 1 && mod100 !== 11) return forms[0];
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return forms[1];
  return forms[2];
}

/** A span of seconds in its two largest units: "45 с", "12 мин", "2 ч 5 мин", "3 д 4 ч". */
export function duration(seconds: number): string {
  const s = Number.isFinite(seconds) ? Math.max(0, Math.floor(seconds)) : 0;
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  if (d > 0) return h ? `${d} д ${h} ч` : `${d} д`;
  if (h > 0) return m ? `${h} ч ${m} мин` : `${h} ч`;
  if (m > 0) return `${m} мин`;
  return `${s} с`;
}

/**
 * "только что", "5 мин назад", "3 ч назад", "вчера", "4 дня назад", then the date: "12 марта", with the year
 * when it is not the current one. Takes a Date, milliseconds or an ISO string; an invalid time gives "".
 */
export function timeAgo(time: Date | number | string, now: number = Date.now()): string {
  const t = new Date(time).getTime();
  if (Number.isNaN(t)) return "";
  const minutes = Math.floor((now - t) / 60000);
  if (minutes < 1) return "только что";
  if (minutes < 60) return `${minutes} мин назад`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} ч назад`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "вчера";
  if (days < 7) return `${days} ${plural(days, ["день", "дня", "дней"])} назад`;
  const date = new Date(t);
  const sameYear = date.getFullYear() === new Date(now).getFullYear();
  return date.toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: sameYear ? undefined : "numeric" });
}

const scales: [number, string][] = [
  [1e9, "млрд"],
  [1e6, "млн"],
  [1e3, "тыс"],
];

/** Short large numbers: 950, "1,2 тыс", "45 тыс", "3,4 млн". */
export function compactNumber(n: number): string {
  for (const [size, unit] of scales) {
    const scaled = Math.abs(n) / size;
    if (scaled >= 1) {
      const text = scaled.toFixed(scaled >= 10 ? 0 : 1).replace(/\.0$/, "").replace(".", ",");
      return `${n < 0 ? "-" : ""}${text} ${unit}`;
    }
  }
  return String(Math.round(n));
}

/** Up to two initials of a name: "Алексей Макаров" is "АМ", "alllexey" is "A", an empty name is "?". */
export function initials(name: string): string {
  const letters = name.trim().split(/\s+/).filter(Boolean).slice(0, 2).map((word) => [...word][0]);
  return letters.join("").toUpperCase() || "?";
}
