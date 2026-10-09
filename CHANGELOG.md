# Changelog

## 0.4.0

Collected from the apps that use the package (console, cringetrader, itmo-widgets-web, itmo-widgets-feedback):
what each of them built or patched on its own now lives here.

### Breaking

- `createTheme()` is gone: `AppShell` and `TopBar` apply the theme and show the appearance button
  themselves, and their `theme` prop is removed. Code that reads the theme calls `getTheme()`, which returns
  the same store everywhere, so a local `theme.svelte.ts` singleton can go. `ThemeSettings` lost its `theme`
  prop too.
- `StatusShape`: the tone `off` is now `neutral`, the same word as `m3-pill neutral`; the type `Tone` is now
  `StatusTone`.
- `Account`: `tone` takes a `StatusTone` (`ok`, `warn`, `bad`, `neutral`) instead of `"" | "ok" | "bad"`.
- `Meter`: `tone` is `"warn" | "bad"` or nothing; `""` is no longer accepted.
- `Switch` no longer binds the input directly: it calls `onchange` and applies the change unless `onchange`
  returns `false`. `bind:checked` works as before, but inside `onchange` the bound variable still holds the
  old value: use the argument.
- `Chart`: `values` may contain `null`; the hover legend shows each series' last value at or before the
  cursor instead of `0`.
- `chartRange` moved from `chart-range.ts` to `chart-data.ts` and is exported from the package.
- The root class of `Shape` is `m3-shape` (was `shape`) and of `StatusShape` `m3-status` (was `status`).

### Added

- `Resource` and `Loadable`: one request with cache, stale answers dropped and quiet polling, and the
  loading / error with retry / data states for it.
- `Tabs` (arrow keys, badges), `Chips` (one or several, counts) and `Avatar` (photo or initials).
- `Shape tone` (`primary`, `secondary`, `tertiary`, `success`, `warning`, `error`, `neutral`) instead of
  passing `color` and `fg`; `statusRole` maps a status to its colour role.
- `StatusShape` takes the status text as children.
- `LoadingIndicator block`: centred, as large as `EmptyState`.
- `Account`: `src`, `href` and an `actions` snippet (logout).
- `PageHeader`: `back` link and children for a supporting line with markup.
- `Search`: `label`, `compact`, other input attributes. `Switch`: visible text as children, disabled look.
  `ButtonGroup fill`. `ConfirmDialog busy`.
- `Chart`: `zero={false}` for prices, per-series `width`, `dash` and `fill`, `markers`; `alignSeries` for
  series sampled at different moments, `valueAt`.
- `onThemeChange(callback)` for canvas drawings (also on `window.m3`); `Chart` uses it instead of watching
  `<html>` attributes, so opening a dialog no longer rebuilds charts.
- `plural`, `duration`, `timeAgo`, `compactNumber`, `initials`; `fileSize` knows terabytes.
- `defineIcons` takes the result of `import.meta.glob` (keys are file paths); `builtinIconNames`.
- `VoteButtons`: both counts are optional (hidden dislikes, a plain like/dislike toggle).
- `snackbars.clear()`, `lockScroll` is exported.
- CSS: `m3-section-head`, `m3-details`, `m3-stat`, `m3-clamp`, `m3-sr-only`, `m3-chips`, `m3-search compact`,
  `m3-group fill`, `m3-list-item wrap`, `m3-tabs` badges, links and horizontal scroll, clickable `m3-table`
  rows with `role="button"` and `selected` rows, `m3-list` and `m3-segmented` reset list styles.

### Fixed

- A disabled `m3-btn danger` (and `tonal`, `tertiary`, ...) looked enabled, including the confirm button of
  `ConfirmDialog` with `requireText`.
- Before the scripts ran, the system dark mode painted the page with a stale purple surface from tokens.css.
- `m3-segmented` tiles inside an `m3-card` melted into it; they now take a surface one step away.
- A disabled `m3-switch` looked enabled.

### Internal

- The hover and press layer of all controls is one rule set with zero specificity.
- The theme module has no import cycle; `applyTheme` lives in `theme/apply.ts`.
- The loading indicator animation and the progress colours are shared by the Svelte components and the
  custom elements.

## 0.3.0 (2026-10-07)

- `TopBar`, `TextField`, `FileDrop`, `VoteButtons` and the file helpers (`accepts`, `fileSize`, `isImage`,
  `isVideo`).
- Dark schemes no longer keep light container roles: `m3-card tertiary`, `m3-pill tertiary` and
  `m3-btn tertiary` are dark in dark mode.
- Escape closes only the topmost `Dialog`, so a confirmation over a dialog does not close both.
- The account avatar sits on the axis of the collapsed navigation rail; the root class of `Account` is
  `m3-account`.

## 0.2.0

- Charts keep zero in view and draw a zero line for signed values; `min` and `max` pin the axis.
- Progress eases to new values; the browser's `theme-color` follows the surface.
- Mobile pass: drawer swipe, scroll lock behind dialogs, 48px touch targets, safe areas.

## 0.1.0

- First release: theme from a seed, tokens, CSS components, custom elements and Svelte 5 components.
