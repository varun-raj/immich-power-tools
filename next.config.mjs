/** @type {import('next').NextConfig} */

import { readFileSync } from 'fs';

const { version } = JSON.parse(readFileSync('./package.json', 'utf-8'));

console.log(`Version: ${version}`);

const nextConfig = {
  reactStrictMode: false,
  output: 'standalone',
  images: {
    unoptimized: true,
  },
  env: {
    VERSION: version,
  },
};

export default nextConfig;
