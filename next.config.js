/** @type {import('next').NextConfig} */
const nextConfig = {
  // reactStrictMode: true,
  images: {
    domains: ['tania-portfolio.s3.eu-west-1.amazonaws.com']
  },
  typescript: {
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig
