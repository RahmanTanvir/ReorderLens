import type { NextConfig } from "next";

/**
 * Note on Vercel Services routing:
 * Service bindings (process.env.BACKEND_URL) resolve only at runtime inside
 * serverless functions — not during `next build` and not in middleware.
 * Therefore, `/backend/:path*` requests are proxied at runtime by the App Router
 * route handler in `app/backend/[...path]/route.ts` using `process.env.BACKEND_URL`.
 */
const nextConfig: NextConfig = {};

export default nextConfig;
