import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { defaultChoice, readChoice, writeChoice } from "../src/lib/theme/shared.js";

// A minimal document.cookie: the setter stores the raw attribute string, the getter returns name=value pairs.
function fakeBrowser(hostname: string, protocol = "https:") {
  const jar = new Map<string, string>();
  const written: string[] = [];
  Object.assign(globalThis, {
    location: { hostname, protocol },
    document: {
      get cookie() {
        return [...jar].map(([k, v]) => `${k}=${v}`).join("; ");
      },
      set cookie(raw: string) {
        written.push(raw);
        const [pair] = raw.split("; ");
        const eq = pair.indexOf("=");
        jar.set(pair.slice(0, eq), pair.slice(eq + 1));
      },
    },
  });
  return { jar, written };
}

describe("shared theme choice", () => {
  const saved = { location: globalThis.location, document: globalThis.document };
  beforeEach(() => fakeBrowser("home.alllexey.dev"));
  afterEach(() => Object.assign(globalThis, saved));

  it("defaults to the calm azure palette", () => {
    expect(readChoice()).toEqual({ mode: "auto", seed: "#0061a4", variant: "tonal" });
    expect(defaultChoice).toEqual(readChoice());
  });

  it("round-trips a choice", () => {
    writeChoice({ mode: "dark", seed: "#386a20", variant: "vibrant" });
    expect(readChoice()).toEqual({ mode: "dark", seed: "#386a20", variant: "vibrant" });
  });

  it("shares the cookie with every alllexey.dev subdomain over https", () => {
    const { written } = fakeBrowser("cringetrader.alllexey.dev");
    writeChoice(defaultChoice);
    expect(written[0]).toContain("; Domain=alllexey.dev");
    expect(written[0]).toContain("; Secure");
    expect(written[0]).toContain("; SameSite=Lax");
  });

  it("keeps the cookie host-only elsewhere", () => {
    const { written } = fakeBrowser("localhost", "http:");
    writeChoice(defaultChoice);
    expect(written[0]).not.toContain("Domain=");
    expect(written[0]).not.toContain("Secure");
  });

  it("does not match look-alike domains", () => {
    const { written } = fakeBrowser("evil-alllexey.dev");
    writeChoice(defaultChoice);
    expect(written[0]).not.toContain("Domain=");
  });

  it.each(["garbage", "dark|red|vibrant", "neon|#386a20|tonal", "dark|#386a20|loud"])("falls back field by field on a bad cookie %j", (raw) => {
    const { jar } = fakeBrowser("home.alllexey.dev");
    jar.set("alllexey-theme", encodeURIComponent(raw));
    const choice = readChoice();
    expect(["auto", "light", "dark"]).toContain(choice.mode);
    expect(choice.seed).toMatch(/^#[0-9a-f]{6}$/i);
    expect(["tonal", "vibrant", "expressive", "fidelity"]).toContain(choice.variant);
  });
});
