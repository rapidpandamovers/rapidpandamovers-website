import type { Metadata } from 'next'
import './globals.css'
import { getaiGrotesk } from './fonts'
import Header from './components/Header'
import Footer from './components/Footer'

export const metadata: Metadata = {
  metadataBase: new URL('https://www.rapidpandamovers.com'),
  title: {
    default: 'Rapid Panda Movers - Professional Moving Services in Miami',
    template: '%s | Rapid Panda Movers',
  },
  description: 'Budget-friendly, reliable, and efficient moving services in Miami. Free quotes, transparent pricing, licensed & insured movers.',
  keywords: ['moving company Miami', 'movers Miami', 'local moving', 'long distance moving', 'packing services', 'Miami movers'],
  authors: [{ name: 'Rapid Panda Movers' }],
  creator: 'Rapid Panda Movers',
  publisher: 'Rapid Panda Movers',
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
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.rapidpandamovers.com',
    siteName: 'Rapid Panda Movers',
    title: 'Rapid Panda Movers - Professional Moving Services in Miami',
    description: 'Affordable, reliable moving services in Miami. Free quotes, transparent pricing, experienced crews. Licensed & insured.',
    images: [
      {
        url: 'https://www.rapidpandamovers.com/images/rapidpandamovers-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Rapid Panda Movers - Professional Moving Services',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rapid Panda Movers - Professional Moving Services in Miami',
    description: 'Affordable, reliable moving services in Miami. Free quotes, transparent pricing.',
    images: ['https://www.rapidpandamovers.com/images/rapidpandamovers-og.jpg'],
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
  verification: {
    // Add your verification codes here when available
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
  },
}

// Structured data for LocalBusiness
const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': 'https://www.rapidpandamovers.com/#organization',
  name: 'Rapid Panda Movers',
  image: 'https://www.rapidpandamovers.com/images/rapidpandamovers-logo.png',
  logo: 'https://www.rapidpandamovers.com/images/rapidpandamovers-logo.png',
  description: 'Professional moving services in Miami. Local and long-distance moving, packing, storage solutions.',
  url: 'https://www.rapidpandamovers.com',
  telephone: '(786) 585-4269',
  email: 'info@rapidpandamovers.com',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '1000 Brickell Ave',
    addressLocality: 'Miami',
    addressRegion: 'FL',
    postalCode: '33131',
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
      opens: '07:00',
      closes: '21:00',
    },
  ],
  sameAs: [
    'https://www.facebook.com/rapidpandamovers',
    'https://www.instagram.com/rapidpandamovers',
    'https://www.yelp.com/biz/rapid-panda-movers-miami',
  ],
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    reviewCount: '9568',
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${getaiGrotesk.variable}`}>
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
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
