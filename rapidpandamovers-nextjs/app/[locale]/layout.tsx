import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { getaiGrotesk } from '@/app/fonts'
import Header from '@/app/components/Header'
import Footer from '@/app/components/Footer'
import { SITE_CONFIG, getSiteUrl } from '@/lib/metadata'
import { translatePathname } from '@/i18n/slug-map'
import { defaultLocale, type Locale } from '@/i18n/config'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const messages = await getMessages()
  const meta = (messages as any).meta

  const site = meta.site
  const ogLocale = locale === 'es' ? 'es_US' : 'en_US'
  const siteUrl = getSiteUrl()
  const canonicalUrl = locale === defaultLocale
    ? siteUrl
    : `${siteUrl}/${locale}`

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: site.defaultTitle,
      template: site.titleTemplate,
    },
    description: site.description,
    keywords: site.keywords,
    authors: [{ name: SITE_CONFIG.name }],
    creator: SITE_CONFIG.name,
    publisher: SITE_CONFIG.name,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    icons: {
      icon: [
        { url: '/favicon.svg', type: 'image/svg+xml' },
        { url: '/favicon.ico', sizes: '16x16 32x32' },
      ],
      apple: [
        { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
      ],
    },
    manifest: '/site.webmanifest',
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'x-default': siteUrl,
        en: siteUrl,
        es: `${siteUrl}/es`,
      },
    },
    openGraph: {
      type: 'website',
      locale: ogLocale,
      url: canonicalUrl,
      siteName: SITE_CONFIG.name,
      title: site.defaultTitle,
      description: site.ogDescription,
      images: [
        {
          url: SITE_CONFIG.defaultImage,
          width: 1200,
          height: 630,
          alt: `${SITE_CONFIG.name} - Professional Moving Services`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: site.defaultTitle,
      description: site.ogDescription,
      images: [SITE_CONFIG.defaultImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
}

// Structured data for LocalBusiness
function getStructuredData(locale: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${SITE_CONFIG.domain}/#organization`,
    name: SITE_CONFIG.name,
    image: `${SITE_CONFIG.domain}/images/rapidpandamovers-logo.png`,
    logo: `${SITE_CONFIG.domain}/images/rapidpandamovers-logo.png`,
    description: 'Professional moving services in Miami. Local and long-distance moving, packing, storage solutions.',
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
      {
        '@type': 'City',
        name: 'Miami',
      },
      {
        '@type': 'AdministrativeArea',
        name: 'Miami-Dade County',
      },
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
    sameAs: [
      'https://www.facebook.com/rapidpandamovers',
      'https://www.instagram.com/rapidpandamovers',
      'https://www.yelp.com/biz/rapid-panda-movers-miami',
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.7',
      reviewCount: '56',
      bestRating: '5',
      worstRating: '1',
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Moving Services',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Local Moving',
            description: 'Professional local moving services within Miami-Dade County',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Long Distance Moving',
            description: 'Interstate and cross-country moving services',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Packing Services',
            description: 'Professional packing and unpacking services',
          },
        },
      ],
    },
  }
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  // Validate locale
  if (!routing.locales.includes(locale as typeof routing.locales[number])) {
    notFound()
  }

  const messages = await getMessages()
  const structuredData = getStructuredData(locale)

  return (
    <html lang={locale} className={`${getaiGrotesk.variable}`}>
      <head>
        <meta name="theme-color" content="#f97316" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      </head>
      <body className="bg-white text-slate-900 font-sans antialiased min-h-screen flex flex-col">
        <NextIntlClientProvider messages={messages}>
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
