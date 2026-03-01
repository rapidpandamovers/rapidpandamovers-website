const createNextIntlPlugin = require('next-intl/plugin');
const redirectsData = require('./data/redirects.json');

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    BUILD_DATE: new Date().toISOString().split('T')[0],
  },
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
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
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
        ],
      },
      {
        source: '/:path((?:en|es)?)',
        headers: [
          { key: 'CDN-Cache-Control', value: 'public, s-maxage=3600, stale-while-revalidate=86400' },
        ],
      },
    ];
  },
}

module.exports = withNextIntl(nextConfig)
