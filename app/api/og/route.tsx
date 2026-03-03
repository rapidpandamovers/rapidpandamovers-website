import { ImageResponse } from 'next/og'
import { type NextRequest } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'
import sharp from 'sharp'

const WIDTH = 1200
const HEIGHT = 630

// Load fonts and logo once at module level (all from ./fonts/, which is in outputFileTracingIncludes)
const fontData = readFileSync(join(process.cwd(), 'fonts/DTGetaiGroteskDisplay-Black.otf'))

const interBoldPromise = fetch(
  'https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuFuYMZg.ttf'
).then((res) => res.arrayBuffer())

// Load logo SVG with white fill for dark backgrounds (from fonts/ dir to avoid tracing public/)
const logoSvg = readFileSync(join(process.cwd(), 'fonts/rapidpandamovers-logo.svg'), 'utf-8')
  .replace(/<\?xml[^?]*\?>/, '')
  .replace(/<!DOCTYPE[^>]*>/, '')
  .trim()
  .replace(/fill="#141c21"/g, 'fill="#ffffff"')
const logoDataUri = `data:image/svg+xml;base64,${Buffer.from(logoSvg).toString('base64')}`

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

/**
 * Fetch an image via HTTP and convert to JPEG data URI with sharp.
 * No filesystem reads — avoids bundling public/ into the serverless function.
 */
async function imageToDataUri(imagePath: string): Promise<string> {
  const siteUrl = getSiteUrl()
  const url = `${siteUrl}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to fetch image: ${res.status}`)
  const imageBuffer = Buffer.from(await res.arrayBuffer())

  const jpegBuffer = await sharp(imageBuffer)
    .resize(WIDTH, HEIGHT, { fit: 'cover' })
    .jpeg({ quality: 80 })
    .toBuffer()
  return `data:image/jpeg;base64,${jpegBuffer.toString('base64')}`
}

const allFonts = (interBoldData: ArrayBuffer) => [
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

  const interBoldData = await interBoldPromise

  // Layout with featured image as full-bleed background
  if (imageParam) {
    let imageUrl: string

    try {
      imageUrl = imageParam.startsWith('http')
        ? imageParam
        : await imageToDataUri(imageParam)
    } catch {
      // If all conversion fails, skip the background image
      imageUrl = ''
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
        fonts: allFonts(interBoldData),
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
      fonts: allFonts(interBoldData),
      headers: {
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    }
  )
}
