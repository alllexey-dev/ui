import { applyTheme } from "./apply.js";
import { variants, type Variant } from "./scheme.js";

export type ThemeMode = "auto" | "light" | "dark";

export interface ThemeChoice {
  mode: ThemeMode;
  seed: string;
  variant: Variant;
}

/** System-wide default: the calm (tonal) palette from the azure seed. */
export const defaultChoice: ThemeChoice = { mode: "auto", seed: "#0061a4", variant: "tonal" };

export const seeds = [
  { name: "Фиолетовый", hex: "#6750a4" },
  { name: "Лазурный", hex: "#0061a4" },
  { name: "Бирюзовый", hex: "#006a6a" },
  { name: "Зелёный", hex: "#386a20" },
  { name: "Терракотовый", hex: "#b4532a" },
  { name: "Розовый", hex: "#9c4166" },
];

export const variantLabels: Record<Variant, string> = {
  tonal: "Спокойная",
  vibrant: "Яркая",
  expressive: "Выразительная",
  fidelity: "Точная",
};

const COOKIE = "alllexey-theme";
const ROOT_DOMAIN = "alllexey.dev";

/**
 * The choice lives in a cookie on .alllexey.dev, so every subdomain shares it: change the theme on one site
 * and the others pick it up. Elsewhere (localhost, other domains) the cookie is host-only.
 */
export function readChoice(): ThemeChoice {
  const raw = document.cookie.split("; ").find((c) => c.startsWith(`${COOKIE}=`))?.slice(COOKIE.length + 1);
  const [mode, seed, variant] = decodeURIComponent(raw ?? "").split("|");
  return {
    mode: mode === "light" || mode === "dark" || mode === "auto" ? mode : defaultChoice.mode,
    seed: /^#[0-9a-f]{6}$/i.test(seed ?? "") ? seed : defaultChoice.seed,
    variant: variants.includes(variant as Variant) ? (variant as Variant) : defaultChoice.variant,
  };
}

export function writeChoice(choice: ThemeChoice): void {
  const host = location.hostname;
  const domain = host === ROOT_DOMAIN || host.endsWith(`.${ROOT_DOMAIN}`) ? `; Domain=${ROOT_DOMAIN}` : "";
  const secure = location.protocol === "https:" ? "; Secure" : "";
  const value = encodeURIComponent(`${choice.mode}|${choice.seed}|${choice.variant}`);
  document.cookie = `${COOKIE}=${value}; Path=/; Max-Age=31536000; SameSite=Lax${domain}${secure}`;
}

/** Calls back when another tab or subdomain changes the choice. */
export function watchChoice(onChange: (choice: ThemeChoice) => void): () => void {
  let last = JSON.stringify(readChoice());
  const check = () => {
    const now = readChoice();
    if (JSON.stringify(now) !== last) {
      last = JSON.stringify(now);
      onChange(now);
    }
  };
  const store = (globalThis as { cookieStore?: EventTarget }).cookieStore;
  store?.addEventListener("change", check);
  addEventListener("focus", check);
  document.addEventListener("visibilitychange", check);
  return () => {
    store?.removeEventListener("change", check);
    removeEventListener("focus", check);
    document.removeEventListener("visibilitychange", check);
  };
}

export function resolveMode(mode: ThemeMode): "light" | "dark" {
  return mode === "auto" ? (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light") : mode;
}

/** For pages without a framework: apply the shared choice now and keep following it. */
export function initTheme(): () => void {
  const apply = (choice: ThemeChoice) => applyTheme({ seed: choice.seed, variant: choice.variant, mode: resolveMode(choice.mode) });
  apply(readChoice());
  const media = matchMedia("(prefers-color-scheme: dark)");
  const onSystem = () => apply(readChoice());
  media.addEventListener("change", onSystem);
  const stop = watchChoice(apply);
  return () => {
    media.removeEventListener("change", onSystem);
    stop();
  };
}
