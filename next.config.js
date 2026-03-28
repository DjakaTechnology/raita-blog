/** @type {import('next').NextConfig} */
const fs = require('fs');
const path = require('path');

// Detect wiki mode: if app-blog-backup exists, we've swapped to wiki mode
const isWiki = fs.existsSync(path.join(__dirname, 'src/app-blog-backup'));

const nextConfig = {
  output: 'export',
  basePath: isWiki ? '/wiki' : '/blog',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  turbopack: {},
  webpack: (config, { dev }) => {
    if (dev) {
      config.plugins.push({
        apply(compiler) {
          compiler.hooks.afterCompile.tap('WatchContent', (compilation) => {
            compilation.contextDependencies.add(path.join(__dirname, 'content'));
          });
        },
      });
    }
    return config;
  },
};

module.exports = nextConfig;
