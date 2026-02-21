import type { Metadata } from 'next'
import { locales, defaultLocale, type Locale } from '@/i18n/config'
import { getTranslatedSlug, translatePathname } from '@/i18n/slug-map'
import metadataEn from '@/data/metadata.json'
import metadataEs from '@/data/es/metadata.json'

// Site configuration constants (non-translatable)
export const SITE_CONFIG = {
  name: 'Rapid Panda Movers',
  domain: 'https://www.rapidpandamovers.com',
  defaultImage: 'https://www.rapidpandamovers.com/images/rapidpandamovers-og.jpg',
  phone: '(786) 585-4269',
  email: 'info@rapidpandamovers.com',
  address: {
    street: '7001 North Waterway Dr #107',
    city: 'Miami',
    state: 'FL',
    zip: '33155',
  },
}

/**
 * Get locale-specific metadata config
 */
function getMetadataConfig(locale?: Locale) {
  return locale === 'es' ? metadataEs : metadataEn
}

/**
 * Interpolate template variables: {varName} → value
 */
function interpolate(template: string, vars: Record<string, string>): string {
  return Object.entries(vars).reduce(
    (str, [key, val]) => str.replace(new RegExp(`\\{${key}\\}`, 'g'), val),
    template
  )
}

interface MetadataOptions {
  title: string
  description: string
  path?: string
  image?: string
  type?: 'website' | 'article'
  publishedTime?: string
  modifiedTime?: string
  noIndex?: boolean
  locale?: Locale
}

/**
 * Build hreflang alternates for a given English path
 */
function buildAlternates(enPath: string): Record<string, string> {
  const languages: Record<string, string> = {
    'x-default': `${SITE_CONFIG.domain}${enPath}`,
    en: `${SITE_CONFIG.domain}${enPath}`,
  }
  for (const loc of locales) {
    if (loc === defaultLocale) continue
    const translatedPath = translatePathname(enPath, 'en', loc)
    languages[loc] = `${SITE_CONFIG.domain}/${loc}${translatedPath}`
  }
  return languages
}

/**
 * Get canonical URL for a path
 */
export function getCanonicalUrl(path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  return `${SITE_CONFIG.domain}${cleanPath}`
}

/**
 * Generate consistent metadata for any page
 */
export function generatePageMetadata(options: MetadataOptions): Metadata {
  const {
    title,
    description,
    path = '',
    image = SITE_CONFIG.defaultImage,
    type = 'website',
    publishedTime,
    modifiedTime,
    noIndex = false,
    locale,
  } = options

  // For non-default locale, build the localized canonical URL
  const enPath = path.startsWith('/') ? path : `/${path}`
  const canonicalUrl = locale && locale !== defaultLocale
    ? `${SITE_CONFIG.domain}/${locale}${translatePathname(enPath, 'en', locale)}`
    : getCanonicalUrl(path)

  const ogLocale = locale === 'es' ? 'es_US' : 'en_US'

  const metadata: Metadata = {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: buildAlternates(enPath),
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: SITE_CONFIG.name,
      locale: ogLocale,
      type,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: typeof title === 'string' ? title : SITE_CONFIG.name,
        },
      ],
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  }

  if (noIndex) {
    metadata.robots = {
      index: false,
      follow: false,
    }
  }

  return metadata
}

interface Service {
  name: string
  slug: string
  description: string
  meta_title?: string
  meta_description?: string
}

interface Location {
  name: string
  slug: string
  description?: string
  parentCity?: {
    name: string
    slug: string
  }
}

/**
 * Generate metadata for service pages
 */
export function generateServiceMetadata(service: Service, location?: Location, locale?: Locale): Metadata {
  const config = getMetadataConfig(locale)
  const templates = config.templates.service
  const locationName = location?.name
  const parentCityName = location?.parentCity?.name

  const locationStr = locationName
    ? parentCityName
      ? `${locationName}, ${parentCityName}`
      : locationName
    : 'Miami'

  const title = location
    ? interpolate(templates.titleWithLocation, { locationName: locationName!, serviceName: service.name })
    : service.meta_title || interpolate(templates.title, { serviceName: service.name })

  const description = location
    ? interpolate(templates.description, { serviceName: service.name.toLowerCase(), locationStr })
    : service.meta_description || interpolate(templates.descriptionDefault, { serviceDescription: service.description.slice(0, 150) + '...' })

  const path = location
    ? `/${location.slug}-${service.slug}`
    : `/${service.slug}`

  return generatePageMetadata({
    title,
    description,
    path,
    locale,
  })
}

/**
 * Generate metadata for location pages (cities and neighborhoods)
 */
export function generateLocationMetadata(location: Location, locale?: Locale): Metadata {
  const config = getMetadataConfig(locale)
  const templates = config.templates.location
  const isNeighborhood = !!location.parentCity
  const locationStr = isNeighborhood
    ? `${location.name}, ${location.parentCity!.name}`
    : location.name

  const title = interpolate(templates.title, {
    locationName: location.name,
    locationStr,
  })

  const description = isNeighborhood
    ? interpolate(templates.descriptionNeighborhood, {
        locationName: location.name,
        parentCity: location.parentCity!.name,
      })
    : interpolate(templates.descriptionCity, {
        locationName: location.name,
      })

  const path = `/${location.slug}-movers`

  return generatePageMetadata({
    title,
    description,
    path,
    locale,
  })
}

interface Route {
  origin_name: string
  destination_name: string
  slug: string
  distance_mi: number
}

/**
 * Title case a slug (e.g., "miami-beach" -> "Miami Beach")
 * Handles state abbreviations (e.g., "atlanta-ga" -> "Atlanta, GA")
 */
function titleCase(s: string): string {
  const parts = s.split('-')
  const lastPart = parts[parts.length - 1]

  if (lastPart.length === 2 && /^[a-z]{2}$/i.test(lastPart)) {
    const cityParts = parts.slice(0, -1)
    const cityName = cityParts.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ')
    return `${cityName}, ${lastPart.toUpperCase()}`
  }

  return s.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

/**
 * Generate metadata for route pages
 */
export function generateRouteMetadata(route: Route, locale?: Locale): Metadata {
  const config = getMetadataConfig(locale)
  const templates = config.templates.route
  const origin = titleCase(route.origin_name)
  const destination = titleCase(route.destination_name)

  const title = interpolate(templates.title, { origin, destination })
  const description = interpolate(templates.description, {
    origin,
    destination,
    distance: String(route.distance_mi),
  })
  const path = `/${route.slug}-movers`

  return generatePageMetadata({
    title,
    description,
    path,
    locale,
  })
}

interface BlogPost {
  title: string
  slug: string
  excerpt: string
  date: string
  updated?: string
  category: string
  featured?: string | null
}

/**
 * Generate metadata for blog posts
 */
export function generateBlogMetadata(post: BlogPost, locale?: Locale): Metadata {
  const config = getMetadataConfig(locale)
  const title = `${post.title}${config.templates.blogPost.titleSuffix}`
  const description = post.excerpt
  const path = `/blog/${post.slug}`
  const image = post.featured || SITE_CONFIG.defaultImage

  return generatePageMetadata({
    title,
    description,
    path,
    image,
    type: 'article',
    publishedTime: post.date,
    modifiedTime: post.updated || post.date,
    locale,
  })
}
