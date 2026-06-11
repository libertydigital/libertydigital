import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "4.4mb",
    },
  },
  images: {
    qualities: [100, 75],
  },
};

export default nextConfig;
