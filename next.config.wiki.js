/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/wiki',
  distDir: 'out-wiki',
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
