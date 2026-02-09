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
export function generateFAQSchema(faqs: FAQ[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
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
}

/**
 * Generate Service schema
 */
export function generateServiceSchema(options: ServiceSchemaOptions) {
  const { name, description, url, areaServed = 'Miami-Dade County, FL', provider = SITE_CONFIG.name } = options

  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    url: `${SITE_CONFIG.domain}${url}`,
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
  } = options

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    image,
    url: `${SITE_CONFIG.domain}${url}`,
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
}

/**
 * Generate MovingCompany + Route schema for route pages
 */
export function generateRouteSchema(options: MovingServiceSchemaOptions) {
  const { originCity, destinationCity, distance, url } = options

  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: `${originCity} to ${destinationCity} Moving Service`,
    description: `Professional moving services from ${originCity} to ${destinationCity}, ${distance} miles.`,
    url: `${SITE_CONFIG.domain}${url}`,
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
