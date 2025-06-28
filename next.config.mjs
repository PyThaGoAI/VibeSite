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
  experimental: {
    // Disable problematic features that might cause invariant errors
    appDir: true,
  },
  // Ensure proper handling of client components
  swcMinify: true,
  // Optimize for production
  compress: true,
  // Handle static optimization properly
  trailingSlash: false,
  // Ensure proper hydration
  reactStrictMode: false,
}

export default nextConfig