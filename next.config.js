/** @type {import('next').NextConfig} */
const fs = require('fs');
const path = require('path');

// Detect wiki mode: if app-blog-backup exists, we've swapped to wiki mode
const isWiki = fs.existsSync(path.join(__dirname, 'src/app-blog-backup'));

const nextConfig = {
  output: 'export',
  basePath: isWiki ? '/wiki' : '/blog',
  images: {
    unoptimized: true,
  },
  ...(isWiki && { distDir: 'out-wiki' }),
};

module.exports = nextConfig;
