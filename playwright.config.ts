import { defineConfig, devices } from "next/experimental/testmode/playwright";

export default defineConfig({
  webServer: { command: "npm run dev", url: "http://localhost:3000" },
  testMatch: "tests/**/*.spec.ts",
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  timeout: 2 * 60 * 1000,
  expect: { timeout: 30 * 1000 },
});
