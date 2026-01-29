import Link from 'next/link'
import { Phone, Mail, MapPin, Facebook, Twitter, Instagram } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">🐼</span>
              </div>
              <div>
                <span className="text-lg font-bold block leading-none">Rapid Panda Movers</span>
                <span className="text-sm text-orange-500">Professional Moving Services</span>
              </div>
            </div>
            <p className="text-gray-300 mb-4">
              Your trusted Miami moving company providing professional, reliable, and affordable moving services throughout Florida.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-300 hover:text-orange-500 transition-colors">Home</Link></li>
              <li><Link href="/about" className="text-gray-300 hover:text-orange-500 transition-colors">About Us</Link></li>
              <li><Link href="/services" className="text-gray-300 hover:text-orange-500 transition-colors">Services</Link></li>
              <li><Link href="/blog" className="text-gray-300 hover:text-orange-500 transition-colors">Blog</Link></li>
              <li><Link href="/contact" className="text-gray-300 hover:text-orange-500 transition-colors">Contact</Link></li>
              <li><Link href="/quote" className="text-gray-300 hover:text-orange-500 transition-colors">Get Quote</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-bold mb-4">Services</h3>
            <ul className="space-y-2">
              <li><Link href="/local-moving" className="text-gray-300 hover:text-orange-500 transition-colors">Local Moving</Link></li>
              <li><Link href="/apartment-moving" className="text-gray-300 hover:text-orange-500 transition-colors">Apartment Moving</Link></li>
              <li><Link href="/packing-services" className="text-gray-300 hover:text-orange-500 transition-colors">Packing Services</Link></li>
              <li><Link href="/long-distance" className="text-gray-300 hover:text-orange-500 transition-colors">Long Distance</Link></li>
              <li><Link href="/commercial-moving" className="text-gray-300 hover:text-orange-500 transition-colors">Commercial Moving</Link></li>
              <li><Link href="/storage-solutions" className="text-gray-300 hover:text-orange-500 transition-colors">Storage Solutions</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-4">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-orange-500" />
                <div>
                  <p className="text-gray-300">(305) 555-0123</p>
                  <p className="text-sm text-gray-400">Available 24/7</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-orange-500" />
                <div>
                  <p className="text-gray-300">info@rapidpandamovers.com</p>
                  <p className="text-sm text-gray-400">Quick response</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-orange-500" />
                <div>
                  <p className="text-gray-300">Miami, FL</p>
                  <p className="text-sm text-gray-400">Serving all of South Florida</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2024 Rapid Panda Movers. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <Link href="/privacy" className="text-gray-400 hover:text-orange-500 transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="text-gray-400 hover:text-orange-500 transition-colors">Terms of Service</Link>
              <Link href="/sitemap" className="text-gray-400 hover:text-orange-500 transition-colors">Sitemap</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}