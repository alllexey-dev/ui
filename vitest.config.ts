import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["tests/**/*.test.ts"],
    // material-color-utilities ships extensionless ESM imports that Node cannot resolve on its own.
    server: { deps: { inline: ["@material/material-color-utilities"] } },
  },
});
