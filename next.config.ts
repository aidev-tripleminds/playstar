import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  allowedDevOrigins: ["*.ngrok-free.dev", "*.ngrok-free.app", "*.ngrok.io"],
  experimental: {
    serverActions: {
      allowedOrigins: ["*.ngrok-free.dev", "*.ngrok-free.app", "*.ngrok.io"],
    },
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.tigrisfiles.io" },
      { protocol: "https", hostname: "**.t3.storage.dev" },
    ],
  },
  turbopack: {
    resolveAlias: {
      "@omnipink/logger": "./lib/shims/omnipink-logger.ts",
      "@omnipink/logger/context": "./lib/shims/omnipink-logger-context.ts",
      "@omnipink/logger/scrub": "./lib/shims/omnipink-logger-scrub.ts",
      "@sentry/nextjs": "./lib/shims/sentry-nextjs.ts",
    },
  },
};

export default nextConfig;
