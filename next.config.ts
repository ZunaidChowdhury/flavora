import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      // Google Drive direct image links
      {
        protocol: "https",
        hostname: "drive.google.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      // Pravatar (used by seed data)
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
      },
      // Unsplash (used by seed recipe images)
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      // UploadThing CDN (used for uploaded recipe images)
      {
        protocol: "https",
        hostname: "utfs.io",
      },
      {
        protocol: "https",
        hostname: "*.ufs.sh",
      },
    ],
  },
};

export default nextConfig;
