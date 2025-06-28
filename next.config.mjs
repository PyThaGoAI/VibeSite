/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Disable problematic features that might cause invariant errors
  experimental: {
    // Force static generation to avoid client-side routing issues
    forceSwcTransforms: true,
  },
  // Ensure proper handling of client components
  swcMinify: true,
  // Optimize for production
  compress: true,
  // Handle static optimization properly
  trailingSlash: false,
  // Disable strict mode to prevent double rendering issues
  reactStrictMode: false,
  // Disable server components features that might conflict
  serverComponentsExternalPackages: [],
  // Ensure proper hydration
  poweredByHeader: false,
  // Optimize bundle
  optimizeFonts: true,
  // Disable problematic features
  modularizeImports: {},
}

export default nextConfig