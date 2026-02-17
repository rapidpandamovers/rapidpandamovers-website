import Link from 'next/link'
import Image from 'next/image'
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Linkedin } from 'lucide-react'
import { getAllActiveCities, getAllActiveServices } from '@/lib/data'
import comparisons from '@/data/comparisons.json'
import alternatives from '@/data/alternatives.json'
import content from '@/data/content.json'

export default function Footer() {
  const cities = getAllActiveCities()
  const services = getAllActiveServices()
  const { phone, email, address, hours } = content.site
  const phoneFormatted = `(${phone.slice(0,3)}) ${phone.slice(4,7)}-${phone.slice(8)}`
  const phoneTel = phone.replace(/-/g, '')

  return (
    <footer className="pt-20 pb-6 px-4 md:px-6 lg:px-8 text-white">
      <div className="container mx-auto rounded-4xl border border-gray-700 bg-black p-6 md:p-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Moving Services */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-white">Moving Services</h3>
            <ul className="space-y-2 text-sm">
              {services.map((service) => (
                <li key={service.slug}>
                  <Link href={`/${service.slug}`} className="text-gray-400 hover:text-orange-500 transition-colors">
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Moving Locations */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-white">Moving Locations</h3>
            <ul className="space-y-2 text-sm">
              {cities.map((city) => (
                <li key={city.slug}>
                  <Link href={`/${city.slug}-movers`} className="text-gray-400 hover:text-orange-500 transition-colors">
                    {city.name} Movers
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources & Company */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-white">Resources</h3>
            <ul className="space-y-2 text-sm mb-8">
              <li><Link href="/faq" className="text-gray-400 hover:text-orange-500 transition-colors">FAQ</Link></li>
              <li><Link href="/blog" className="text-gray-400 hover:text-orange-500 transition-colors">Blog</Link></li>
              <li><Link href="/moving-rates" className="text-gray-400 hover:text-orange-500 transition-colors">Moving Rates</Link></li>
              <li><Link href="/moving-routes" className="text-gray-400 hover:text-orange-500 transition-colors">Moving Routes</Link></li>
              <li><Link href="/moving-tips" className="text-gray-400 hover:text-orange-500 transition-colors">Moving Tips</Link></li>
              <li><Link href="/moving-checklist" className="text-gray-400 hover:text-orange-500 transition-colors">Moving Checklist</Link></li>
              <li><Link href="/moving-glossary" className="text-gray-400 hover:text-orange-500 transition-colors">Moving Glossary</Link></li>
            </ul>

            <h3 className="text-lg font-bold mb-4 text-white">Company</h3>
            <ul className="space-y-2 text-sm mb-8">
              <li><Link href="/about-us" className="text-gray-400 hover:text-orange-500 transition-colors">About Us</Link></li>
              <li><Link href="/contact-us" className="text-gray-400 hover:text-orange-500 transition-colors">Contact Us</Link></li>
              <li><Link href="/reviews" className="text-gray-400 hover:text-orange-500 transition-colors">Reviews</Link></li>
              <li><Link href="/reservations" className="text-gray-400 hover:text-orange-500 transition-colors">Reservations</Link></li>
              <li><Link href="/quote" className="text-gray-400 hover:text-orange-500 transition-colors">Free Quote</Link></li>
            </ul>

            <h3 className="text-lg font-bold mb-4 text-white">Compare Movers</h3>
            <ul className="space-y-2 text-sm mb-8">
              <li><Link href="/compare" className="text-gray-400 hover:text-orange-500 transition-colors">All Comparisons</Link></li>
              {comparisons.comparisons.map((comparison) => (
                <li key={comparison.slug}>
                  <Link href={`/compare/${comparison.slug}`} className="text-gray-400 hover:text-orange-500 transition-colors">
                    vs {comparison.competitor.name}
                  </Link>
                </li>
              ))}
            </ul>

            <h3 className="text-lg font-bold mb-4 text-white">Alternatives</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/alternatives" className="text-gray-400 hover:text-orange-500 transition-colors">All Alternatives</Link></li>
              {alternatives.alternatives.map((alt) => (
                <li key={alt.slug}>
                  <Link href={`/alternatives/${alt.slug}`} className="text-gray-400 hover:text-orange-500 transition-colors">
                    {alt.alternative.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-white">Contact Us</h3>
            <div className="space-y-4 text-sm">
              <a href={`tel:${phoneTel}`} className="flex items-start space-x-3 text-gray-400 hover:text-orange-500 transition-colors">
                <Phone className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">{phoneFormatted}</p>
                </div>
              </a>
              <a href={`mailto:${email}`} className="flex items-start space-x-3 text-gray-400 hover:text-orange-500 transition-colors">
                <Mail className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                <span>{email}</span>
              </a>
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                <div className="text-gray-400">
                  <p>7001 North Waterway Dr #107</p>
                  <p>Miami, FL 33155</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                <div className="text-gray-400">
                  {hours.map((entry: { label: string; time: string }, i: number) => (
                    <p key={i}>{entry.label}: {entry.time}</p>
                  ))}
                </div>
              </div>
              {/* Social Media */}
              <div className="flex items-center space-x-4 pt-2">
                <a href="https://www.facebook.com/raapidpandamovers/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-orange-500 transition-colors" aria-label="Facebook">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors" aria-label="X">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                <a href="https://www.instagram.com/rapidpandamovers/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-orange-500 transition-colors" aria-label="Instagram">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors" aria-label="LinkedIn">
                  <Linkedin className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors" aria-label="TikTok">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors flex items-center" aria-label="YouTube">
                  <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.418-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z" clipRule="evenodd"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <Image
                src="/images/rapidpandamovers-logo.png"
                alt="Rapid Panda Movers"
                width={68}
                height={40}
                className="h-10 w-auto brightness-0 invert"
              />
              <p className="text-gray-400 text-sm">
                © {new Date().getFullYear()} Rapid Panda Movers. All rights reserved.
              </p>
            </div>
            <div className="flex space-x-6 text-sm">
              <Link href="/privacy" className="text-gray-400 hover:text-orange-500 transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="text-gray-400 hover:text-orange-500 transition-colors">Terms & Conditions</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
