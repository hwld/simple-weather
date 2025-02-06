import { loadEnvConfig } from "@next/env";
import { z } from "zod";

const envSchema = z.object({
  WEATHER_API_KEY: z.string().min(1),
});

// process.envにglobals.d.tsで手動で型をつける
export type Env = z.infer<typeof envSchema>;

export function loadConfig() {
  const { combinedEnv } = loadEnvConfig(process.cwd());
  const result = envSchema.safeParse(combinedEnv);

  if (result.error) {
    console.error("Invalid environment variables:", result.error.format());
    process.exit(1);
  }
}
