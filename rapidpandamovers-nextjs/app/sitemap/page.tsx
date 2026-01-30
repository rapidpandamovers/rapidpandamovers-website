import Link from 'next/link'
import { allCities, allRoutes, getServiceSlugs, getAllActiveServices, titleCase } from '@/lib/data'

export const metadata = {
  title: 'Sitemap | Rapid Panda Movers',
  description: 'Browse all pages on the Rapid Panda Movers website.',
}

export default function SitemapPage() {
  const services = getAllActiveServices()
  const allCitiesFlat = allCities.states.flatMap(state =>
    state.counties.flatMap(county => county.cities.filter(c => c.is_active))
  )
  const activeRoutes = allRoutes.filter(r => r.is_active !== false).slice(0, 50)

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-16 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Site<span className="text-orange-500">map</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Browse all pages on our website
            </p>
          </div>
        </div>
      </section>

      {/* Sitemap Content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 max-w-6xl mx-auto">

            {/* Main Pages */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b border-gray-200 pb-2">
                Main Pages
              </h2>
              <ul className="space-y-3">
                <li>
                  <Link href="/" className="text-gray-600 hover:text-orange-500 transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-gray-600 hover:text-orange-500 transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/services" className="text-gray-600 hover:text-orange-500 transition-colors">
                    Services
                  </Link>
                </li>
                <li>
                  <Link href="/locations" className="text-gray-600 hover:text-orange-500 transition-colors">
                    Locations
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-gray-600 hover:text-orange-500 transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-600 hover:text-orange-500 transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="text-gray-600 hover:text-orange-500 transition-colors">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/moving-rates" className="text-gray-600 hover:text-orange-500 transition-colors">
                    Rates
                  </Link>
                </li>
                <li>
                  <Link href="/reviews" className="text-gray-600 hover:text-orange-500 transition-colors">
                    Reviews
                  </Link>
                </li>
                <li>
                  <Link href="/reservations" className="text-gray-600 hover:text-orange-500 transition-colors">
                    Reservations
                  </Link>
                </li>
                <li>
                  <Link href="/moving-checklist" className="text-gray-600 hover:text-orange-500 transition-colors">
                    Moving Checklist
                  </Link>
                </li>
                <li>
                  <Link href="/moving-tips" className="text-gray-600 hover:text-orange-500 transition-colors">
                    Moving Tips
                  </Link>
                </li>
                <li>
                  <Link href="/moving-glossary" className="text-gray-600 hover:text-orange-500 transition-colors">
                    Moving Glossary
                  </Link>
                </li>
              </ul>
            </div>

            {/* Services */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b border-gray-200 pb-2">
                Services
              </h2>
              <ul className="space-y-3">
                {services.map((service) => (
                  <li key={service.slug}>
                    <Link
                      href={`/${service.slug}`}
                      className="text-gray-600 hover:text-orange-500 transition-colors"
                    >
                      {service.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Locations */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b border-gray-200 pb-2">
                Locations
              </h2>
              <ul className="space-y-3">
                {allCitiesFlat.slice(0, 20).map((city) => (
                  <li key={city.slug}>
                    <Link
                      href={`/${city.slug}-movers`}
                      className="text-gray-600 hover:text-orange-500 transition-colors"
                    >
                      {city.name} Movers
                    </Link>
                  </li>
                ))}
                {allCitiesFlat.length > 20 && (
                  <li>
                    <Link
                      href="/locations"
                      className="text-orange-500 hover:text-orange-600 font-medium transition-colors"
                    >
                      View all {allCitiesFlat.length} locations →
                    </Link>
                  </li>
                )}
              </ul>
            </div>

            {/* Moving Routes */}
            <div className="md:col-span-2 lg:col-span-3">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b border-gray-200 pb-2">
                Moving Routes
              </h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {activeRoutes.map((route) => (
                  <li key={route.slug}>
                    <Link
                      href={`/${route.slug}-movers`}
                      className="text-gray-600 hover:text-orange-500 transition-colors"
                    >
                      {titleCase(route.origin_name)} to {titleCase(route.destination_name)}
                    </Link>
                  </li>
                ))}
              </ul>
              {allRoutes.length > 50 && (
                <p className="mt-4 text-gray-500">
                  Showing 50 of {allRoutes.length} routes
                </p>
              )}
            </div>

            {/* Legal */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b border-gray-200 pb-2">
                Legal
              </h2>
              <ul className="space-y-3">
                <li>
                  <Link href="/privacy" className="text-gray-600 hover:text-orange-500 transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-gray-600 hover:text-orange-500 transition-colors">
                    Terms & Conditions
                  </Link>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </section>
    </div>
  )
}
