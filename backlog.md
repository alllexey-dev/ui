# Backlog

Issues with `@alllexey/ui` collect here and are fixed in batches, one release at a time. Add new ones under
"Open" in the same format (date - summary, then what happens, repro, expected, suspected files) and do not fix
the package from another project; note a local workaround if you add one, so it can be removed after the release.

## Open

None.

## Released

### 0.3.0 (2026-10-07)

Also in this release: `TopBar`, `TextField`, `FileDrop`, `VoteButtons` and the file helpers (`accepts`,
`fileSize`, `isImage`, `isVideo`).

- 2026-10-07 - Tertiary (and in vibrant/expressive also primary) container roles stay bright in a dark scheme, so `m3-card tertiary`, `m3-pill tertiary` and `m3-btn tertiary` render light surfaces on a dark page
  - What happens: `schemeVariables(seed, true, variant)` returns the same light, high-chroma `--md-tertiary-container` as in light mode for every seed and variant (default seed `#0061a4`, tonal: `#d5cbfc` in both modes; `#6750a4` tonal `#f4bfe3`; `#b4532a` tonal `#ffdf9b`). In the 2025 spec of material-color-utilities 0.4.0 the TONAL_SPOT tertiary container tone is `tMaxC(palette, 0, isDark ? 93 : 100)` and the other variants are similar, i.e. a near-fixed accent tone, not a dark container. With vibrant and expressive the same happens to `--md-primary-container` in dark (`#0061a4` vibrant `#45a5ff`, expressive `#a0cafd`). The component classes use these roles as large surfaces: a whole `m3-card tertiary` is lavender on a `#0c0e12` page, a filled `m3-btn` inside it (`--md-primary`, light blue in dark) sits light-on-light, and `m3-pill tertiary` is a bright pill next to a dark `m3-pill primary` in the same row.
  - Repro: any page with `<section class="m3-card tertiary"><a class="m3-btn">...</a></section>` and `<span class="m3-pill primary">A</span><span class="m3-pill tertiary">B</span>`, theme cookie `alllexey-theme=dark|#0061a4|tonal` (or `auto` with a dark system scheme); computed `--md-tertiary-container` on `:root` is `#d5cbfc`, the same as in light. Seen on widgets.alllexey.dev/app/ (home "Всё остальное - в приложении" card before itmo-widgets-web WV-06-FIX2, Пользователи "Модератор" pill).
  - Expected: in a dark scheme the container roles used as surfaces by `.m3-card.<tone>`, `.m3-pill.<tone>` and `.m3-btn.tertiary` are dark containers with light on-colours, like `--md-primary-container` (`#3b5472`) and `--md-secondary-container` (`#303c4c`) in the tonal default; or the classes map to roles that are dark in dark mode (for example the 2021 spec tone 30 for containers in dark, or a dedicated surface role), and the README/UX.md say which tones are safe for whole cards.
  - Suspected: `src/lib/theme/scheme.ts:57-67` (`schemeFor` builds every variant with spec `"2025"`, whose container tones are mode-invariant accents); `src/lib/styles/components.css:67` (`.m3-btn.tertiary`), `:146` (`.m3-pill.tertiary`), `:154` (`.m3-card.primary`, vibrant/expressive), `:156` (`.m3-card.tertiary`); generated `src/lib/styles/theme-default.css:61-62` and `:108-109` carry the light value into the dark blocks.

  - Fixed: in dark schemes a container role that comes out light (HCT tone above 50) is replaced by the
    classic dark container, palette tone 30 with a tone 90 on-colour (`darkenContainers` in
    `src/lib/theme/scheme.ts`). Containers that are already dark keep the 2025 values (tonal default primary
    `#3b5472`, secondary `#303c4c`); the default tertiary container is now `#48416a` on `#e6deff`. All
    `.m3-card.<tone>`, `.m3-pill.<tone>` and `.m3-btn.tertiary` surfaces are dark in dark mode; tests check
    tone and contrast for every variant and six seeds. `theme-default.css` regenerated.

- 2026-10-07 - Escape closes every open Dialog at once, so a ConfirmDialog opened from a Dialog takes its parent down with it
  - What happens: each `Dialog` listens on `<svelte:window onkeydown>` and calls `onclose` on Escape, so with a `ConfirmDialog` stacked over a `Dialog` one Escape cancels the confirmation and also closes the dialog underneath. The user loses the context they wanted to return to.
  - Repro: a `Dialog` with a button that opens `ConfirmDialog` (itmo-widgets-feedback `/admin`: a submission -> "Удалить"), press Escape while the confirmation is open: both disappear.
  - Expected: Escape closes only the topmost dialog (a module-level stack of open dialogs; the handler acts only when its dialog is on top and stops propagation), the same for a click on the scrim.
  - Suspected: `src/lib/components/Dialog.svelte:49` (`svelte:window onkeydown` without a stack check).
  - Fixed: `Dialog` keeps a module-level stack of open dialogs and handles Escape only when it is on top;
    the scrim of the top dialog already covered the ones below. The showcase (Feedback page) has a dialog with
    a confirmation inside to check it.

- 2026-10-07 - In the collapsed navigation rail the account avatar sat left of the icon axis
  - What happens: `Account` hid its name with `opacity: 0`, so the invisible text kept its width and pushed the
    avatar left (owner noticed on ui.alllexey.dev).
  - Fixed: in collapsed states the text leaves the layout and the avatar is centred; checked collapsed,
    expanded, tablet width and the phone drawer. The root class of `Account` is now `m3-account`.
