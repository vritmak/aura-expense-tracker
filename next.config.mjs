/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // This ignores linting errors during the build process
    ignoreDuringBuilds: true,
  },
  typescript: {
    // If you have typescript errors, this will ignore them too
    ignoreBuildErrors: true,
  }
};

export default nextConfig;