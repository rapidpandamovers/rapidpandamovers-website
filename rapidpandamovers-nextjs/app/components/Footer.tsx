import Link from 'next/link'
import { Phone, Mail, MapPin, Clock, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react'
import { getAllActiveCities, getAllActiveServices } from '@/lib/data'
import comparisons from '@/data/comparisons.json'
import alternatives from '@/data/alternatives.json'

export default function Footer() {
  const cities = getAllActiveCities()
  const services = getAllActiveServices()

  return (
    <footer className="py-5 px-4 md:px-6 lg:px-8 text-white">
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
              <a href="tel:786-585-4269" className="flex items-start space-x-3 text-gray-400 hover:text-orange-500 transition-colors">
                <Phone className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">(786) 585-4269</p>
                </div>
              </a>
              <a href="mailto:info@rapidpandamovers.com" className="flex items-start space-x-3 text-gray-400 hover:text-orange-500 transition-colors">
                <Mail className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                <span>info@rapidpandamovers.com</span>
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
                  <p>Mon-Fri: 8AM - 8PM</p>
                  <p>Sat-Sun: 9AM - 6PM</p>
                </div>
              </div>
              {/* Social Media */}
              <div className="flex space-x-4 pt-2">
                <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors" aria-label="Facebook">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors" aria-label="Twitter">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors" aria-label="Instagram">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors" aria-label="LinkedIn">
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <img
                src="/images/rapidpandamovers-logo.png"
                alt="Rapid Panda Movers"
                className="h-10 w-auto brightness-0 invert"
              />
              <p className="text-gray-400 text-sm">
                © 2024 Rapid Panda Movers. All rights reserved.
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
