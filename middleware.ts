import createMiddleware from 'next-intl/middleware'
import { NextRequest, NextResponse } from 'next/server'
import { routing } from './i18n/routing'
import { staticPathTranslations } from './i18n/routing'

// Build reverse lookup: { es: { 'sobre-nosotros': 'about-us', ... } }
const reverseStaticPaths: Record<string, Record<string, string>> = {}
for (const [locale, translations] of Object.entries(staticPathTranslations)) {
  reverseStaticPaths[locale] = {}
  for (const [en, translated] of Object.entries(translations)) {
    reverseStaticPaths[locale][translated] = en
  }
}

const intlMiddleware = createMiddleware(routing)

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if pathname matches /{locale}/{translatedStaticPath}
  // Rewrite to /{locale}/{englishPath} so it matches the filesystem,
  // then let intl middleware handle locale negotiation.
  for (const [locale, reversePaths] of Object.entries(reverseStaticPaths)) {
    const prefix = `/${locale}/`
    if (pathname.startsWith(prefix)) {
      let newPathname = pathname

      // 1. Translate first path segment (static page slugs)
      const rest = newPathname.slice(prefix.length)
      const firstSegment = rest.split('/')[0]
      if (reversePaths[firstSegment]) {
        const englishSegment = reversePaths[firstSegment]
        const remainingPath = rest.slice(firstSegment.length)
        newPathname = `${prefix}${englishSegment}${remainingPath}`
      }

      // 2. Translate nested path segments (e.g., "pagina" → "page", "ubicacion" → "location")
      const nestedSegments = ['pagina', 'ubicacion', 'servicio', 'categoria']
      for (const seg of nestedSegments) {
        if (reversePaths[seg]) {
          newPathname = newPathname.replace(`/${seg}/`, `/${reversePaths[seg]}/`)
        }
      }

      // Only rewrite if something changed
      if (newPathname !== pathname) {
        const response = intlMiddleware(request)
        const rewriteUrl = request.nextUrl.clone()
        rewriteUrl.pathname = newPathname
        return NextResponse.rewrite(rewriteUrl, {
          headers: response.headers,
        })
      }

      break
    }
  }

  return intlMiddleware(request)
}

export const config = {
  matcher: [
    // Match all pathnames except:
    // - /api (API routes)
    // - /_next (Next.js internals)
    // - /_vercel (Vercel internals)
    // - /images, /videos, /fonts (static files in public/)
    // - files with extensions (e.g., favicon.ico, robots.txt)
    '/((?!api|_next|_vercel|images|videos|fonts|.*\\..*).*)',
  ],
}
