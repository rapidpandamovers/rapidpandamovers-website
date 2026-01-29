import Link from 'next/link'
import { Phone, Mail } from 'lucide-react'
import { getAllActiveCities, getAllActiveServices } from '@/lib/data'

export default function Header() {
  const cities = getAllActiveCities()
  const services = getAllActiveServices()
  return (
    <>
          
      {/* Main Header */}
      <header className="bg-white text-sm font-bold">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center space-x-3">
              <img 
                src="/images/rapidpandamovers-logo.png" 
                alt="Rapid Panda Movers" 
                className="h-16 w-auto"
              />
            </Link>
            
            <nav className="hidden lg:flex items-center space-x-6">
              <Link href="/" className="text-gray-700 hover:text-orange-500 transition-colors uppercase">
                Home
              </Link>
              <Link href="/rates" className="text-gray-700 hover:text-orange-500 transition-colors uppercase">
                Rates
              </Link>
              <div className="relative group">
                <button className="text-gray-700 hover:text-orange-500 transition-colors flex items-center uppercase">
                  Services
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="absolute left-0 mt-2 w-180 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="py-2">
                    <Link href="/services" className="block px-4 py-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors border-b border-gray-100">
                      <div className="font-medium">All Services</div>
                      <div className="text-sm text-gray-500 font-normal">Complete service overview</div>
                    </Link>
                    <div className="grid grid-cols-3 gap-0 px-2 py-2">
                      {services.map((service) => (
                        <Link key={service.slug} href={`/${service.slug}`} className="block px-2 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors rounded">
                          <div className="font-medium text-sm">{service.name}</div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative group">
                <button className="text-gray-700 hover:text-orange-500 transition-colors flex items-center uppercase">
                  Locations
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="absolute left-0 mt-2 w-180 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="py-2">
                    <Link href="/locations" className="block px-4 py-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors border-b border-gray-100">
                      <div className="font-medium">All Locations</div>
                      <div className="text-sm text-gray-500">Complete location overview</div>
                    </Link>
                    <div className="grid grid-cols-3 gap-0 px-2 py-2">
                      {cities.map((city) => (
                        <Link key={city.slug} href={`/${city.slug}-movers`} className="block px-2 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors rounded">
                          <div className="font-medium text-sm">{city.name} Movers</div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative group">
                <button className="text-gray-700 hover:text-orange-500 transition-colors flex items-center uppercase">
                  Resources
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="absolute left-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="py-2">
                    <Link href="/faq" className="block px-4 py-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors border-b border-gray-100">
                      <div className="font-medium">FAQ</div>
                      <div className="text-sm text-gray-500">Common questions</div>
                    </Link>
                    <Link href="/moving-tips" className="block px-4 py-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors">
                      <div className="font-medium">Moving Tips</div>
                      <div className="text-sm text-gray-500">Expert advice</div>
                    </Link>
                    <Link href="/moving-checklist" className="block px-4 py-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors">
                      <div className="font-medium">Moving Checklist</div>
                      <div className="text-sm text-gray-500">Complete checklist</div>
                    </Link>
                    <Link href="/moving-glossary" className="block px-4 py-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors">
                      <div className="font-medium">Moving Glossary</div>
                      <div className="text-sm text-gray-500">Common moving terms</div>
                    </Link>
                  </div>
                </div>
              </div>
              <div className="relative group">
                <button className="text-gray-700 hover:text-orange-500 transition-colors flex items-center uppercase">
                  Company
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="absolute left-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="py-2">
                    <Link href="/about" className="block px-4 py-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors border-b border-gray-100">
                      <div className="font-medium">About Us</div>
                      <div className="text-sm text-gray-500">About Rapid Panda Movers</div>
                    </Link>
                    <Link href="/blog" className="block px-4 py-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors">
                      <div className="font-medium">Blog</div>
                      <div className="text-sm text-gray-500">Expert advice</div>
                    </Link>
                    <Link href="/reviews" className="block px-4 py-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors">
                      <div className="font-medium">Reviews</div>
                      <div className="text-sm text-gray-500">Real reviews</div>
                    </Link>
                    <Link href="/reservations" className="block px-4 py-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors">
                      <div className="font-medium">Reservations</div>
                      <div className="text-sm text-gray-500">Book your move</div>
                    </Link>
                    <Link href="/contact" className="block px-4 py-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors">
                      <div className="font-medium">Contact Us</div>
                      <div className="text-sm text-gray-500">Get a free quote</div>
                    </Link>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <a href="tel:+13055551234" className="flex items-center space-x-2 border border-orange-500 text-orange-500 hover:bg-orange-50 font-semibold py-3 px-6 rounded-lg transition-colors">
                  <Phone className="w-4 h-4" />
                  <span>(305) 555-1234</span>
                </a>
                <Link href="/quote" className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
                  Get Free Quote
                </Link>
              </div>
            </nav>
            
            {/* Mobile menu button */}
            <button className="md:hidden p-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>
    </>
  )
}