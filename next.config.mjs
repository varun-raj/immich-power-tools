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
  transpilePackages: [
    "antd",
    "@ant-design/plots",
    "@ant-design/icons",
    "@ant-design/icons-svg",
    "@ant-design/pro-components",
    "@ant-design/pro-layout",
    "@ant-design/pro-list",
    "@ant-design/pro-descriptions",
    "@ant-design/pro-form",
    "@ant-design/pro-skeleton",
    "@ant-design/pro-field",
    "@ant-design/pro-utils",
    "@ant-design/pro-provider",
    "@ant-design/pro-card",
    "@ant-design/pro-table",
    "rc-pagination",
    "rc-picker",
    "rc-util",
    "rc-tree",
    "rc-tooltip",
    'rc-input'
  ],
};

export default nextConfig;
