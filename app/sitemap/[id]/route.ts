import { NextResponse } from 'next/server'
import { SITEMAP_IDS, getEntriesForId, entriesToXml } from '@/lib/sitemap'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: rawId } = await params

  // Strip .xml extension if present (e.g., "en.xml" → "en")
  const id = rawId.endsWith('.xml') ? rawId.slice(0, -4) : rawId

  if (!SITEMAP_IDS.includes(id)) {
    return new NextResponse('Not Found', { status: 404 })
  }

  const entries = await getEntriesForId(id)

  return new NextResponse(entriesToXml(entries), {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
