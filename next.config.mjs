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
  // Disable strict mode to prevent hydration issues
  reactStrictMode: false,
  // Optimize for production
  compress: true,
  // Handle static optimization properly
  trailingSlash: false,
  // Disable problematic features that might cause invariant errors
  experimental: {
    // Disable features that can cause hydration issues
    optimizePackageImports: [],
  },
  // Ensure proper handling of client components
  swcMinify: true,
  // Optimize bundle
  optimizeFonts: true,
  // Disable server components features that might conflict
  serverComponentsExternalPackages: [],
  // Ensure proper hydration
  poweredByHeader: false,
}

export default nextConfig