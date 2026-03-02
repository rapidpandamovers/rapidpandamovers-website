import { ImageResponse } from 'next/og'
import { type NextRequest } from 'next/server'

export const runtime = 'edge'

const WIDTH = 1200
const HEIGHT = 630

// Load custom font at module level (cached across invocations)
const fontPromise = fetch(
  new URL('../../../fonts/DTGetaiGroteskDisplay-Black.otf', import.meta.url)
).then((res) => res.arrayBuffer())

function StarIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="#f97316">
      <path d="M16 2l4.944 10.016L32 13.632l-8 7.792L25.888 32 16 26.832 6.112 32 8 21.424 0 13.632l11.056-1.616L16 2z" />
    </svg>
  )
}

function FiveStars() {
  return (
    <div style={{ display: 'flex', gap: '8px' }}>
      <StarIcon />
      <StarIcon />
      <StarIcon />
      <StarIcon />
      <StarIcon />
    </div>
  )
}

function LogoText() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        fontSize: '28px',
        fontWeight: 900,
        color: '#ffffff',
        fontFamily: 'Getai Grotesk Display',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          background: '#f97316',
          fontSize: '28px',
        }}
      >
        RP
      </div>
      Rapid Panda Movers
    </div>
  )
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const title = searchParams.get('title') || 'Rapid Panda Movers'
  const subtitle =
    searchParams.get('subtitle') || 'Professional Moving Services in Miami'
  const imageParam = searchParams.get('image')

  const fontData = await fontPromise

  // Layout with featured image on the right
  if (imageParam) {
    const imageUrl = imageParam.startsWith('http')
      ? imageParam
      : `https://www.rapidpandamovers.com${imageParam.startsWith('/') ? '' : '/'}${imageParam}`

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
          <img
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

          {/* Dark gradient overlay - opaque left, transparent right */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: WIDTH,
              height: HEIGHT,
              display: 'flex',
              background:
                'linear-gradient(to right, #0f0f0f 40%, #0f0f0fdd 55%, transparent 70%)',
            }}
          />

          {/* Content */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '680px',
              height: HEIGHT,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              padding: '60px',
            }}
          >
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
              <LogoText />
              <FiveStars />
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                marginTop: '20px',
              }}
            >
              <div
                style={{
                  fontSize: title.length > 40 ? 46 : 54,
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
                  fontSize: 22,
                  color: '#9ca3af',
                  fontFamily: 'Getai Grotesk Display',
                }}
              >
                {subtitle}
              </div>
            </div>

            {/* Bottom accent bar */}
            <div
              style={{
                position: 'absolute',
                bottom: '48px',
                left: '60px',
                width: '540px',
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
        fonts: [
          {
            name: 'Getai Grotesk Display',
            data: fontData,
            style: 'normal',
            weight: 900,
          },
        ],
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
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0a0a0a, #171717)',
          position: 'relative',
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
          <LogoText />
          <FiveStars />
        </div>

        {/* Title + subtitle */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            padding: '0 60px',
          }}
        >
          <div
            style={{
              fontSize: title.length > 40 ? 52 : 60,
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
              fontSize: 24,
              color: '#9ca3af',
              fontFamily: 'Getai Grotesk Display',
            }}
          >
            {subtitle}
          </div>
        </div>

        {/* Bottom accent bar */}
        <div
          style={{
            position: 'absolute',
            bottom: '48px',
            left: '60px',
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
      fonts: [
        {
          name: 'Getai Grotesk Display',
          data: fontData,
          style: 'normal',
          weight: 900,
        },
      ],
      headers: {
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    }
  )
}
