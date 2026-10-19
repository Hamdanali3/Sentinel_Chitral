import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep firebase-admin out of the webpack bundle — it uses Node.js-only native modules
  serverExternalPackages: ["firebase-admin", "@google-cloud/firestore", "google-gax"],
  // Allow images from external domains used in the app
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.openstreetmap.org" },
      { protocol: "https", hostname: "tilecache.rainviewer.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "upload.wikimedia.org" },
    ],
  },
  // Turbopack root config to suppress the package-lock.json warning
  turbopack: {
    root: __dirname,
  },
  // Allow maplibre-gl to be bundled without SSR issues
  webpack: (config) => {
    // Treat maplibre-gl as a client-only module
    config.resolve.alias = {
      ...config.resolve.alias,
    };
    return config;
  },
};

export default nextConfig;
