import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Next.js blocks cross-origin dev requests by default; the dev server is
  // reached both via localhost and via the LAN IP for network testers.
  allowedDevOrigins: ["192.168.1.20"],
};

export default nextConfig;
