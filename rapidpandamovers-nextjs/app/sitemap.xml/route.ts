import { NextResponse } from 'next/server'
import { sitemapIndexXml } from '@/lib/sitemap'

export async function GET() {
  return new NextResponse(sitemapIndexXml(), {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
