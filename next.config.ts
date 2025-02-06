import type { NextConfig } from "next";
import { loadConfig } from "./env";

loadConfig();

const nextConfig: NextConfig = {
  experimental: { testProxy: true },
  /* config options here */
};

export default nextConfig;
