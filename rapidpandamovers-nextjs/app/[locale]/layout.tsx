import type { Metadata } from 'next'
import Script from 'next/script'
import { notFound } from 'next/navigation'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { getaiGrotesk } from '@/app/fonts'
import Header from '@/app/components/Header'
import Footer from '@/app/components/Footer'
import { SITE_CONFIG, getSiteUrl } from '@/lib/metadata'
import { generateMovingCompanySchema } from '@/lib/schema'
import { defaultLocale, type Locale } from '@/i18n/config'
import reviewsData from '@/data/reviews.json'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const messages = await getMessages()
  const meta = (messages as any).meta

  const site = meta.site
  const ogDescription = site.ogDescription
    .replace(/\{rating\}/g, String(reviewsData.stats.averageRating))
    .replace(/\{reviewCount\}/g, String(reviewsData.stats.totalReviews))
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
      description: ogDescription,
      images: [
        {
          url: SITE_CONFIG.defaultImage,
          width: 1200,
          height: 630,
          alt: 'Rapid Panda Movers - trusted family-owned moving company serving Miami-Dade County, Florida',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: site.defaultTitle,
      description: ogDescription,
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
  // Exclude meta (server-only) and content (67KB) from the layout-level client provider.
  // Keep only content.site (~200B) since it's needed by many client components (Hero, FAQSection, etc).
  // Pages that need additional content keys use nested NextIntlClientProvider.
  const { meta, content, ...clientMessages } = messages as Record<string, any>
  clientMessages.content = { site: content.site }
  const structuredData = generateMovingCompanySchema(locale)

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
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:bg-orange-700 focus:text-white focus:px-4 focus:py-2 focus:top-2 focus:left-2 focus:rounded">
          Skip to content
        </a>
        <NextIntlClientProvider messages={clientMessages}>
          <Header />
          <main id="main-content" className="flex-grow">
            {children}
          </main>
          <Footer />
        </NextIntlClientProvider>
        <Script
          src="/api/script.js"
          data-site-id="306cc99bf49e"
          strategy="afterInteractive"
        />
      </body>
    </html>
  )
}
