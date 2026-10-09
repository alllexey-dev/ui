import { describe, expect, it } from "vitest";
import { compactNumber, duration, initials, plural, timeAgo } from "../src/lib/format";

describe("plural", () => {
  const forms: [string, string, string] = ["день", "дня", "дней"];

  it("picks the form by the last digits", () => {
    expect([1, 2, 5, 11, 12, 21, 22, 25, 101, 111].map((n) => plural(n, forms))).toEqual([
      "день", "дня", "дней", "дней", "дней", "день", "дня", "дней", "день", "дней",
    ]);
  });
});

describe("duration", () => {
  it("keeps the two largest units and drops a zero second one", () => {
    expect(duration(45)).toBe("45 с");
    expect(duration(12 * 60 + 30)).toBe("12 мин");
    expect(duration(2 * 3600 + 5 * 60)).toBe("2 ч 5 мин");
    expect(duration(2 * 3600)).toBe("2 ч");
    expect(duration(3 * 86400 + 4 * 3600 + 59)).toBe("3 д 4 ч");
  });

  it("treats negative and broken input as zero", () => {
    expect(duration(-5)).toBe("0 с");
    expect(duration(Number.NaN)).toBe("0 с");
  });
});

describe("timeAgo", () => {
  const now = new Date(2026, 9, 9, 15, 0).getTime();
  const ago = (ms: number) => timeAgo(now - ms, now);

  it("is relative for the last week", () => {
    expect(ago(20_000)).toBe("только что");
    expect(ago(5 * 60_000)).toBe("5 мин назад");
    expect(ago(3 * 3_600_000)).toBe("3 ч назад");
    expect(ago(30 * 3_600_000)).toBe("вчера");
    expect(ago(4 * 86_400_000)).toBe("4 дня назад");
    expect(ago(5 * 86_400_000)).toBe("5 дней назад");
  });

  it("gives a date for older moments, with the year only when it differs", () => {
    expect(timeAgo(new Date(2026, 2, 12), now)).toBe("12 марта");
    expect(timeAgo(new Date(2025, 2, 12), now)).toBe("12 марта 2025 г.");
  });

  it("accepts ISO strings and refuses garbage", () => {
    expect(timeAgo(new Date(now - 120_000).toISOString(), now)).toBe("2 мин назад");
    expect(timeAgo("not a date", now)).toBe("");
  });
});

describe("compactNumber", () => {
  it("shortens thousands, millions and billions", () => {
    expect(compactNumber(950)).toBe("950");
    expect(compactNumber(1000)).toBe("1 тыс");
    expect(compactNumber(1234)).toBe("1,2 тыс");
    expect(compactNumber(45_600)).toBe("46 тыс");
    expect(compactNumber(3_400_000)).toBe("3,4 млн");
    expect(compactNumber(-2_500_000_000)).toBe("-2,5 млрд");
  });
});

describe("initials", () => {
  it("takes the first letters of up to two words", () => {
    expect(initials("Алексей Макаров")).toBe("АМ");
    expect(initials("  alllexey ")).toBe("A");
    expect(initials("Анна Мария Иванова")).toBe("АМ");
    expect(initials("")).toBe("?");
  });
});
