# @alllexey/ui

Material 3 Expressive design system for alllexey.dev projects: colour scheme from one seed, tokens, CSS components,
framework-free custom elements and Svelte 5 components. One look and one set of UX rules ([UX.md](UX.md)) for
every site and app.

- Theme: dynamic colour from `@material/material-color-utilities` (spec 2025), four palettes, light and dark,
  plus harmonized `success` and `warning` roles.
- Shared choice: the theme lives in the `alllexey-theme` cookie on `.alllexey.dev`, so changing it on one site
  changes it on all of them. Default: calm (tonal) palette from `#0061a4`, following the system light/dark mode.
- Shapes: the M3 Expressive shape library as polygons with a common point count, so any shape morphs into any other.
- Fonts: Roboto Flex and Roboto Mono (Latin and Cyrillic), icons: Material Symbols Rounded.

## Install

```bash
npm install @alllexey/ui
```

## Svelte 5

```svelte
<script lang="ts" module>
  import "@alllexey/ui/css";
  import { createTheme, defineIcons } from "@alllexey/ui";
  import dashboard from "@material-symbols/svg-400/rounded/dashboard.svg?raw";

  defineIcons({ dashboard });
  const theme = createTheme();
</script>

<script lang="ts">
  import { AppShell, Page, PageHeader, Snackbars, snackbars } from "@alllexey/ui";
</script>

<AppShell brand="cringetrader" {theme} items={[{ href: "#/", label: "Обзор", icon: "dashboard", active: true }]}>
  <Page>
    <PageHeader title="Обзор" text="Сводка за сегодня" />
    <button class="m3-btn" onclick={() => snackbars.show("Готово")}>Сделать</button>
  </Page>
</AppShell>
<Snackbars />
```

Components: `AppShell`, `Page`, `PageHeader`, `Account`, `Dialog`, `ConfirmDialog`, `ThemeSettings`, `Snackbars`
(with the `snackbars` store), `ButtonGroup`, `Switch`, `Search`, `EmptyState`, `LoadingIndicator`, `LoadingOverlay`,
`WavyProgress`, `Meter`, `Shape`, `StatusShape`, `Sparkline`, `DataGrid`, `Icon`. The uPlot chart is a separate
entry so apps without charts do not need uPlot:

```ts
import Chart from "@alllexey/ui/chart";
```

Charts handle signed values (returns, balances): the y axis keeps zero in view and draws a zero line when the
data crosses it; `min` and `max` pin either end.

Mobile: put `viewport-fit=cover` into the viewport meta so the shell can respect notches and the home indicator:

```html
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
```

Helpers: `revalidate` (stale-while-revalidate cache), `clipPath` / `svgPath` for shapes, `applyTheme`,
`schemeVariables`, `cssVar`.

## CSS classes

Every class is prefixed with `m3-`; modifiers only apply together with one:
`m3-btn tonal|tertiary|outlined|text|elevated|danger|danger-tonal|small|large`, `m3-icon-btn`, `m3-fab`,
`m3-group`, `m3-chip selected`, `m3-pill ok|warn|bad|neutral`, `m3-card low|high|outlined|primary|...`,
`m3-list`, `m3-list-item`, `m3-segmented`, `m3-table`, `m3-tabs`, `m3-search`, `m3-field`, `m3-switch`,
`m3-dialog`, `m3-snackbar`, typography (`m3-title-large`, `m3-body-medium`, ...) and text helpers
(`m3-muted`, `m3-num`, `m3-mono`, `m3-clip`).

## Without a build step

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@alllexey/ui@0/dist/standalone/ui.css" />
<script type="module" src="https://cdn.jsdelivr.net/npm/@alllexey/ui@0/dist/standalone/ui.js"></script>

<button class="m3-btn tonal">Кнопка</button>
<m3-shape shape="cookie9" size="48">A</m3-shape>
<m3-loading-indicator contained></m3-loading-indicator>
<m3-progress value="40"></m3-progress>
```

The script applies the shared theme, registers the custom elements and exposes `window.m3`
(`applyTheme`, `writeChoice`, `seeds`, ...). Put `data-no-theme` on `<html>` to apply a theme yourself.

## Static theme

For pages that cannot run JavaScript, generate a stylesheet with light, dark and system-dark blocks:

```bash
npx ui-theme --seed "#0061a4" --variant tonal --out theme.css
```

## Release

Bump `version` in package.json, commit, then tag `vX.Y.Z` and push the tag: `release.yml` checks the package
and publishes it to npm through trusted publishing (OIDC, no token).

## Development

```bash
npm install
npm run dev
```

`npm run dev` opens the showcase (docs/) on http://localhost:5180. Before a release: `npm run check`,
`npm test`, `npm run build`, `npm run lint:package`. After changing the default seed or the scheme code, run
`npm run gen:theme` to refresh `src/lib/styles/theme-default.css` (a test checks it).

## License

MIT. Roboto Flex and Roboto Mono: SIL Open Font License 1.1. Material Symbols: Apache License 2.0.
