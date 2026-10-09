// One-file bundle for pages without a build step:
//   <link rel="stylesheet" href=".../standalone/ui.css"> <script type="module" src=".../standalone/ui.js"></script>
// Applies the shared alllexey.dev theme, registers the custom elements and exposes window.m3.
import "../styles/ui.css";
import { defineIcons, iconPath } from "../icons/index.js";
import { clipPath, shapeNames, svgPath } from "../shapes.js";
import { applyTheme, initTheme, onThemeChange, readChoice, seeds, variantLabels, variants, writeChoice } from "../theme/index.js";
import { defineElements } from "../elements/index.js";

const api = { applyTheme, clipPath, defineIcons, iconPath, initTheme, onThemeChange, readChoice, seeds, shapeNames, svgPath, variantLabels, variants, writeChoice };
declare global {
  interface Window {
    m3: typeof api;
  }
}

defineElements();
window.m3 = api;
// <html data-no-theme> opts out, for pages that apply their own theme through window.m3.applyTheme.
if (!document.documentElement.hasAttribute("data-no-theme")) initTheme();
