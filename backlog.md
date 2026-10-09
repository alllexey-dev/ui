# Backlog

Bugs and missing pieces of `@alllexey/ui` found in the apps. They are fixed here, in batches, one release at
a time; the apps do not patch the package locally. Add an entry under "Open":

- date and one-line summary;
- what happens or what is missing, with a repro or the use case;
- what you expect;
- suspected files, if you looked.

If an app needs a workaround until the release, note it in the entry, so it can be removed afterwards. When an
entry is released, move its summary to [CHANGELOG.md](CHANGELOG.md) and delete it here.

## Open

- 2026-10-09 - Side sheet. console `ContainerDrawer.svelte` is a right-hand panel with a scrim and tabs, full
  screen on phones. It should be a `Dialog` placement (`side`), so it joins the Escape stack, locks scrolling
  and traps focus like dialogs do. One app needs it so far.
- 2026-10-09 - Pagination. itmo-widgets-web has two copies of a "21-40 из 134" bar with previous and next
  buttons. Worth a component once a second app pages through lists.
- 2026-10-09 - Theme before the first paint. With a manually chosen dark mode the page flashes light until the
  bundle runs; itmo-widgets-web copies the cookie format into its own `public/theme-init.js` to avoid it.
  Ship such a script (an external file, so strict CSP allows it) and document the `theme-color` defaults.
- 2026-10-09 - Test helpers. itmo-widgets-web shims `matchMedia`, `Element.animate`, `ResizeObserver` and the
  canvas for jsdom and resets the cache, snackbars and theme cookie between tests. A `@alllexey/ui/testing`
  entry would save every app the same file.
- 2026-10-09 - Sparkline takes a fixed pixel size; the itmo-widgets-web prototype stretches it with
  `:global(svg)`. A fluid width (fill the container) would remove that.
- 2026-10-09 - `pre.m3-code` has one size; the console and cringetrader shrink it to 11-12px for logs and want
  a bounded height with follow-scroll for live output.
