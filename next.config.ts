/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: 'OH-NO',   // ใส่ชื่อ repo ของคุณตรงนี้
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;