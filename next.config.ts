import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  
  // Image optimization settings
  images: {
    unoptimized: true, // Required for static export
  },
  
  // Trailing slashes for static hosting
  trailingSlash: true,
  
  // Enable React strict mode for better development experience
  reactStrictMode: true,
  
  // Turbopack configuration (Next.js 16+)
  turbopack: {},
  
  // Note: Headers don't work with static export, but included for reference
  // These would work if deploying to Vercel or similar platforms
  // For GitHub Pages, configure headers via _headers file or server config
};

export default nextConfig;
