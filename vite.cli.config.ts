// Bundles the ui-theme CLI into one Node file: material-color-utilities uses extensionless imports
// that plain Node ESM cannot resolve.
import { defineConfig } from "vite";

export default defineConfig({
  publicDir: false,
  build: {
    outDir: "dist/bin",
    emptyOutDir: true,
    target: "node20",
    ssr: "bin/ui-theme.ts",
    rollupOptions: {
      output: { entryFileNames: "ui-theme.js", banner: "#!/usr/bin/env node" },
    },
  },
  ssr: { noExternal: true },
});
