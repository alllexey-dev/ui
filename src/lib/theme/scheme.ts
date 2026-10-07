import {
  argbFromHex,
  Blend,
  DynamicScheme,
  Hct,
  hexFromArgb,
  MaterialDynamicColors,
  SchemeExpressive,
  SchemeFidelity,
  SchemeTonalSpot,
  SchemeVibrant,
  TonalPalette,
} from "@material/material-color-utilities";

export type Variant = "tonal" | "vibrant" | "expressive" | "fidelity";

export const variants: Variant[] = ["tonal", "vibrant", "expressive", "fidelity"];

const roles = {
  primary: MaterialDynamicColors.primary,
  "on-primary": MaterialDynamicColors.onPrimary,
  "primary-container": MaterialDynamicColors.primaryContainer,
  "on-primary-container": MaterialDynamicColors.onPrimaryContainer,
  "primary-fixed": MaterialDynamicColors.primaryFixed,
  "primary-fixed-dim": MaterialDynamicColors.primaryFixedDim,
  secondary: MaterialDynamicColors.secondary,
  "on-secondary": MaterialDynamicColors.onSecondary,
  "secondary-container": MaterialDynamicColors.secondaryContainer,
  "on-secondary-container": MaterialDynamicColors.onSecondaryContainer,
  tertiary: MaterialDynamicColors.tertiary,
  "on-tertiary": MaterialDynamicColors.onTertiary,
  "tertiary-container": MaterialDynamicColors.tertiaryContainer,
  "on-tertiary-container": MaterialDynamicColors.onTertiaryContainer,
  error: MaterialDynamicColors.error,
  "on-error": MaterialDynamicColors.onError,
  "error-container": MaterialDynamicColors.errorContainer,
  "on-error-container": MaterialDynamicColors.onErrorContainer,
  surface: MaterialDynamicColors.surface,
  "surface-dim": MaterialDynamicColors.surfaceDim,
  "surface-bright": MaterialDynamicColors.surfaceBright,
  "surface-container-lowest": MaterialDynamicColors.surfaceContainerLowest,
  "surface-container-low": MaterialDynamicColors.surfaceContainerLow,
  "surface-container": MaterialDynamicColors.surfaceContainer,
  "surface-container-high": MaterialDynamicColors.surfaceContainerHigh,
  "surface-container-highest": MaterialDynamicColors.surfaceContainerHighest,
  "on-surface": MaterialDynamicColors.onSurface,
  "on-surface-variant": MaterialDynamicColors.onSurfaceVariant,
  outline: MaterialDynamicColors.outline,
  "outline-variant": MaterialDynamicColors.outlineVariant,
  "inverse-surface": MaterialDynamicColors.inverseSurface,
  "inverse-on-surface": MaterialDynamicColors.inverseOnSurface,
  "inverse-primary": MaterialDynamicColors.inversePrimary,
  scrim: MaterialDynamicColors.scrim,
  shadow: MaterialDynamicColors.shadow,
};

function schemeFor(seed: number, dark: boolean, variant: Variant): DynamicScheme {
  const hct = Hct.fromInt(seed);
  switch (variant) {
    case "vibrant":
      return new SchemeVibrant(hct, dark, 0, "2025");
    case "expressive":
      return new SchemeExpressive(hct, dark, 0, "2025");
    case "fidelity":
      return new SchemeFidelity(hct, dark, 0, "2025");
  }
  return new SchemeTonalSpot(hct, dark, 0, "2025");
}

/** Status colours that M3 does not define, harmonized with the seed like custom colours in Material Theme Builder. */
function customColor(name: string, hex: string, seed: number, dark: boolean): Record<string, string> {
  const palette = TonalPalette.fromInt(Blend.harmonize(argbFromHex(hex), seed));
  return {
    [name]: hexFromArgb(palette.tone(dark ? 80 : 40)),
    [`on-${name}`]: hexFromArgb(palette.tone(dark ? 20 : 100)),
    [`${name}-container`]: hexFromArgb(palette.tone(dark ? 30 : 90)),
    [`on-${name}-container`]: hexFromArgb(palette.tone(dark ? 90 : 10)),
  };
}

/**
 * The 2025 spec keeps some container roles (tertiary in every variant, primary in vibrant, expressive and
 * fidelity) as the same light accent in dark mode. Cards, pills and buttons use containers as surfaces, so in a
 * dark scheme a light container becomes the classic dark one: tone 30 with a tone 90 on-colour.
 */
function darkenContainers(scheme: DynamicScheme, vars: Record<string, string>): void {
  const palettes = { primary: scheme.primaryPalette, secondary: scheme.secondaryPalette, tertiary: scheme.tertiaryPalette, error: scheme.errorPalette };
  for (const [name, palette] of Object.entries(palettes)) {
    if (Hct.fromInt(argbFromHex(vars[`--md-${name}-container`])).tone <= 50) continue;
    vars[`--md-${name}-container`] = hexFromArgb(palette.tone(30));
    vars[`--md-on-${name}-container`] = hexFromArgb(palette.tone(90));
  }
}

/** All colour roles as CSS custom properties (--md-<role>). */
export function schemeVariables(seedHex: string, dark: boolean, variant: Variant): Record<string, string> {
  const seed = argbFromHex(seedHex);
  const scheme = schemeFor(seed, dark, variant);
  const vars: Record<string, string> = {};
  for (const [name, role] of Object.entries(roles)) {
    vars[`--md-${name}`] = hexFromArgb(role.getArgb(scheme));
  }
  if (dark) darkenContainers(scheme, vars);
  for (const [name, value] of Object.entries({ ...customColor("success", "#2e7d32", seed, dark), ...customColor("warning", "#c77700", seed, dark) })) {
    vars[`--md-${name}`] = value;
  }
  return vars;
}
