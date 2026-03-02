import { Link } from '@/i18n/routing'
import Image from 'next/image'
import { getAllActiveCities, getLocalizedServices } from '@/lib/data'
import comparisons from '@/data/comparisons.json'
import alternatives from '@/data/alternatives.json'
import { getMessages, getLocale } from 'next-intl/server'
import { getTranslatedSlug } from '@/i18n/slug-map'
import type { Locale } from '@/i18n/config'
import { LanguageSelectorFooter } from './LanguageSelector'
import FooterDrawers from './FooterDrawersLoader'

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
    </svg>
  )
}

function MailIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
    </svg>
  )
}

function MapPinIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/>
    </svg>
  )
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  )
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
    </svg>
  )
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
    </svg>
  )
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/>
    </svg>
  )
}

function SocialIcon({ platform, size = 'default' }: { platform: string; size?: 'default' | 'lg' }) {
  const cls = size === 'lg' ? 'w-7 h-7' : 'w-5 h-5'
  const ytCls = size === 'lg' ? 'w-9 h-9' : 'w-7 h-7'
  switch (platform) {
    case 'facebook':
      return <FacebookIcon className={cls} />
    case 'x':
      return (
        <svg className={cls} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      )
    case 'instagram':
      return <InstagramIcon className={cls} />
    case 'linkedin':
      return <LinkedinIcon className={cls} />
    case 'tiktok':
      return (
        <svg className={cls} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
        </svg>
      )
    case 'youtube':
      return (
        <svg className={ytCls} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.418-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z" clipRule="evenodd"/>
        </svg>
      )
    case 'pinterest':
      return (
        <svg className={cls} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"/>
        </svg>
      )
    default:
      return null
  }
}

export default async function Footer() {
  const locale = await getLocale() as Locale
  const { nav, content, ui } = (await getMessages()) as any
  const cities = getAllActiveCities()
  const services = getLocalizedServices(locale)
  const { phone, email, address, hours } = content.site
  const phoneFormatted = `(${phone.slice(0,3)}) ${phone.slice(4,7)}-${phone.slice(8)}`
  const phoneTel = phone.replace(/-/g, '')
  const addressParts = address.split(/(?= Miami)/)
  const addressLine1 = addressParts[0]
  const addressLine2 = addressParts.slice(1).join('').trim()
  const nameTemplate = nav.footer.sections.locations.nameTemplate || '{name} Movers'

  return (
    <footer className="pt-20 md:pb-6 md:px-6 lg:px-8 text-white">
      <div className="container mx-auto rounded-4xl border border-gray-700 bg-black p-6 md:p-12">
        {/* Mobile Footer Drawers */}
        <div className="md:hidden mb-6">
          <FooterDrawers
            nav={nav}
            services={services}
            cities={cities}
            locale={locale}
            contactInfo={{ phoneTel, phoneFormatted, email, addressLine1, addressLine2, hours }}
            social={nav.footer.social}
            comparisons={comparisons.comparisons}
            alternatives={alternatives.alternatives}
          />

          {/* Contact Info — always visible */}
          <div className="pt-6">
            <p className="font-display text-base font-bold mb-4 text-white">{ui.contact.contactUs}</p>
            <div className="space-y-3 text-sm">
              <a href={`tel:${phoneTel}`} className="flex items-start space-x-3 text-gray-400 hover:text-orange-700 transition-colors">
                <PhoneIcon className="w-4 h-4 text-orange-700 flex-shrink-0 mt-0.5" />
                <span className="font-semibold text-white">{phoneFormatted}</span>
              </a>
              <a href={`mailto:${email}`} className="flex items-start space-x-3 text-gray-400 hover:text-orange-700 transition-colors">
                <MailIcon className="w-4 h-4 text-orange-700 flex-shrink-0 mt-0.5" />
                <span>{email}</span>
              </a>
              <div className="flex items-start space-x-3">
                <MapPinIcon className="w-4 h-4 text-orange-700 flex-shrink-0 mt-0.5" />
                <address className="text-gray-400 not-italic">
                  <p>{addressLine1}</p>
                  <p>{addressLine2}</p>
                </address>
              </div>
              <div className="flex items-start space-x-3">
                <ClockIcon className="w-4 h-4 text-orange-700 flex-shrink-0 mt-0.5" />
                <div className="text-gray-400">
                  {hours.map((entry: { label: string; time: string }, i: number) => (
                    <p key={i}>{entry.label}: {entry.time}</p>
                  ))}
                </div>
              </div>
              {/* Social Media */}
              <div className="grid grid-cols-7 pt-8">
                {nav.footer.social.map((social: any) => (
                  <a
                    key={social.platform}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center text-gray-400 hover:text-orange-700 transition-colors"
                    aria-label={social.label}
                  >
                    <SocialIcon platform={social.platform} size="lg" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="hidden md:grid md:grid-cols-4 gap-8 mb-12">
          {/* Moving Services */}
          <div>
            <p className="font-display text-lg font-bold mb-4 text-white">{nav.footer.sections.services.title}</p>
            <ul className="space-y-2 text-sm">
              {services.map((service) => (
                <li key={service.slug}>
                  <Link href={`/${getTranslatedSlug(service.slug, locale)}`} className="text-gray-400 hover:text-orange-700 transition-colors">
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Moving Locations */}
          <div>
            <p className="font-display text-lg font-bold mb-4 text-white">{nav.footer.sections.locations.title}</p>
            <ul className="space-y-2 text-sm">
              {cities.map((city) => (
                <li key={city.slug}>
                  <Link href={`/${getTranslatedSlug(`${city.slug}-movers`, locale)}`} className="text-gray-400 hover:text-orange-700 transition-colors">
                    {nameTemplate.replace('{name}', city.name)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources & Company */}
          <div>
            <p className="font-display text-lg font-bold mb-4 text-white">{nav.footer.sections.resources.title}</p>
            <ul className="space-y-2 text-sm mb-8">
              {nav.footer.sections.resources.items.map((item: any) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-gray-400 hover:text-orange-700 transition-colors">{item.label}</Link>
                </li>
              ))}
            </ul>

            <p className="font-display text-lg font-bold mb-4 text-white">{nav.footer.sections.company.title}</p>
            <ul className="space-y-2 text-sm mb-8">
              {nav.footer.sections.company.items.map((item: any) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-gray-400 hover:text-orange-700 transition-colors">{item.label}</Link>
                </li>
              ))}
            </ul>

            <p className="font-display text-lg font-bold mb-4 text-white">{nav.footer.sections.compare.title}</p>
            <ul className="space-y-2 text-sm mb-8">
              <li><Link href={`/${getTranslatedSlug('compare', locale)}`} className="text-gray-400 hover:text-orange-700 transition-colors">{nav.footer.sections.compare.allLabel}</Link></li>
              {comparisons.comparisons.map((comparison) => (
                <li key={comparison.slug}>
                  <Link href={`/${getTranslatedSlug('compare', locale)}/${comparison.slug}`} className="text-gray-400 hover:text-orange-700 transition-colors">
                    {nav.footer.sections.compare.prefix} {comparison.competitor.name}
                  </Link>
                </li>
              ))}
            </ul>

            <p className="font-display text-lg font-bold mb-4 text-white">{nav.footer.sections.alternatives.title}</p>
            <ul className="space-y-2 text-sm">
              <li><Link href={`/${getTranslatedSlug('alternatives', locale)}`} className="text-gray-400 hover:text-orange-700 transition-colors">{nav.footer.sections.alternatives.allLabel}</Link></li>
              {alternatives.alternatives.map((alt) => (
                <li key={alt.slug}>
                  <Link href={`/${getTranslatedSlug('alternatives', locale)}/${alt.slug}`} className="text-gray-400 hover:text-orange-700 transition-colors">
                    {alt.alternative.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <p className="font-display text-lg font-bold mb-4 text-white">{ui.contact.contactUs}</p>
            <div className="space-y-4 text-sm">
              <a href={`tel:${phoneTel}`} className="flex items-start space-x-3 text-gray-400 hover:text-orange-700 transition-colors">
                <PhoneIcon className="w-5 h-5 text-orange-700 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">{phoneFormatted}</p>
                </div>
              </a>
              <a href={`mailto:${email}`} className="flex items-start space-x-3 text-gray-400 hover:text-orange-700 transition-colors">
                <MailIcon className="w-5 h-5 text-orange-700 flex-shrink-0 mt-0.5" />
                <span>{email}</span>
              </a>
              <div className="flex items-start space-x-3">
                <MapPinIcon className="w-5 h-5 text-orange-700 flex-shrink-0 mt-0.5" />
                <address className="text-gray-400 not-italic">
                  <p>{addressLine1}</p>
                  <p>{addressLine2}</p>
                </address>
              </div>
              <div className="flex items-start space-x-3">
                <ClockIcon className="w-5 h-5 text-orange-700 flex-shrink-0 mt-0.5" />
                <div className="text-gray-400">
                  {hours.map((entry: { label: string; time: string }, i: number) => (
                    <p key={i}>{entry.label}: {entry.time}</p>
                  ))}
                </div>
              </div>
              {/* Social Media */}
              <div className="flex items-center space-x-4 pt-2">
                {nav.footer.social.map((social: any) => (
                  <a
                    key={social.platform}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-gray-400 hover:text-orange-700 transition-colors${social.platform === 'youtube' ? ' flex items-center' : ''}`}
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
        <div className="md:border-t md:border-gray-800 pt-4 md:pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex flex-col items-center md:flex-row md:items-center md:space-x-4 mb-10 md:mb-0">
              <Image
                src="/images/rapidpandamovers-logo.png"
                alt="Rapid Panda Movers"
                width={68}
                height={40}
                className="h-16 md:h-10 w-auto brightness-0 invert mb-3 md:mb-0"
              />
              <p className="text-gray-400 text-sm">
                {nav.footer.copyright.replace('{year}', String(new Date().getFullYear()))}
              </p>
            </div>
            <div className="flex flex-col items-center gap-4 pb-4 md:pb-0 md:flex-row md:gap-0 md:space-x-6 text-sm">
              <div className="flex items-center space-x-6">
                {nav.footer.legalLinks.map((link: any) => (
                  <Link key={link.href} href={link.href} className="text-gray-400 hover:text-orange-700 transition-colors">{link.label}</Link>
                ))}
              </div>
              <div className="flex items-center space-x-6">
                <span className="hidden md:inline text-gray-700">|</span>
                <LanguageSelectorFooter />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
