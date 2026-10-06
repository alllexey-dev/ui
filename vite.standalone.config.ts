// Builds dist/standalone: ui.js (theme + custom elements, no Svelte) and ui.css. Fonts land in dist/fonts,
// the same files the Svelte entry uses, so the package ships them once.
import { defineConfig } from "vite";

export default defineConfig({
  publicDir: false,
  base: "./",
  build: {
    outDir: "dist",
    emptyOutDir: false,
    target: "es2022",
    assetsInlineLimit: 0,
    rollupOptions: {
      input: { ui: "src/lib/standalone/index.ts" },
      preserveEntrySignatures: false,
      output: {
        entryFileNames: "standalone/[name].js",
        assetFileNames: (asset) => (asset.names?.[0]?.endsWith(".css") ? "standalone/ui.css" : "fonts/[name][extname]"),
      },
    },
  },
});
