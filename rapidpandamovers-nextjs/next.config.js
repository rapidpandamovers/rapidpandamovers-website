const redirectsData = require('./data/redirects.json');

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.rapidpandamovers.com',
        pathname: '/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year cache
  },
  async redirects() {
    return redirectsData.redirects.map(redirect => ({
      source: redirect.source,
      destination: redirect.destination,
      permanent: redirect.permanent,
    }));
  },
}

module.exports = nextConfig
