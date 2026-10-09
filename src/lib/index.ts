// Svelte components, helpers and the theme. The uPlot chart has its own entry, @alllexey/ui/chart, so apps
// without charts do not need uPlot; the CSS is @alllexey/ui/css.

// Frame and pages
export { default as AppShell, type FabAction, type NavItem } from "./components/AppShell.svelte";
export { default as TopBar } from "./components/TopBar.svelte";
export { default as Page } from "./components/Page.svelte";
export { default as PageHeader } from "./components/PageHeader.svelte";
export { default as Account } from "./components/Account.svelte";
export { default as ThemeSettings } from "./components/ThemeSettings.svelte";

// Actions and input
export { default as ButtonGroup, type GroupOption } from "./components/ButtonGroup.svelte";
export { default as Chips, type ChipOption } from "./components/Chips.svelte";
export { default as Tabs, type TabOption } from "./components/Tabs.svelte";
export { default as Switch } from "./components/Switch.svelte";
export { default as Search } from "./components/Search.svelte";
export { default as TextField } from "./components/TextField.svelte";
export { default as FileDrop } from "./components/FileDrop.svelte";
export { default as VoteButtons, type VoteValue } from "./components/VoteButtons.svelte";

// Dialogs and feedback
export { default as Dialog } from "./components/Dialog.svelte";
export { default as ConfirmDialog } from "./components/ConfirmDialog.svelte";
export { default as Snackbars } from "./components/Snackbars.svelte";
export { snackbars, type Snack, type SnackOptions } from "./snackbar.svelte.js";
export { default as EmptyState } from "./components/EmptyState.svelte";
export { default as LoadingIndicator } from "./components/LoadingIndicator.svelte";
export { default as LoadingOverlay } from "./components/LoadingOverlay.svelte";
export { default as Loadable } from "./components/Loadable.svelte";
export { Resource } from "./resource.svelte.js";
export { cached, forget, revalidate } from "./swr.js";

// Data and status
export { default as WavyProgress } from "./components/WavyProgress.svelte";
export { default as Meter } from "./components/Meter.svelte";
export { default as StatusShape, statusRole, type StatusTone } from "./components/StatusShape.svelte";
export { default as Sparkline } from "./components/Sparkline.svelte";
export { default as DataGrid, type GridColumn } from "./components/DataGrid.svelte";
export { alignSeries, chartRange, valueAt } from "./chart-data.js";

// Shapes and icons
export { default as Shape, type ShapeTone } from "./components/Shape.svelte";
export { default as Avatar } from "./components/Avatar.svelte";
export { default as Icon } from "./components/Icon.svelte";
export { builtinIconNames, defineIcons, iconPath } from "./icons/index.js";
export { clipPath, shapeNames, shapePoints, svgPath, type ShapeName } from "./shapes.js";

// Text and files
export { compactNumber, duration, initials, plural, timeAgo } from "./format.js";
export { accepts, fileSize, isImage, isVideo } from "./files.js";
export { lockScroll } from "./scroll-lock.js";

// Theme
export * from "./theme/index.js";
export { getTheme, type ThemeStore } from "./theme/store.svelte.js";
