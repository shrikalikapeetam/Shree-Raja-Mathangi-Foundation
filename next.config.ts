import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Isolate performance builds so next dev can continue running on port 3000.
  distDir: process.env.NEXT_BUILD_DIR || ".next",
  images: {
    deviceSizes: [
      384, 480, 640, 750, 828, 1080, 1200, 1440, 1600, 1920, 2048, 3840,
    ],
  },
};

export default nextConfig;
