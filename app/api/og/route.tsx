import { ImageResponse } from 'next/og'
import { type NextRequest } from 'next/server'

export const runtime = 'edge'

const WIDTH = 1200
const HEIGHT = 630

// Load custom fonts at module level (cached across invocations)
const fontPromise = fetch(
  new URL('../../../fonts/DTGetaiGroteskDisplay-Black.otf', import.meta.url)
).then((res) => res.arrayBuffer())

// Load Inter Bold (static weight) for subtitle text
const interBoldPromise = fetch(
  'https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuFuYMZg.ttf'
).then((res) => res.arrayBuffer())

// Load logo SVG, swap dark fill to white, and encode as data URI
const logoPromise = fetch(
  new URL('../../../public/images/rapidpandamovers-logo.svg', import.meta.url)
).then(async (res) => {
  let svg = await res.text()
  // Strip XML declaration and DOCTYPE so it's a clean SVG for data URI
  svg = svg.replace(/<\?xml[^?]*\?>/, '').replace(/<!DOCTYPE[^>]*>/, '').trim()
  // Replace dark fill with white for use on dark backgrounds
  svg = svg.replace(/fill="#141c21"/g, 'fill="#ffffff"')
  return `data:image/svg+xml;base64,${btoa(svg)}`
})

function StarIcon() {
  return (
    <svg width="80" height="80" viewBox="0 0 32 32" fill="#f97316">
      <path d="M16 2l4.944 10.016L32 13.632l-8 7.792L25.888 32 16 26.832 6.112 32 8 21.424 0 13.632l11.056-1.616L16 2z" />
    </svg>
  )
}

function FiveStars() {
  return (
    <div style={{ display: 'flex', gap: '12px' }}>
      <StarIcon />
      <StarIcon />
      <StarIcon />
      <StarIcon />
      <StarIcon />
    </div>
  )
}

function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL || 'https://www.rapidpandamovers.com'
}

const fonts = (fontData: ArrayBuffer, interBoldData: ArrayBuffer) => [
  {
    name: 'Getai Grotesk Display',
    data: fontData,
    style: 'normal' as const,
    weight: 900 as const,
  },
  {
    name: 'Inter',
    data: interBoldData,
    style: 'normal' as const,
    weight: 700 as const,
  },
]

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const title = searchParams.get('title') || 'Rapid Panda Movers'
  const subtitle =
    searchParams.get('subtitle') || 'Professional Moving Services in Miami'
  const imageParam = searchParams.get('image')

  const [fontData, interBoldData, logoDataUri] = await Promise.all([fontPromise, interBoldPromise, logoPromise])

  // Layout with featured image as full-bleed background
  if (imageParam) {
    const siteUrl = getSiteUrl()
    let imageUrl: string
    if (imageParam.startsWith('http')) {
      imageUrl = imageParam
    } else if (imageParam.endsWith('.webp')) {
      // Satori doesn't support WebP — route through Next.js image optimization to get JPEG
      imageUrl = `${siteUrl}/_next/image?url=${encodeURIComponent(imageParam)}&w=${WIDTH}&q=80`
    } else {
      imageUrl = `${siteUrl}${imageParam.startsWith('/') ? '' : '/'}${imageParam}`
    }

    return new ImageResponse(
      (
        <div
          style={{
            width: WIDTH,
            height: HEIGHT,
            display: 'flex',
            position: 'relative',
            background: '#0f0f0f',
          }}
        >
          {/* Background image - full bleed */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt=""
            src={imageUrl}
            width={WIDTH}
            height={HEIGHT}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: WIDTH,
              height: HEIGHT,
              objectFit: 'cover',
            }}
          />

          {/* Dark overlay for readability */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: WIDTH,
              height: HEIGHT,
              display: 'flex',
              background: 'rgba(0,0,0,0.55)',
            }}
          />

          {/* Content */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: WIDTH,
              height: HEIGHT,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              padding: '60px',
            }}
          >
            {/* Top bar: logo + stars */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                position: 'absolute',
                top: '48px',
                left: '60px',
                right: '60px',
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt="Rapid Panda Movers"
                src={logoDataUri}
                height={128}
                style={{ height: '128px' }}
              />
              <FiveStars />
            </div>

            {/* Title + subtitle */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                marginBottom: '40px',
              }}
            >
              <div
                style={{
                  fontSize: title.length > 40 ? 56 : 64,
                  fontWeight: 900,
                  color: '#ffffff',
                  lineHeight: 1.15,
                  fontFamily: 'Getai Grotesk Display',
                }}
              >
                {title}
              </div>
              <div
                style={{
                  fontSize: 36,
                  fontWeight: 700,
                  fontFamily: 'Inter',
                  color: '#d1d5db',
                }}
              >
                {subtitle}
              </div>
            </div>

            {/* Bottom accent bar */}
            <div
              style={{
                width: '1080px',
                height: '6px',
                borderRadius: '3px',
                background: '#f97316',
                display: 'flex',
              }}
            />
          </div>
        </div>
      ),
      {
        width: WIDTH,
        height: HEIGHT,
        fonts: fonts(fontData, interBoldData),
        headers: {
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      }
    )
  }

  // Simple layout — no image
  return new ImageResponse(
    (
      <div
        style={{
          width: WIDTH,
          height: HEIGHT,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          background: 'linear-gradient(135deg, #0a0a0a, #171717)',
          position: 'relative',
          padding: '60px',
        }}
      >
        {/* Orange accent glow */}
        <div
          style={{
            position: 'absolute',
            top: '-120px',
            right: '-100px',
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            background: 'rgba(249,115,22,0.06)',
            display: 'flex',
          }}
        />

        {/* Top bar: logo + stars */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'absolute',
            top: '48px',
            left: '60px',
            right: '60px',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt="Rapid Panda Movers"
            src={logoDataUri}
            height={128}
            style={{ height: '128px' }}
          />
          <FiveStars />
        </div>

        {/* Title + subtitle */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            marginBottom: '40px',
          }}
        >
          <div
            style={{
              fontSize: title.length > 40 ? 60 : 68,
              fontWeight: 900,
              color: '#ffffff',
              lineHeight: 1.15,
              fontFamily: 'Getai Grotesk Display',
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: 36,
              fontWeight: 700,
              fontFamily: 'Inter',
              color: '#9ca3af',
            }}
          >
            {subtitle}
          </div>
        </div>

        {/* Bottom accent bar */}
        <div
          style={{
            width: '1080px',
            height: '6px',
            borderRadius: '3px',
            background: '#f97316',
            display: 'flex',
          }}
        />
      </div>
    ),
    {
      width: WIDTH,
      height: HEIGHT,
      fonts: fonts(fontData, interBoldData),
      headers: {
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    }
  )
}
