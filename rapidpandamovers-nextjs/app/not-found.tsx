import Link from 'next/link'
import { H1, H2 } from '@/app/components/Heading'

/**
 * Root-level not-found fallback. This renders outside the [locale] layout
 * (e.g., for invalid locale prefixes), so it cannot use next-intl.
 * The locale-aware version with full components is at app/[locale]/not-found.tsx.
 */
export default function NotFound() {
  return (
    <html lang="en">
      <body className="bg-white text-slate-900 font-sans antialiased min-h-screen flex flex-col items-center justify-center">
        <div className="text-center px-4">
          <H1 className="text-6xl md:text-8xl font-bold text-orange-700 mb-4">404</H1>
          <H2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Page Not Found
          </H2>
          <p className="text-lg text-gray-600 max-w-xl mx-auto mb-8">
            Sorry, we couldn&apos;t find the page you&apos;re looking for. It may have been moved or no longer exists.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 bg-orange-700 text-white font-semibold rounded-lg hover:bg-orange-800 transition-colors"
            >
              Go Home
            </Link>
            <Link
              href="/contact-us"
              className="inline-flex items-center justify-center px-6 py-3 border border-orange-700 text-orange-700 font-semibold rounded-lg hover:bg-orange-50 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </body>
    </html>
  )
}
