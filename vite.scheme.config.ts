// Rebuilds dist/theme/scheme.js with material-color-utilities bundled in: the library uses extensionless ESM
// imports, so leaving it external would break Node, SSR and Vitest in consuming projects.
import { defineConfig } from "vite";

export default defineConfig({
  publicDir: false,
  build: {
    outDir: "dist/theme",
    emptyOutDir: false,
    target: "es2022",
    minify: false,
    lib: { entry: "src/lib/theme/scheme.ts", formats: ["es"], fileName: () => "scheme.js" },
  },
});
