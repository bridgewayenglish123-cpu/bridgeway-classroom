/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'app.bridgewayenglish.net',
        pathname: '/api/og/**',
      },
    ],
  },
}

export default nextConfig
