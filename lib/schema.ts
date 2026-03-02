import { SITE_CONFIG } from './metadata'
import reviewsData from '@/data/reviews.json'
import services from '@/data/services.json'

/**
 * Schema.org structured data utilities for SEO
 */

interface NavLink {
  label: string
  href: string
}

interface NavSection {
  label: string
  items: NavLink[]
  bottomLink?: NavLink
}

interface NavigationData {
  header: {
    home: { label: string }
    services: { label: string }
    locations: { label: string }
    compare: NavSection
    resources: NavSection
    company: NavSection
  }
}

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
      ...(item.href && { item: item.href === '/' ? SITE_CONFIG.domain : `${SITE_CONFIG.domain}${item.href}` }),
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
export function generateFAQSchema(faqs: FAQ[], locale?: string, dateModified?: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    inLanguage: locale === 'es' ? 'es' : 'en',
    ...(dateModified && { dateModified }),
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
      '@type': 'MovingCompany',
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
    '@type': 'MovingCompany',
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
      'https://maps.app.goo.gl/PJdtBjVWTvLjMdo19',
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
    '@type': 'MovingCompany',
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

interface IndividualReview {
  author: string
  rating: number
  text: string
  date: string
  platform: string
}

const PLATFORM_NAMES: Record<string, string> = {
  google: 'Google',
  yelp: 'Yelp',
  facebook: 'Facebook',
  trustpilot: 'Trustpilot',
  bbb: 'Better Business Bureau',
}

/**
 * Generate individual Review schema objects for review rich snippets
 */
export function generateIndividualReviewsSchema(reviews: IndividualReview[]) {
  return reviews.map(r => ({
    '@type': 'Review',
    author: { '@type': 'Person', name: r.author },
    reviewRating: {
      '@type': 'Rating',
      ratingValue: String(r.rating),
      bestRating: '5',
      worstRating: '1',
    },
    reviewBody: r.text,
    datePublished: r.date,
    publisher: { '@type': 'Organization', name: PLATFORM_NAMES[r.platform] || r.platform },
    itemReviewed: {
      '@type': 'MovingCompany',
      '@id': `${SITE_CONFIG.domain}/#organization`,
      name: SITE_CONFIG.name,
    },
  }))
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
export function generateVideoSchema(videos: VideoSchemaOptions[], locale?: string) {
  return videos.map(v => ({
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: v.name,
    description: v.description,
    contentUrl: `${SITE_CONFIG.domain}${v.contentUrl}`,
    thumbnailUrl: `${SITE_CONFIG.domain}${v.thumbnailUrl}`,
    uploadDate: v.uploadDate,
    inLanguage: locale === 'es' ? 'es' : 'en',
    ...(v.duration && { duration: v.duration }),
    author: {
      '@type': 'Organization',
      '@id': `${SITE_CONFIG.domain}/#organization`,
      name: SITE_CONFIG.name,
    },
  }))
}

/**
 * Generate SiteNavigationElement schema
 */
export function generateNavigationSchema(nav: NavigationData, locale?: string) {
  const langPrefix = locale === 'es' ? '/es' : ''
  const makeUrl = (path: string) =>
    path === '/'
      ? `${SITE_CONFIG.domain}${langPrefix || '/'}`
      : `${SITE_CONFIG.domain}${langPrefix}${path}`

  const items: { name: string; url: string }[] = [
    { name: nav.header.home.label, url: '/' },
    { name: nav.header.services.label, url: '/services' },
    { name: nav.header.locations.label, url: '/locations' },
  ]

  // Compare dropdown items
  for (const item of nav.header.compare.items) {
    items.push({ name: item.label, url: item.href })
  }
  if (nav.header.compare.bottomLink) {
    items.push({ name: nav.header.compare.bottomLink.label, url: nav.header.compare.bottomLink.href })
  }

  // Resources dropdown items
  for (const item of nav.header.resources.items) {
    items.push({ name: item.label, url: item.href })
  }
  if (nav.header.resources.bottomLink) {
    items.push({ name: nav.header.resources.bottomLink.label, url: nav.header.resources.bottomLink.href })
  }

  // Company dropdown items
  for (const item of nav.header.company.items) {
    items.push({ name: item.label, url: item.href })
  }
  if (nav.header.company.bottomLink) {
    items.push({ name: nav.header.company.bottomLink.label, url: nav.header.company.bottomLink.href })
  }

  return {
    '@context': 'https://schema.org',
    '@graph': items.map(item => ({
      '@type': 'SiteNavigationElement',
      name: item.name,
      url: makeUrl(item.url),
    })),
  }
}

/**
 * Generate WebSite schema for homepage
 */
export function generateWebSiteSchema(locale?: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_CONFIG.domain}/#website`,
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.domain,
    inLanguage: locale === 'es' ? 'es' : 'en',
    about: {
      '@id': `${SITE_CONFIG.domain}/#organization`,
    },
    publisher: {
      '@type': 'MovingCompany',
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

interface WebPageSchemaOptions {
  name: string
  description: string
  path: string
  locale?: string
  datePublished?: string
  dateModified?: string
}

/**
 * Generate WebPage schema for the home page @graph
 */
export function generateWebPageSchema(options: WebPageSchemaOptions) {
  const { name, description, path, locale, datePublished, dateModified } = options
  const modified = dateModified || process.env.BUILD_DATE
  const pageUrl = path === '/' ? SITE_CONFIG.domain : `${SITE_CONFIG.domain}${path}`

  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${pageUrl}/#webpage`,
    name,
    description,
    url: pageUrl,
    inLanguage: locale === 'es' ? 'es' : 'en',
    ...(datePublished && { datePublished }),
    ...(modified && { dateModified: modified }),
    isPartOf: {
      '@id': `${SITE_CONFIG.domain}/#website`,
    },
    about: {
      '@id': `${SITE_CONFIG.domain}/#organization`,
    },
  }
}

interface HowToStep {
  title: string
  description: string
}

/**
 * Generate HowTo schema for moving process steps
 */
export function generateHowToSchema(name: string, description: string, steps: HowToStep[], locale?: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name,
    description,
    inLanguage: locale === 'es' ? 'es' : 'en',
    step: steps.map((s, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: s.title,
      text: s.description,
    })),
  }
}

/**
 * Generate MovingCompany schema (extracted from layout for reuse in home page @graph)
 */
export function generateMovingCompanySchema(locale: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'MovingCompany',
    '@id': `${SITE_CONFIG.domain}/#organization`,
    name: SITE_CONFIG.name,
    image: `${SITE_CONFIG.domain}/images/rapidpandamovers-logo.png`,
    logo: `${SITE_CONFIG.domain}/images/rapidpandamovers-logo.png`,
    description: `Family-owned Miami moving company providing affordable local and long-distance moving, professional packing, and storage solutions across Miami-Dade County. Licensed, insured, and rated ${reviewsData.stats.averageRating}/5 by ${reviewsData.stats.totalReviews}+ customers.`,
    url: SITE_CONFIG.domain,
    telephone: SITE_CONFIG.phone,
    email: SITE_CONFIG.email,
    inLanguage: locale === 'es' ? 'es' : 'en',
    address: {
      '@type': 'PostalAddress',
      streetAddress: SITE_CONFIG.address.street,
      addressLocality: SITE_CONFIG.address.city,
      addressRegion: SITE_CONFIG.address.state,
      postalCode: SITE_CONFIG.address.zip,
      addressCountry: 'US',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 25.7617,
      longitude: -80.1918,
    },
    areaServed: [
      { '@type': 'City', name: 'Miami' },
      { '@type': 'AdministrativeArea', name: 'Miami-Dade County' },
      { '@type': 'State', name: 'Florida' },
    ],
    priceRange: '$$',
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        opens: '08:00',
        closes: '20:00',
      },
    ],
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
      'https://maps.app.goo.gl/PJdtBjVWTvLjMdo19',
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: String(reviewsData.stats.averageRating),
      reviewCount: String(reviewsData.stats.totalReviews),
      bestRating: '5',
      worstRating: '1',
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Moving Services',
      itemListElement: services.map((s: any) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: s.name,
          description: s.description.slice(0, 160),
          url: `${SITE_CONFIG.domain}/${s.slug}`,
        },
      })),
    },
    potentialAction: {
      '@type': 'QuoteAction',
      name: locale === 'es' ? 'Solicitar cotización' : 'Request a quote',
      target: `${SITE_CONFIG.domain}/quote`,
    },
  }
}
