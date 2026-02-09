import { NextResponse } from 'next/server'
import { allServices, getAllActiveCities } from '@/lib/data'

export async function GET() {
  const services = allServices.filter(s => s.is_active !== false)
  const cities = getAllActiveCities()

  const content = `# Rapid Panda Movers

> Professional moving company serving Miami-Dade County and South Florida

## About Us

Rapid Panda Movers is a licensed and insured moving company based in Miami, Florida. We specialize in local and long-distance moves, offering comprehensive moving services including packing, storage, and specialty item handling.

## Contact Information

- Phone: (786) 585-4269
- Email: info@rapidpandamovers.com
- Address: 1000 Brickell Ave, Miami, FL 33131
- Website: https://www.rapidpandamovers.com

## Services

${services.map(s => `### ${s.name}
${s.description}
URL: /${s.slug}`).join('\n\n')}

## Service Areas

We provide moving services throughout Miami-Dade County including:

${cities.map(c => `- ${c.name}`).join('\n')}

## Key Features

- Free, no-obligation quotes
- Licensed and insured movers
- Transparent pricing with no hidden fees
- Experienced, professional crews
- Same-day and emergency moving available
- Full packing and unpacking services
- Climate-controlled storage solutions
- Specialty item handling (pianos, antiques, art)

## Business Hours

Open 7 days a week: 7:00 AM - 9:00 PM

## Additional Resources

- Moving Checklist: /moving-checklist
- Moving Tips: /moving-tips
- Moving Rates: /moving-rates
- FAQs: /faq
- Reviews: /reviews
- Blog: /blog
`

  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  })
}
