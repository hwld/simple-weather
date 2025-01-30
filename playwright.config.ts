import { defineConfig } from "next/experimental/testmode/playwright";

export default defineConfig({
  webServer: { command: "npm run dev", url: "http://localhost:3000" },
  testMatch: "tests/**/*.spec.ts",
});
