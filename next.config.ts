import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "4.4mb",
    },
  },
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [100, 75],
  },
};

export default nextConfig;
