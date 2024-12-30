/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  basePath: '',
  output: 'standalone',
  experimental: {
    serverActions: true,
  },
}

module.exports = nextConfig
