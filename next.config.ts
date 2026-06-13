import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export to GitHub Pages under /Kairos_blog. basePath, assetPrefix and
  // trailingSlash all need to match for the deployed URL shape to be correct.
  output: 'export',
  distDir: 'dist',
  basePath: '/Kairos_blog',
  assetPrefix: '/Kairos_blog',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  experimental: {
    // Tree-shake server-component lucide imports more aggressively.
    optimizePackageImports: ['lucide-react'],
  },
};

export default nextConfig;
