/** @type {import('next').NextConfig} */
const mode = process.env.BUILD_MODE || 'blog';

const nextConfig = {
  output: 'export',
  basePath: mode === 'wiki' ? '/wiki' : '/blog',
  images: {
    unoptimized: true,
  },
  ...(mode === 'wiki' && { distDir: 'out-wiki' }),
};

module.exports = nextConfig;
