import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "scontent-hkg4-1.xx.fbcdn.net",
      },
    ],
  },
};

export default nextConfig;
