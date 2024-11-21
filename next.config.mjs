/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: false,
  output: 'standalone',
  images: {
    unoptimized: true,
  },
  env: {
    VERSION: process.env.VERSION,
  },
};

export default nextConfig;
