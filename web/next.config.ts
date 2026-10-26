import type { NextConfig } from "next";

function resolveBackendUrl(): string {
  const raw = process.env.BACKEND_URL?.trim();
  const isProd = process.env.NODE_ENV === "production";

  if (!raw) {
    if (isProd) {
      throw new Error(
        "Missing BACKEND_URL environment variable in production. Set BACKEND_URL to the deployed FastAPI origin (e.g., https://your-api.vercel.app)."
      );
    }
    return "http://127.0.0.1:8000";
  }

  let parsed: URL;
  try {
    parsed = new URL(raw);
  } catch {
    throw new Error(
      `Invalid BACKEND_URL "${raw}". Must be a valid http:// or https:// URL without trailing slash.`
    );
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new Error(
      `Unsupported protocol "${parsed.protocol}" in BACKEND_URL. Expected http: or https:.`
    );
  }

  return raw.replace(/\/+$/, "");
}

const backendOrigin = resolveBackendUrl();

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/backend/:path*",
        destination: `${backendOrigin}/:path*`,
      },
    ];
  },
};

export default nextConfig;
