/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/oh-no',
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;