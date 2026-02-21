import { NextResponse } from 'next/server'
import { getLocalizedAllActiveServices, getAllActiveCities } from '@/lib/data'

const DOMAIN = 'https://www.rapidpandamovers.com'

function buildContent(services: Array<{ name: string; slug: string; description: string }>, cities: Array<{ name: string; slug: string }>) {
  return `# Rapid Panda Movers

> Professional moving company serving Miami-Dade County and South Florida. Licensed, insured, 4.7-star rated across 56+ verified reviews.

## About Us

Rapid Panda Movers is a licensed and insured moving company based in Miami, Florida. We specialize in local and long-distance moves, offering comprehensive moving services including packing, storage, and specialty item handling.

- Phone: (786) 585-4269
- Email: info@rapidpandamovers.com
- Address: 7001 North Waterway Dr #107, Miami, FL 33155
- Hours: Open 7 days a week, 8:00 AM - 8:00 PM
- Rating: 4.7 stars across 56+ verified reviews

## Pricing

- Local moves starting from $100/hour (2-hour minimum)
- Free, no-obligation quotes available
- Transparent pricing with no hidden fees

## Services

${services.map(s => `- [${s.name}](${DOMAIN}/${s.slug}): ${s.description}`).join('\n')}

## Service Areas

We provide moving services throughout Miami-Dade County including:

${cities.map(c => `- ${c.name}`).join('\n')}

## Key Features

- Free, no-obligation quotes
- Licensed and insured movers (FL DOT, FMCSA)
- Transparent pricing with no hidden fees
- Experienced, professional crews
- Same-day and emergency moving available
- Full packing and unpacking services
- Climate-controlled storage solutions
- Specialty item handling (pianos, antiques, art, gun safes, hot tubs, pool tables)

## URLs

- [Homepage](${DOMAIN})
- [About Us](${DOMAIN}/about-us)
- [Contact Us](${DOMAIN}/contact-us)
- [Get a Free Quote](${DOMAIN}/quote)
- [All Services](${DOMAIN}/services)
- [Service Locations](${DOMAIN}/locations)
- [Customer Reviews](${DOMAIN}/reviews)
- [FAQ](${DOMAIN}/faq)
- [Moving Rates](${DOMAIN}/moving-rates)
- [Moving Routes](${DOMAIN}/moving-routes)
- [Moving Tips](${DOMAIN}/moving-tips)
- [Moving Checklist](${DOMAIN}/moving-checklist)
- [Moving Glossary](${DOMAIN}/moving-glossary)
- [Why Choose Us](${DOMAIN}/why-choose-us)
- [Blog](${DOMAIN}/blog)
- [Sitemap](${DOMAIN}/sitemap)
- [Privacy Policy](${DOMAIN}/privacy)
- [Terms of Service](${DOMAIN}/terms)
`
}

export async function GET() {
  const services = getLocalizedAllActiveServices('en')
  const cities = getAllActiveCities()
  const content = buildContent(services, cities)

  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  })
}
