import type { Metadata } from 'next'

// Site configuration constants
export const SITE_CONFIG = {
  name: 'Rapid Panda Movers',
  domain: 'https://www.rapidpandamovers.com',
  defaultImage: 'https://www.rapidpandamovers.com/images/rapidpandamovers-og.jpg',
  phone: '(786) 585-4269',
  email: 'info@rapidpandamovers.com',
  address: {
    street: '1000 Brickell Ave',
    city: 'Miami',
    state: 'FL',
    zip: '33131',
  },
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
  } = options

  const canonicalUrl = getCanonicalUrl(path)

  const metadata: Metadata = {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: SITE_CONFIG.name,
      type,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
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
export function generateServiceMetadata(service: Service, location?: Location): Metadata {
  const locationName = location?.name
  const parentCityName = location?.parentCity?.name

  // Build location string
  const locationStr = locationName
    ? parentCityName
      ? `${locationName}, ${parentCityName}`
      : locationName
    : 'Miami'

  const title = location
    ? `${locationName} ${service.name} | ${SITE_CONFIG.name}`
    : service.meta_title || `${service.name} in Miami | ${SITE_CONFIG.name}`

  const description = location
    ? `Professional ${service.name.toLowerCase()} services in ${locationStr}. Experienced crews, transparent pricing, and reliable service. Get your free quote today!`
    : service.meta_description || `${service.description.slice(0, 150)}...`

  const path = location
    ? `/${location.slug}-${service.slug}`
    : `/${service.slug}`

  return generatePageMetadata({
    title,
    description,
    path,
  })
}

/**
 * Generate metadata for location pages (cities and neighborhoods)
 */
export function generateLocationMetadata(location: Location): Metadata {
  const isNeighborhood = !!location.parentCity
  const locationStr = isNeighborhood
    ? `${location.name}, ${location.parentCity!.name}`
    : location.name

  const title = `${location.name} Movers | Moving Services in ${locationStr} | ${SITE_CONFIG.name}`

  const description = isNeighborhood
    ? `Professional moving services in ${location.name}, ${location.parentCity!.name}. Local movers you can trust with experienced crews and transparent pricing.`
    : `Professional moving services in ${location.name}. Expert local and long-distance moving with experienced crews and transparent pricing. Get your free quote!`

  const path = `/${location.slug}-movers`

  return generatePageMetadata({
    title,
    description,
    path,
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
export function generateRouteMetadata(route: Route): Metadata {
  const origin = titleCase(route.origin_name)
  const destination = titleCase(route.destination_name)

  const title = `${origin} to ${destination} Movers | ${SITE_CONFIG.name}`
  const description = `Professional moving services from ${origin} to ${destination}. ${route.distance_mi} miles, experienced crews, competitive rates. Get your free moving quote today!`
  const path = `/${route.slug}-movers`

  return generatePageMetadata({
    title,
    description,
    path,
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
export function generateBlogMetadata(post: BlogPost): Metadata {
  const title = `${post.title} | ${SITE_CONFIG.name} Blog`
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
  })
}
