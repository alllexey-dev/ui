// ui-theme: prints a static theme stylesheet (light + dark) for pages that cannot run JavaScript.
//   npx ui-theme [--seed #0061a4] [--variant tonal|vibrant|expressive|fidelity] [--out theme.css]
import { writeFileSync } from "node:fs";
import { parseArgs } from "node:util";
import { staticThemeCss } from "../src/lib/theme/static.js";
import { variants, type Variant } from "../src/lib/theme/scheme.js";

const { values } = parseArgs({
  options: {
    seed: { type: "string", default: "#0061a4" },
    variant: { type: "string", default: "tonal" },
    out: { type: "string" },
    help: { type: "boolean", short: "h" },
  },
});

if (values.help) {
  console.log("usage: ui-theme [--seed #rrggbb] [--variant " + variants.join("|") + "] [--out file.css]");
  process.exit(0);
}
if (!/^#[0-9a-f]{6}$/i.test(values.seed)) {
  console.error(`ui-theme: --seed must look like #0061a4, got ${values.seed}`);
  process.exit(2);
}
if (!variants.includes(values.variant as Variant)) {
  console.error(`ui-theme: --variant must be one of ${variants.join(", ")}`);
  process.exit(2);
}

const css = staticThemeCss(values.seed, values.variant as Variant);
if (values.out) writeFileSync(values.out, css);
else process.stdout.write(css);
