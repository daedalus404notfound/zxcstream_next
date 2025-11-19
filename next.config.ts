import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.tmdb.org",
        pathname: "/t/p/**", // TMDB path pattern
      },
      {
        protocol: "https",
        hostname: "github.com",
        pathname: "/**",
      },
    ],
    qualities: [75, 100], // include 100 if you're using <Image quality={100} />
  },
};

export default nextConfig;
