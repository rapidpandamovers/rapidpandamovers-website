import Link from 'next/link'
import Image from 'next/image'
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Linkedin } from 'lucide-react'
import { getAllActiveCities, getAllActiveServices } from '@/lib/data'
import comparisons from '@/data/comparisons.json'
import alternatives from '@/data/alternatives.json'
import content from '@/data/content.json'
import nav from '@/data/navigation.json'

function SocialIcon({ platform }: { platform: string }) {
  switch (platform) {
    case 'facebook':
      return <Facebook className="w-5 h-5" />
    case 'x':
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      )
    case 'instagram':
      return <Instagram className="w-5 h-5" />
    case 'linkedin':
      return <Linkedin className="w-5 h-5" />
    case 'tiktok':
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
        </svg>
      )
    case 'youtube':
      return (
        <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.418-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z" clipRule="evenodd"/>
        </svg>
      )
    default:
      return null
  }
}

export default function Footer() {
  const cities = getAllActiveCities()
  const services = getAllActiveServices()
  const { phone, email, address, hours } = content.site
  const phoneFormatted = `(${phone.slice(0,3)}) ${phone.slice(4,7)}-${phone.slice(8)}`
  const phoneTel = phone.replace(/-/g, '')
  const addressParts = address.split(/(?= Miami)/)
  const addressLine1 = addressParts[0]
  const addressLine2 = addressParts.slice(1).join('').trim()

  return (
    <footer className="pt-20 pb-6 px-4 md:px-6 lg:px-8 text-white">
      <div className="container mx-auto rounded-4xl border border-gray-700 bg-black p-6 md:p-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Moving Services */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-white">{nav.footer.sections.services.title}</h3>
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
            <h3 className="text-lg font-bold mb-4 text-white">{nav.footer.sections.locations.title}</h3>
            <ul className="space-y-2 text-sm">
              {cities.map((city) => (
                <li key={city.slug}>
                  <Link href={`/${city.slug}-movers`} className="text-gray-400 hover:text-orange-500 transition-colors">
                    {city.name} {nav.footer.sections.locations.suffix}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources & Company */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-white">{nav.footer.sections.resources.title}</h3>
            <ul className="space-y-2 text-sm mb-8">
              {nav.footer.sections.resources.items.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-gray-400 hover:text-orange-500 transition-colors">{item.label}</Link>
                </li>
              ))}
            </ul>

            <h3 className="text-lg font-bold mb-4 text-white">{nav.footer.sections.company.title}</h3>
            <ul className="space-y-2 text-sm mb-8">
              {nav.footer.sections.company.items.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-gray-400 hover:text-orange-500 transition-colors">{item.label}</Link>
                </li>
              ))}
            </ul>

            <h3 className="text-lg font-bold mb-4 text-white">{nav.footer.sections.compare.title}</h3>
            <ul className="space-y-2 text-sm mb-8">
              <li><Link href="/compare" className="text-gray-400 hover:text-orange-500 transition-colors">{nav.footer.sections.compare.allLabel}</Link></li>
              {comparisons.comparisons.map((comparison) => (
                <li key={comparison.slug}>
                  <Link href={`/compare/${comparison.slug}`} className="text-gray-400 hover:text-orange-500 transition-colors">
                    {nav.footer.sections.compare.prefix} {comparison.competitor.name}
                  </Link>
                </li>
              ))}
            </ul>

            <h3 className="text-lg font-bold mb-4 text-white">{nav.footer.sections.alternatives.title}</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/alternatives" className="text-gray-400 hover:text-orange-500 transition-colors">{nav.footer.sections.alternatives.allLabel}</Link></li>
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
                  <p>{addressLine1}</p>
                  <p>{addressLine2}</p>
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
                {nav.footer.social.map((social) => (
                  <a
                    key={social.platform}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-gray-400 hover:text-orange-500 transition-colors${social.platform === 'youtube' ? ' flex items-center' : ''}`}
                    aria-label={social.label}
                  >
                    <SocialIcon platform={social.platform} />
                  </a>
                ))}
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
                {nav.footer.copyright.replace('{year}', String(new Date().getFullYear()))}
              </p>
            </div>
            <div className="flex space-x-6 text-sm">
              {nav.footer.legalLinks.map((link) => (
                <Link key={link.href} href={link.href} className="text-gray-400 hover:text-orange-500 transition-colors">{link.label}</Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
