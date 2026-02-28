import { SITE_CONFIG } from './metadata'

/**
 * Schema.org structured data utilities for SEO
 */

interface BreadcrumbItem {
  label: string
  href?: string
}

/**
 * Generate BreadcrumbList schema
 */
export function generateBreadcrumbSchema(items: BreadcrumbItem[], includeHome = true) {
  const breadcrumbItems = includeHome
    ? [{ label: 'Home', href: '/' }, ...items]
    : items

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbItems.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      ...(item.href && { item: `${SITE_CONFIG.domain}${item.href}` }),
    })),
  }
}

interface FAQ {
  question: string
  answer: string
}

/**
 * Generate FAQPage schema
 */
export function generateFAQSchema(faqs: FAQ[], locale?: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    inLanguage: locale === 'es' ? 'es' : 'en',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

interface ServiceSchemaOptions {
  name: string
  description: string
  url: string
  areaServed?: string
  provider?: string
  locale?: string
}

/**
 * Generate Service schema
 */
export function generateServiceSchema(options: ServiceSchemaOptions) {
  const { name, description, url, areaServed = 'Miami-Dade County, FL', provider = SITE_CONFIG.name, locale } = options

  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    url: `${SITE_CONFIG.domain}${url}`,
    inLanguage: locale === 'es' ? 'es' : 'en',
    provider: {
      '@type': 'LocalBusiness',
      name: provider,
      '@id': `${SITE_CONFIG.domain}/#organization`,
    },
    areaServed: {
      '@type': 'AdministrativeArea',
      name: areaServed,
    },
    serviceType: 'Moving Service',
  }
}

interface ArticleSchemaOptions {
  title: string
  description: string
  url: string
  image?: string
  datePublished: string
  dateModified?: string
  author?: string
  locale?: string
}

/**
 * Generate Article schema for blog posts
 */
export function generateArticleSchema(options: ArticleSchemaOptions) {
  const {
    title,
    description,
    url,
    image = SITE_CONFIG.defaultImage,
    datePublished,
    dateModified,
    author = SITE_CONFIG.name,
    locale,
  } = options

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    image,
    url: `${SITE_CONFIG.domain}${url}`,
    inLanguage: locale === 'es' ? 'es' : 'en',
    datePublished,
    dateModified: dateModified || datePublished,
    author: {
      '@type': 'Organization',
      name: author,
      url: SITE_CONFIG.domain,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_CONFIG.domain}/images/rapidpandamovers-logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_CONFIG.domain}${url}`,
    },
  }
}

/**
 * Generate Organization schema (supplementary to LocalBusiness in layout)
 */
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_CONFIG.domain}/#organization`,
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.domain,
    logo: `${SITE_CONFIG.domain}/images/rapidpandamovers-logo.png`,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: SITE_CONFIG.phone,
      contactType: 'customer service',
      areaServed: 'US',
      availableLanguage: ['English', 'Spanish'],
    },
    sameAs: [
      'https://www.facebook.com/rapidpandamovers',
      'https://www.instagram.com/rapidpandamovers',
      'https://www.yelp.com/biz/rapid-panda-movers-miami',
    ],
  }
}

interface MovingServiceSchemaOptions {
  originCity: string
  destinationCity: string
  distance: number
  url: string
  locale?: string
}

/**
 * Generate MovingCompany + Route schema for route pages
 */
export function generateRouteSchema(options: MovingServiceSchemaOptions) {
  const { originCity, destinationCity, distance, url, locale } = options

  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: `${originCity} to ${destinationCity} Moving Service`,
    description: `Professional moving services from ${originCity} to ${destinationCity}, ${distance} miles.`,
    url: `${SITE_CONFIG.domain}${url}`,
    inLanguage: locale === 'es' ? 'es' : 'en',
    provider: {
      '@type': 'MovingCompany',
      name: SITE_CONFIG.name,
      '@id': `${SITE_CONFIG.domain}/#organization`,
    },
    areaServed: [
      {
        '@type': 'City',
        name: originCity,
      },
      {
        '@type': 'City',
        name: destinationCity,
      },
    ],
    serviceType: 'Long Distance Moving',
  }
}

interface ReviewSchemaOptions {
  ratingValue: string
  reviewCount: string
  locale?: string
}

/**
 * Generate AggregateRating schema for reviews page
 */
export function generateReviewSchema(options: ReviewSchemaOptions) {
  const { ratingValue, reviewCount, locale } = options

  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${SITE_CONFIG.domain}/#organization`,
    name: SITE_CONFIG.name,
    inLanguage: locale === 'es' ? 'es' : 'en',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue,
      reviewCount,
      bestRating: '5',
      worstRating: '1',
    },
  }
}

interface VideoSchemaOptions {
  name: string
  description: string
  contentUrl: string
  thumbnailUrl: string
  uploadDate: string
  duration?: string
}

/**
 * Generate VideoObject schema for video rich results
 */
export function generateVideoSchema(videos: VideoSchemaOptions[]) {
  return videos.map(v => ({
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: v.name,
    description: v.description,
    contentUrl: `${SITE_CONFIG.domain}${v.contentUrl}`,
    thumbnailUrl: `${SITE_CONFIG.domain}${v.thumbnailUrl}`,
    uploadDate: v.uploadDate,
    ...(v.duration && { duration: v.duration }),
  }))
}

/**
 * Generate WebSite schema for homepage
 */
export function generateWebSiteSchema(locale?: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.domain,
    inLanguage: locale === 'es' ? 'es' : 'en',
    publisher: {
      '@type': 'Organization',
      '@id': `${SITE_CONFIG.domain}/#organization`,
      name: SITE_CONFIG.name,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_CONFIG.domain}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}
