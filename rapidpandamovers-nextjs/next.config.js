const redirectsData = require('./data/redirects.json');

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['www.rapidpandamovers.com'],
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