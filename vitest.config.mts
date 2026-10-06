import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    tsconfigPaths: true,
    alias: {
      // Outside Next.js, `server-only` throws on import by design. Tests
      // run server modules directly, so give them its no-op build.
      "server-only": fileURLToPath(new URL("./node_modules/server-only/empty.js", import.meta.url)),
    },
  },
  test: {
    // Most tests exercise route handlers, which run on the server.
    // Component tests opt into the DOM with `// @vitest-environment jsdom`.
    environment: "node",
    include: ["**/*.test.{ts,tsx}"],
    exclude: ["node_modules/**", ".next/**"],
    restoreMocks: true,
  },
});
