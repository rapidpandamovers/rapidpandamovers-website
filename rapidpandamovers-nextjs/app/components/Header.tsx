import Link from 'next/link'
import Image from 'next/image'
import { Phone } from 'lucide-react'
import { getAllActiveCities, getAllActiveServices } from '@/lib/data'
import content from '@/data/content.json'

export default function Header() {
  const cities = getAllActiveCities()
  const services = getAllActiveServices()
  const phone = content.site.phone
  const phoneFormatted = `(${phone.slice(0,3)}) ${phone.slice(4,7)}-${phone.slice(8)}`
  const phoneTel = phone.replace(/-/g, '')
  return (
    <>
          
      {/* Main Header */}
      <header className="bg-white text-sm font-bold">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center space-x-3">
              <Image
                src="/images/rapidpandamovers-logo.png"
                alt="Rapid Panda Movers"
                width={109}
                height={64}
                className="h-16 w-auto"
                priority
              />
            </Link>
            
            <nav className="hidden lg:flex items-center space-x-6">
              <Link href="/" className="text-gray-700 hover:text-orange-500 transition-colors uppercase">
                Home
              </Link>
              <div className="relative group">
                <button className="text-gray-700 hover:text-orange-500 transition-colors flex items-center uppercase">
                  Services
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="absolute left-0 mt-2 w-180 bg-orange-500 rounded-4xl overflow-hidden border-2 border-orange-500 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="bg-white rounded-b-4xl py-2">
                    <div className="grid grid-cols-3 gap-0 py-2">
                      {services.map((service) => (
                        <Link key={service.slug} href={`/${service.slug}`} className="block px-6 py-2 text-gray-700 hover:text-orange-600 hover:translate-x-1 transition-all duration-200 rounded">
                          <div className="font-medium text-sm">{service.name}</div>
                        </Link>
                      ))}
                    </div>
                  </div>
                  <Link href="/services" className="block px-6 pt-4 pb-5 text-white hover:text-white/80 hover:translate-x-1 transition-all duration-200">
                    <div className="font-medium">All Services &rarr;</div>
                    <div className="text-sm text-white/70 font-normal">Complete service overview</div>
                  </Link>
                </div>
              </div>
              <div className="relative group">
                <button className="text-gray-700 hover:text-orange-500 transition-colors flex items-center uppercase">
                  Locations
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="absolute left-0 mt-2 w-180 bg-orange-500 rounded-4xl overflow-hidden border-2 border-orange-500 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="bg-white rounded-b-4xl py-2">
                    <div className="grid grid-cols-3 gap-0 py-2">
                      {cities.map((city) => (
                        <Link key={city.slug} href={`/${city.slug}-movers`} className="block px-6 py-2 text-gray-700 hover:text-orange-600 hover:translate-x-1 transition-all duration-200 rounded">
                          <div className="font-medium text-sm">{city.name} Movers</div>
                        </Link>
                      ))}
                    </div>
                  </div>
                  <Link href="/locations" className="block px-6 pt-4 pb-5 text-white hover:text-white/80 hover:translate-x-1 transition-all duration-200">
                    <div className="font-medium">All Locations &rarr;</div>
                    <div className="text-sm text-white/70 font-normal">Complete location overview</div>
                  </Link>
                </div>
              </div>
              <div className="relative group">
                <button className="text-gray-700 hover:text-orange-500 transition-colors flex items-center uppercase">
                  Compare
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="absolute left-0 mt-2 w-72 bg-orange-500 rounded-4xl overflow-hidden border-2 border-orange-500 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="bg-white rounded-b-4xl py-2">
                    <Link href="/compare" className="block px-6 py-3 text-gray-700 hover:text-orange-600 hover:translate-x-1 transition-all duration-200">
                      <div className="font-medium">Compare Movers</div>
                      <div className="text-sm text-gray-500 font-normal">See how we stack up</div>
                    </Link>
                    <Link href="/alternatives" className="block px-6 py-3 text-gray-700 hover:text-orange-600 hover:translate-x-1 transition-all duration-200">
                      <div className="font-medium">Alternative Options</div>
                      <div className="text-sm text-gray-500 font-normal">DIY vs full-service</div>
                    </Link>
                  </div>
                  <Link href="/why-choose-us" className="block px-6 pt-4 pb-5 text-white hover:text-white/80 hover:translate-x-1 transition-all duration-200">
                    <div className="font-medium">Why Choose Us &rarr;</div>
                    <div className="text-sm text-white/70 font-normal">The Rapid Panda difference</div>
                  </Link>
                </div>
              </div>
              <div className="relative group">
                <button className="text-gray-700 hover:text-orange-500 transition-colors flex items-center uppercase">
                  Resources
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="absolute left-0 mt-2 w-72 bg-orange-500 rounded-4xl overflow-hidden border-2 border-orange-500 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="bg-white rounded-b-4xl py-2">
                    <Link href="/faq" className="block px-6 py-3 text-gray-700 hover:text-orange-600 hover:translate-x-1 transition-all duration-200">
                      <div className="font-medium">FAQ</div>
                      <div className="text-sm text-gray-500 font-normal">Common questions</div>
                    </Link>
                    <Link href="/moving-rates" className="block px-6 py-3 text-gray-700 hover:text-orange-600 hover:translate-x-1 transition-all duration-200">
                      <div className="font-medium">Moving Rates</div>
                      <div className="text-sm text-gray-500 font-normal">Pricing information</div>
                    </Link>
                    <Link href="/moving-routes" className="block px-6 py-3 text-gray-700 hover:text-orange-600 hover:translate-x-1 transition-all duration-200">
                      <div className="font-medium">Moving Routes</div>
                      <div className="text-sm text-gray-500 font-normal">Popular moving routes</div>
                    </Link>
                    <Link href="/moving-tips" className="block px-6 py-3 text-gray-700 hover:text-orange-600 hover:translate-x-1 transition-all duration-200">
                      <div className="font-medium">Moving Tips</div>
                      <div className="text-sm text-gray-500 font-normal">Expert advice</div>
                    </Link>
                    <Link href="/moving-checklist" className="block px-6 py-3 text-gray-700 hover:text-orange-600 hover:translate-x-1 transition-all duration-200">
                      <div className="font-medium">Moving Checklist</div>
                      <div className="text-sm text-gray-500 font-normal">Essential tasks</div>
                    </Link>
                    <Link href="/moving-glossary" className="block px-6 py-3 text-gray-700 hover:text-orange-600 hover:translate-x-1 transition-all duration-200">
                      <div className="font-medium">Moving Glossary</div>
                      <div className="text-sm text-gray-500 font-normal">Common moving terms</div>
                    </Link>
                  </div>
                  <Link href="/blog" className="block px-6 pt-4 pb-5 text-white hover:text-white/80 hover:translate-x-1 transition-all duration-200">
                    <div className="font-medium">Blog &rarr;</div>
                    <div className="text-sm text-white/70 font-normal">Moving tips and news</div>
                  </Link>
                </div>
              </div>
              <div className="relative group">
                <button className="text-gray-700 hover:text-orange-500 transition-colors flex items-center uppercase">
                  Company
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="absolute left-0 mt-2 w-72 bg-orange-500 rounded-4xl overflow-hidden border-2 border-orange-500 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="bg-white rounded-b-4xl py-2">
                    <Link href="/about-us" className="block px-6 py-3 text-gray-700 hover:text-orange-600 hover:translate-x-1 transition-all duration-200">
                      <div className="font-medium">About Us</div>
                      <div className="text-sm text-gray-500 font-normal">About Rapid Panda Movers</div>
                    </Link>
                    <Link href="/contact-us" className="block px-6 py-3 text-gray-700 hover:text-orange-600 hover:translate-x-1 transition-all duration-200">
                      <div className="font-medium">Contact Us</div>
                      <div className="text-sm text-gray-500 font-normal">Get in touch</div>
                    </Link>
                    <Link href="/reviews" className="block px-6 py-3 text-gray-700 hover:text-orange-600 hover:translate-x-1 transition-all duration-200">
                      <div className="font-medium">Reviews</div>
                      <div className="text-sm text-gray-500 font-normal">Real testimonials</div>
                    </Link>
                    <Link href="/reservations" className="block px-6 py-3 text-gray-700 hover:text-orange-600 hover:translate-x-1 transition-all duration-200">
                      <div className="font-medium">Reservations</div>
                      <div className="text-sm text-gray-500 font-normal">Book your move</div>
                    </Link>
                  </div>
                  <Link href="/quote" className="block px-6 pt-4 pb-5 text-white hover:text-white/80 hover:translate-x-1 transition-all duration-200">
                    <div className="font-medium">Free Quote &rarr;</div>
                    <div className="text-sm text-white/70 font-normal">Get a free estimate</div>
                  </Link>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="flex flex-col items-center">
                  <a href={`tel:${phoneTel}`} className="flex items-center justify-center space-x-2 border border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white font-semibold py-3 px-6 rounded-lg transition-colors w-48">
                    <Phone className="w-4 h-4" />
                    <span>{phoneFormatted}</span>
                  </a>
                  <span className="text-xs text-gray-500 mt-1">{content.site.header.phoneSubtext}</span>
                </div>
                <div className="flex flex-col items-center">
                  <Link href="/quote" className="flex items-center justify-center border border-orange-500 bg-orange-500 hover:bg-orange-600 hover:border-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors w-48">
                    Get Free Quote
                  </Link>
                  <span className="text-xs text-gray-500 mt-1">{content.site.header.quoteSubtext}</span>
                </div>
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