import { svelte } from "@sveltejs/vite-plugin-svelte";
import { defineConfig } from "vitest/config";

export default defineConfig({
  // compiles runes in *.svelte.ts modules under test
  plugins: [svelte({ configFile: false })],
  test: {
    include: ["tests/**/*.test.ts"],
    // material-color-utilities ships extensionless ESM imports that Node cannot resolve on its own.
    server: { deps: { inline: ["@material/material-color-utilities"] } },
  },
});
