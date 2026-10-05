import type { NextConfig } from "next";
import { networkInterfaces } from "node:os";

// Allow previews opened through this computer's LAN address as well as localhost.
// Next.js otherwise blocks the client scripts, leaving controls inactive.
const localDevOrigins = Object.values(networkInterfaces())
  .flatMap((addresses) => addresses ?? [])
  .filter((address) => address.family === "IPv4" && !address.internal)
  .map((address) => address.address);

const nextConfig: NextConfig = {
  allowedDevOrigins: localDevOrigins,
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
