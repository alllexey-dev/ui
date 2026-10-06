import { svelte } from "@sveltejs/vite-plugin-svelte";
import { defineConfig } from "vite";

export default defineConfig({
  root: "docs",
  base: "./",
  plugins: [svelte({ configFile: "../svelte.config.js" })],
  build: { outDir: "dist", emptyOutDir: true },
  server: { port: 5180 },
});
