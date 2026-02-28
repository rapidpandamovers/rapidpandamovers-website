import type { Locale } from './config'
import { staticPathTranslations } from './routing'
import enBlogIndex from '@/content/blog/en/index.json'
import esBlogIndex from '@/content/blog/es/index.json'

/**
 * Bidirectional slug translation for dynamic and static routes.
 * Handles: services, cities, neighborhoods, routes, location-service combos,
 * and static page slugs (from staticPathTranslations).
 */

// Service slug translations (keys must match slugs in data/services.json)
const serviceSlugMap: Record<string, Record<string, string>> = {
  es: {
    'packing-services': 'servicios-de-empaque',
    'local-moving': 'mudanza-local',
    'long-distance-moving': 'mudanza-de-larga-distancia',
    'residential-moving': 'mudanza-residencial',
    'commercial-moving': 'mudanza-comercial',
    'furniture-moving': 'mudanza-de-muebles',
    'celebrity-moving': 'mudanza-de-celebridades',
    'apartment-moving': 'mudanza-de-apartamentos',
    'full-service-moving': 'mudanza-de-servicio-completo',
    'labor-only-moving': 'mudanza-solo-mano-de-obra',
    'military-moving': 'mudanza-militar',
    'same-day-moving': 'mudanza-del-mismo-dia',
    'senior-moving': 'mudanza-para-personas-mayores',
    'student-moving': 'mudanza-estudiantil',
    'safe-moving': 'mudanza-de-cajas-fuertes',
    'antique-moving': 'mudanza-de-antiguedades',
    'office-moving': 'mudanza-de-oficinas',
    'same-building-moving': 'mudanza-dentro-del-mismo-edificio',
    'last-minute-moving': 'mudanza-de-ultimo-momento',
    'hourly-moving': 'mudanza-por-hora',
    'special-needs-moving': 'mudanza-para-necesidades-especiales',
    'appliance-moving': 'mudanza-de-electrodomesticos',
    'piano-moving': 'mudanza-de-pianos',
    'pool-table-moving': 'mudanza-de-mesas-de-billar',
    'hot-tub-moving': 'mudanza-de-jacuzzis',
    'art-moving': 'mudanza-de-arte',
    'white-glove-moving': 'mudanza-de-guante-blanco',
    'specialty-item-moving': 'mudanza-de-articulos-especiales',
    'storage-solutions': 'soluciones-de-almacenamiento',
    'junk-removal': 'retiro-de-basura',
  },
}

// Blog slug translation maps (built from index.json files)
// Maps: en-slug → es-slug and es-slug → en-slug
const blogSlugMap: Record<string, Record<string, string>> = { en: {}, es: {} }
const enById = new Map(enBlogIndex.map((p: { id: number; slug: string }) => [p.id, p.slug]))
const esById = new Map(esBlogIndex.map((p: { id: number; slug: string }) => [p.id, p.slug]))
for (const [id, enSlug] of enById) {
  const esSlug = esById.get(id)
  if (esSlug) {
    blogSlugMap.en[enSlug] = esSlug  // en→es
    blogSlugMap.es[esSlug] = enSlug  // es→en
  }
}

// Reverse lookup cache
const reverseServiceSlugMap: Record<string, Record<string, string>> = {}

function getReverseServiceMap(locale: string): Record<string, string> {
  if (!reverseServiceSlugMap[locale]) {
    reverseServiceSlugMap[locale] = {}
    const map = serviceSlugMap[locale]
    if (map) {
      for (const [en, localized] of Object.entries(map)) {
        reverseServiceSlugMap[locale][localized] = en
      }
    }
  }
  return reverseServiceSlugMap[locale] || {}
}

// Reverse static path lookup cache: { es: { 'sobre-nosotros': 'about-us', ... } }
const reverseStaticPathMap: Record<string, Record<string, string>> = {}

function getReverseStaticPathMap(locale: string): Record<string, string> {
  if (!reverseStaticPathMap[locale]) {
    reverseStaticPathMap[locale] = {}
    const map = staticPathTranslations[locale]
    if (map) {
      for (const [en, localized] of Object.entries(map)) {
        reverseStaticPathMap[locale][localized] = en
      }
    }
  }
  return reverseStaticPathMap[locale] || {}
}

/**
 * Translate a route slug between locales.
 * Route slugs follow pattern: "origin-to-destination" in English,
 * "origin-a-destination" in Spanish.
 * City/location suffixes: "-movers" in English, "mudanzas-" prefix in Spanish.
 */
function translateRouteSlug(slug: string, fromLocale: Locale, toLocale: Locale): string | null {
  if (fromLocale === toLocale) return slug

  if (fromLocale === 'en' && toLocale === 'es') {
    // "miami-to-orlando" → "miami-a-orlando"
    const toMatch = slug.match(/^(.+)-to-(.+)$/)
    if (toMatch) {
      return `${toMatch[1]}-a-${toMatch[2]}`
    }
    return null
  }

  if (fromLocale === 'es' && toLocale === 'en') {
    // "miami-a-orlando" → "miami-to-orlando"
    const aMatch = slug.match(/^(.+)-a-(.+)$/)
    if (aMatch) {
      return `${aMatch[1]}-to-${aMatch[2]}`
    }
    return null
  }

  return null
}

/**
 * Translate a city/neighborhood slug with -movers suffix.
 * English: "miami-movers", Spanish: "mudanzas-miami"
 */
function translateLocationSlug(slug: string, fromLocale: Locale, toLocale: Locale): string | null {
  if (fromLocale === toLocale) return slug

  if (fromLocale === 'en' && toLocale === 'es') {
    // "miami-movers" → "mudanzas-miami"
    if (slug.endsWith('-movers')) {
      const base = slug.replace(/-movers$/, '')
      return `mudanzas-${base}`
    }
    return null
  }

  if (fromLocale === 'es' && toLocale === 'en') {
    // "mudanzas-miami" → "miami-movers"
    if (slug.startsWith('mudanzas-')) {
      const base = slug.replace(/^mudanzas-/, '')
      return `${base}-movers`
    }
    return null
  }

  return null
}

/**
 * Get the English (canonical) slug from any locale's slug.
 * Used for data lookups — all data is keyed by English slugs.
 */
export function getCanonicalSlug(translatedSlug: string, locale: Locale): string {
  if (locale === 'en') return translatedSlug

  // Check service slugs
  const reverseServices = getReverseServiceMap(locale)
  if (reverseServices[translatedSlug]) {
    return reverseServices[translatedSlug]
  }

  // Check route slugs (e.g., "miami-a-orlando-movers" → needs both route + location translation)
  // First strip mudanzas- prefix if present and handle route pattern
  if (translatedSlug.startsWith('mudanzas-')) {
    const withoutPrefix = translatedSlug.replace(/^mudanzas-/, '')
    // Check if it's a route: "miami-a-orlando" pattern
    const routeSlug = translateRouteSlug(withoutPrefix, locale, 'en')
    if (routeSlug) {
      return `${routeSlug}-movers`
    }
    // Otherwise it's a location: "mudanzas-miami" → "miami-movers"
    return `${withoutPrefix}-movers`
  }

  // Check route pattern without movers suffix
  const routeSlug = translateRouteSlug(translatedSlug, locale, 'en')
  if (routeSlug) return routeSlug

  // Check location-service combos (e.g., "miami-mudanzas-locales" → "miami-local-moving")
  for (const [localizedService, enService] of Object.entries(reverseServices)) {
    if (translatedSlug.endsWith(`-${localizedService}`)) {
      const locationPart = translatedSlug.slice(0, -(localizedService.length + 1))
      return `${locationPart}-${enService}`
    }
  }

  // Check static page paths (e.g., "sobre-nosotros" → "about-us")
  const reverseStatic = getReverseStaticPathMap(locale)
  if (reverseStatic[translatedSlug]) {
    return reverseStatic[translatedSlug]
  }

  // Fallback: return as-is
  return translatedSlug
}

/**
 * Get the translated slug for a given locale from an English slug.
 * Used for generating URLs in the target locale.
 */
export function getTranslatedSlug(canonicalSlug: string, locale: Locale): string {
  if (locale === 'en') return canonicalSlug

  const serviceMap = serviceSlugMap[locale]

  // Check service slugs
  if (serviceMap && serviceMap[canonicalSlug]) {
    return serviceMap[canonicalSlug]
  }

  // Check location slugs with -movers suffix
  if (canonicalSlug.endsWith('-movers')) {
    const base = canonicalSlug.replace(/-movers$/, '')
    // Check if it's a route: "miami-to-orlando" pattern
    const routeSlug = translateRouteSlug(base, 'en', locale)
    if (routeSlug) {
      return `mudanzas-${routeSlug}`
    }
    // Regular location
    return `mudanzas-${base}`
  }

  // Check route pattern without -movers suffix
  const routeSlug = translateRouteSlug(canonicalSlug, 'en', locale)
  if (routeSlug) return routeSlug

  // Check location-service combos (e.g., "miami-local-moving" → "miami-mudanzas-locales")
  if (serviceMap) {
    for (const [enService, localizedService] of Object.entries(serviceMap)) {
      if (canonicalSlug.endsWith(`-${enService}`)) {
        const locationPart = canonicalSlug.slice(0, -(enService.length + 1))
        return `${locationPart}-${localizedService}`
      }
    }
  }

  // Check static page paths (e.g., "services" → "servicios")
  const staticMap = staticPathTranslations[locale]
  if (staticMap && staticMap[canonicalSlug]) {
    return staticMap[canonicalSlug]
  }

  // Fallback: return as-is
  return canonicalSlug
}

/**
 * Translate a full pathname between locales.
 * Converts each segment from the source locale to English (canonical),
 * then from English to the target locale.
 * e.g. "/resenas/pagina/4" (es) → "/reviews/page/4" (en)
 * e.g. "/reviews/page/4" (en) → "/resenas/pagina/4" (es)
 */
export function translatePathname(pathname: string, fromLocale: Locale, toLocale: Locale): string {
  if (fromLocale === toLocale) return pathname

  const segments = pathname.split('/')
  // segments[0] is '' (leading slash), segments[1] is first path part, etc.

  // Handle blog post slugs: /blog/<post-slug> → look up translated slug
  if (segments[1] === 'blog' && segments.length >= 3 && segments[2]) {
    const postSlug = segments[2]
    const blogSubPaths = ['category', 'categoria', 'service', 'servicio', 'location', 'ubicacion', 'page', 'pagina']
    if (!blogSubPaths.includes(postSlug)) {
      const map = blogSlugMap[fromLocale]
      if (map && map[postSlug]) {
        return `/blog/${map[postSlug]}`
      }
    }
  }

  const translated = segments.map((segment, i) => {
    if (!segment || i === 0) return segment
    // Try to get canonical (English) slug first, then translate to target
    const canonical = getCanonicalSlug(segment, fromLocale)
    return getTranslatedSlug(canonical, toLocale)
  })

  return translated.join('/')
}

/**
 * Get all service slug translations for a locale (for generating static params).
 */
export function getServiceSlugTranslations(locale: Locale): Record<string, string> {
  return serviceSlugMap[locale] || {}
}
