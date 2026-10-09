# @alllexey/ui

The design system of the alllexey.dev projects, built on Material 3 Expressive. It gives every site and app
the same look and the same behaviour:

- a colour scheme generated from one seed colour, light and dark, shared by all alllexey.dev sites through a
  cookie;
- CSS tokens and `m3-*` component classes that work in any markup;
- Svelte 5 components for the frame, forms, dialogs, data and loading states;
- three framework-free custom elements and a one-file bundle for pages without a build step.

How screens should behave (loading, errors, confirmations, phones) is described in [UX.md](UX.md). The
components already follow it. The showcase in `docs/` shows everything live: `npm run dev`.

## Install

```bash
npm install @alllexey/ui
```

Svelte 5 is a peer dependency of the components; uPlot is needed only for charts.

## Quick start

```svelte
<!-- App.svelte -->
<script lang="ts">
  import "@alllexey/ui/css";
  import { Account, AppShell, Page, PageHeader, Snackbars, snackbars } from "@alllexey/ui";

  const items = [
    { href: "#/", label: "Обзор", icon: "dashboard", active: true },
    { href: "#/logs", label: "Логи", icon: "description" },
  ];
</script>

<AppShell brand="console" {items}>
  {#snippet account()}<Account name="alllexey" status="на связи" tone="ok" />{/snippet}
  <Page>
    <PageHeader title="Обзор" text="Сводка за сегодня" />
    <button class="m3-btn" onclick={() => snackbars.show("Готово")}>Сделать</button>
  </Page>
</AppShell>
<Snackbars />
```

Put `viewport-fit=cover` into the viewport meta, so the frame can keep clear of notches and the home
indicator:

```html
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
```

## Theme

The theme is one choice for all alllexey.dev sites: mode (light, dark or system), seed colour and palette
variant, stored in the `alllexey-theme` cookie on `.alllexey.dev`. Change it on one site and the others follow.
Outside that domain (localhost) the cookie is per host. The default is the calm (tonal) palette from `#0061a4`
in the system mode.

- `AppShell` and `TopBar` apply the theme and show the "Оформление" button. Nothing to set up.
- `getTheme()` returns the reactive store (`mode`, `seed`, `variant`, `resolved`) for code that needs to read
  or change the theme. It is shared, so call it wherever you need it.
- Canvas drawings bake colours in. Read them with `cssVar("--md-primary")` and redraw in
  `onThemeChange(callback)`. `Chart` does this already.
- The CSS ships the default scheme for the first paint, including the system dark mode.

For a page that cannot run JavaScript, generate a static stylesheet with light and dark blocks:

```bash
npx ui-theme --seed "#0061a4" --variant tonal --out theme.css
```

Colour roles are CSS custom properties: `--md-primary`, `--md-on-primary`, `--md-primary-container`,
`--md-surface-container-high`, and the rest of the M3 set, plus `success` and `warning` harmonized with the seed.
Type, shape and motion tokens: `--md-title-large`, `--md-shape-xl`, `--md-spring-default`, and so on in
[tokens.css](src/lib/styles/tokens.css).

## Components

| Component | What it is for |
|---|---|
| `AppShell` | Frame of an app with sections: navigation rail, drawer on phones, FAB, appearance button. |
| `TopBar` | Header of a single-page site without navigation. |
| `Page`, `PageHeader` | Content column of a page; its title, one line of text, actions, a back link. |
| `Account` | The signed-in user at the bottom of the rail: avatar, status, profile link, logout button. |
| `ButtonGroup` | One choice out of 2-5 (period, view mode). |
| `Chips` | Filters: one choice or several, with counts. |
| `Tabs` | Tabs over content on the same page, keyboard navigation and attention badges. |
| `TextField`, `Search`, `Switch`, `FileDrop` | Form controls with labels, hints and errors as UX.md describes. |
| `VoteButtons` | Up and down votes with counts. |
| `Dialog`, `ConfirmDialog` | Dialogs; only the topmost closes on Escape. `ConfirmDialog` can require typing a name. |
| `Snackbars` + `snackbars` | Short messages about a result, with an optional action ("Отменить"). |
| `Loadable` + `Resource` | Loading, error with retry and data for one request (see below). |
| `LoadingIndicator`, `LoadingOverlay`, `EmptyState` | The same states for screens built by hand. |
| `WavyProgress`, `Meter` | Progress for headline numbers and for rows. |
| `StatusShape` | Status mark with text: `ok`, `warn`, `bad`, `neutral`. |
| `Shape`, `Avatar`, `Icon` | Expressive shapes with tonal colours, people, Material Symbols. |
| `DataGrid`, `Sparkline`, `Chart` | Raw tables, tiny trends, uPlot time series. |
| `ThemeSettings` | The appearance dialog, for apps that open it from somewhere else. |

Every component file starts with a comment on what it does and how to use it; the props are typed.

### Data from a request

`Resource` holds one request: the cached copy shows at once, a fresh one replaces it quietly, the old data
stays while a new request runs, and answers of a replaced request are dropped. `Loadable` draws its states.

```svelte
<script lang="ts">
  import { Loadable, Resource } from "@alllexey/ui";

  const stacks = new Resource("/api/stacks", () => fetch("/api/stacks").then((r) => r.json()));
  void stacks.load();
  $effect(() => stacks.poll(10_000)); // optional: live data, no indicators
</script>

<Loadable resource={stacks} errorTitle="Не удалось загрузить стеки">
  {#snippet children(list)}
    {#each list as stack}...{/each}
  {/snippet}
</Loadable>
```

Switch to another request (a filter, a page) with `stacks.load(key, fetch)`. After a change on the server call
`forget(prefix)` and `load()` again.

### Charts

`Chart` lives in its own entry, so apps without charts do not need uPlot:

```ts
import Chart from "@alllexey/ui/chart";
```

It takes `times` (unix seconds) and one array of values per series. Series sampled at different moments go
through `alignSeries`. The y axis keeps zero in view and draws a zero line when the data crosses it; set
`zero={false}` for prices. Series can be dashed or unfilled, and `markers` draw vertical lines with a caption.

### Icons

`Icon` draws Material Symbols Rounded by name. The icons the package uses itself are built in
(`builtinIconNames`). Register the rest once at startup, straight from `@material-symbols/svg-400`:

```ts
import { defineIcons } from "@alllexey/ui";

defineIcons(
  import.meta.glob("/node_modules/@material-symbols/svg-400/rounded/{dashboard,dashboard-fill,description}.svg", {
    query: "?raw",
    import: "default",
    eager: true,
  }),
);
```

Navigation items show the `-fill` variant when active, so register both for them.

### Text helpers

`plural`, `duration`, `timeAgo`, `compactNumber`, `initials` and `fileSize` format Russian interface text the
way UX.md asks: "5 мин назад", "2 ч 5 мин", "1,2 тыс", "1,5 МБ".

## CSS classes

Every class starts with `m3-`; modifiers (`tonal`, `small`, `active`, ...) only work together with one.

- Buttons: `m3-btn` (`tonal`, `tertiary`, `outlined`, `text`, `elevated`, `danger`, `danger-tonal`, `small`,
  `large`), `m3-icon-btn` (`filled`, `tonal`, `outlined`, `small`), `m3-fab`, `m3-group`, `m3-chip`.
- Surfaces: `m3-card` (`low`, `high`, `highest`, `outlined`, `flush`, and the roles `primary`, `secondary`,
  `tertiary`, `error`, `warning`, `success`), `m3-section-head` with `m3-section-title`.
- Lists and tables: `m3-list`, `m3-segmented`, `m3-list-item` with `lead`, `main` (`headline`, `support`) and
  `trail` (`wrap` lets long text wrap), `m3-table` with `tr` and `th` rows (clickable rows are `a`, `button`
  or `role="button"`; `selected`), `m3-details` for key-value facts, `m3-stat` for a headline number.
- Status: `m3-pill` (`ok`, `warn`, `bad`, `neutral`, `primary`, `tertiary`), text colours `m3-ok`,
  `m3-warn`, `m3-bad`, `m3-muted`, `m3-faint`.
- Fields: `m3-field` (`compact`), `m3-text-field`, `m3-search` (`compact`), `m3-switch`, `m3-tabs`.
- Typography: `m3-display-large` ... `m3-label-small`, `m3-emphasized`, `m3-num` (tabular digits),
  `m3-mono`, `m3-clip` (one line), `m3-clamp` (several lines, `--lines`), `m3-sr-only`, `pre.m3-code`.
- `m3-state` gives a custom control the hover and press layer of the built-in ones.

## Without a build step

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@alllexey/ui@0/dist/standalone/ui.css" />
<script type="module" src="https://cdn.jsdelivr.net/npm/@alllexey/ui@0/dist/standalone/ui.js"></script>

<button class="m3-btn tonal">Кнопка</button>
<m3-shape shape="cookie9" size="48">A</m3-shape>
<m3-loading-indicator contained></m3-loading-indicator>
<m3-progress value="40"></m3-progress>
```

The script applies the shared theme, registers the custom elements and exposes `window.m3` (`applyTheme`,
`writeChoice`, `onThemeChange`, `seeds`, ...). Put `data-no-theme` on `<html>` to apply a theme yourself.
Bundled apps get the same elements from `@alllexey/ui/elements` (types for Svelte markup:
`@alllexey/ui/elements/svelte`).

## Development

```bash
npm install
npm run dev      # the showcase on http://localhost:5180
npm run check    # types
npm test
npm run build    # the package into dist/
```

- After changing the default seed or the scheme code, run `npm run gen:theme` to refresh
  `src/lib/styles/theme-default.css` (a test compares them).
- After changing the list of built-in icons in `scripts/icons.mjs`, run `node scripts/icons.mjs`.
- Proposals and bugs found in the apps go to [backlog.md](backlog.md); what each release changed is in
  [CHANGELOG.md](CHANGELOG.md).

Release: bump `version` in package.json, add the CHANGELOG entry, commit, tag `vX.Y.Z` and push the tag.
`release.yml` checks the package and publishes it to npm through trusted publishing.

## License

MIT. Roboto Flex and Roboto Mono: SIL Open Font License 1.1. Material Symbols: Apache License 2.0.
