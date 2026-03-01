import { Link } from '@/i18n/routing'
import Image from 'next/image'
import { getAllActiveCities, getLocalizedServices } from '@/lib/data'
import { getMessages, getLocale } from 'next-intl/server'
import { getTranslatedSlug } from '@/i18n/slug-map'
import type { Locale } from '@/i18n/config'
import { ArrowRight } from 'lucide-react'
import { LanguageSelectorHeader } from './LanguageSelector'
import MobileMenu from './MobileMenuLoader'

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
    </svg>
  )
}

export default async function Header() {
  const locale = await getLocale() as Locale
  const { nav, content, ui } = (await getMessages()) as any
  const cities = getAllActiveCities()
  const services = getLocalizedServices(locale)
  const phone = content.site.phone
  const phoneFormatted = `(${phone.slice(0,3)}) ${phone.slice(4,7)}-${phone.slice(8)}`
  const phoneTel = phone.replace(/-/g, '')
  const nameTemplate = nav.header.locations.nameTemplate || '{name} Movers'
  return (
    <>

      {/* Main Header */}
      <header className="relative z-[60] bg-white text-sm font-bold">
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

            <nav aria-label="Main navigation" className="hidden xl:flex items-center space-x-4">
              <Link href="/" className="text-gray-700 hover:text-orange-700 transition-colors uppercase">
                {nav.header.home.label}
              </Link>
              <div className="relative group">
                <button className="text-gray-700 hover:text-orange-700 transition-colors flex items-center uppercase" aria-haspopup="true" aria-expanded="false">
                  {nav.header.services.label}
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="absolute left-0 mt-2 w-230 bg-orange-700 rounded-4xl overflow-hidden border-2 border-orange-700 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="bg-white rounded-b-4xl py-2">
                    <div className="grid grid-cols-3 gap-0 py-2">
                      {services.map((service, i) => (
                        <Link key={service.slug} href={`/${getTranslatedSlug(service.slug, locale)}`} className={`block pl-6 py-2 text-gray-700 hover:text-orange-700 hover:translate-x-1 transition-all duration-200 rounded ${i % 3 === 2 ? 'pr-6' : 'pr-0'}`}>
                          <div className="font-medium text-sm">{service.name}</div>
                        </Link>
                      ))}
                    </div>
                  </div>
                  <Link href={`/${getTranslatedSlug('services', locale)}`} className="block pl-6 pr-6 pt-4 pb-5 text-white hover:text-white/80 hover:translate-x-1 transition-all duration-200">
                    <div className="font-medium">{nav.header.services.allLink.label} &rarr;</div>
                    <div className="text-sm text-white/70 font-normal">{nav.header.services.allLink.description}</div>
                  </Link>
                </div>
              </div>
              <div className="relative group">
                <button className="text-gray-700 hover:text-orange-700 transition-colors flex items-center uppercase" aria-haspopup="true" aria-expanded="false">
                  {nav.header.locations.label}
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="absolute left-0 mt-2 w-200 bg-orange-700 rounded-4xl overflow-hidden border-2 border-orange-700 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="bg-white rounded-b-4xl py-2">
                    <div className="grid grid-cols-3 gap-0 py-2">
                      {cities.map((city, i) => (
                        <Link key={city.slug} href={`/${getTranslatedSlug(`${city.slug}-movers`, locale)}`} className={`block pl-6 py-2 text-gray-700 hover:text-orange-700 hover:translate-x-1 transition-all duration-200 rounded ${i % 3 === 2 ? 'pr-6' : 'pr-0'}`}>
                          <div className="font-medium text-sm">{nameTemplate.replace('{name}', city.name)}</div>
                        </Link>
                      ))}
                    </div>
                  </div>
                  <Link href={`/${getTranslatedSlug('locations', locale)}`} className="block pl-6 pr-6 pt-4 pb-5 text-white hover:text-white/80 hover:translate-x-1 transition-all duration-200">
                    <div className="font-medium">{nav.header.locations.allLink.label} &rarr;</div>
                    <div className="text-sm text-white/70 font-normal">{nav.header.locations.allLink.description}</div>
                  </Link>
                </div>
              </div>
              <div className="relative group">
                <button className="text-gray-700 hover:text-orange-700 transition-colors flex items-center uppercase" aria-haspopup="true" aria-expanded="false">
                  {nav.header.compare.label}
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="absolute left-0 mt-2 w-72 bg-orange-700 rounded-4xl overflow-hidden border-2 border-orange-700 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="bg-white rounded-b-4xl py-2">
                    {nav.header.compare.items.map((item: any) => (
                      <Link key={item.href} href={item.href} className="block pl-6 pr-6 py-3 text-gray-700 hover:text-orange-700 hover:translate-x-1 transition-all duration-200">
                        <div className="font-medium">{item.label}</div>
                        <div className="text-sm text-gray-500 font-normal">{item.description}</div>
                      </Link>
                    ))}
                  </div>
                  <Link href={nav.header.compare.bottomLink.href} className="block pl-6 pr-6 pt-4 pb-5 text-white hover:text-white/80 hover:translate-x-1 transition-all duration-200">
                    <div className="font-medium">{nav.header.compare.bottomLink.label} &rarr;</div>
                    <div className="text-sm text-white/70 font-normal">{nav.header.compare.bottomLink.description}</div>
                  </Link>
                </div>
              </div>
              <div className="relative group">
                <button className="text-gray-700 hover:text-orange-700 transition-colors flex items-center uppercase" aria-haspopup="true" aria-expanded="false">
                  {nav.header.resources.label}
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="absolute left-0 mt-2 w-72 bg-orange-700 rounded-4xl overflow-hidden border-2 border-orange-700 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="bg-white rounded-b-4xl py-2">
                    {nav.header.resources.items.map((item: any) => (
                      <Link key={item.href} href={item.href} className="block pl-6 pr-6 py-3 text-gray-700 hover:text-orange-700 hover:translate-x-1 transition-all duration-200">
                        <div className="font-medium">{item.label}</div>
                        <div className="text-sm text-gray-500 font-normal">{item.description}</div>
                      </Link>
                    ))}
                  </div>
                  <Link href={nav.header.resources.bottomLink.href} className="block pl-6 pr-6 pt-4 pb-5 text-white hover:text-white/80 hover:translate-x-1 transition-all duration-200">
                    <div className="font-medium">{nav.header.resources.bottomLink.label} &rarr;</div>
                    <div className="text-sm text-white/70 font-normal">{nav.header.resources.bottomLink.description}</div>
                  </Link>
                </div>
              </div>
              <div className="relative group">
                <button className="text-gray-700 hover:text-orange-700 transition-colors flex items-center uppercase" aria-haspopup="true" aria-expanded="false">
                  {nav.header.company.label}
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="absolute left-0 mt-2 w-72 bg-orange-700 rounded-4xl overflow-hidden border-2 border-orange-700 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="bg-white rounded-b-4xl py-2">
                    {nav.header.company.items.map((item: any) => (
                      <Link key={item.href} href={item.href} className="block pl-6 pr-6 py-3 text-gray-700 hover:text-orange-700 hover:translate-x-1 transition-all duration-200">
                        <div className="font-medium">{item.label}</div>
                        <div className="text-sm text-gray-500 font-normal">{item.description}</div>
                      </Link>
                    ))}
                  </div>
                  <Link href={nav.header.company.bottomLink.href} className="block pl-6 pr-6 pt-4 pb-5 text-white hover:text-white/80 hover:translate-x-1 transition-all duration-200">
                    <div className="font-medium">{nav.header.company.bottomLink.label} &rarr;</div>
                    <div className="text-sm text-white/70 font-normal">{nav.header.company.bottomLink.description}</div>
                  </Link>
                </div>
              </div>

              <LanguageSelectorHeader />

              <div className="flex items-center space-x-3">
                <div className="flex flex-col items-center">
                  <a href={`tel:${phoneTel}`} aria-label={ui.buttons.callAriaLabel} className="flex items-center justify-center space-x-2 border border-orange-700 text-orange-700 hover:bg-orange-700 hover:text-white font-semibold py-3 px-4 rounded-lg transition-colors w-44">
                    <PhoneIcon className="w-4 h-4" />
                    <span>{phoneFormatted}</span>
                  </a>
                  <span className="text-xs text-gray-500 mt-1">{content.site.header.phoneSubtext}</span>
                </div>
                <div className="flex flex-col items-center">
                  <Link href={`/${getTranslatedSlug('quote', locale)}`} className="flex items-center justify-center gap-2 border border-orange-700 bg-orange-700 hover:bg-orange-800 hover:border-orange-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors w-44">
                    {nav.header.cta.quoteButton}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <span className="text-xs text-gray-500 mt-1">{content.site.header.quoteSubtext}</span>
                </div>
              </div>
            </nav>

            {/* Mobile/tablet: buttons + hamburger */}
            <div className="flex xl:hidden items-center space-x-3">
              <a href={`tel:${phoneTel}`} aria-label={ui.buttons.callAriaLabel} className="hidden md:flex items-center justify-center space-x-2 border border-orange-700 text-orange-700 hover:bg-orange-700 hover:text-white font-semibold py-3 px-4 rounded-lg transition-colors">
                <PhoneIcon className="w-4 h-4" />
                <span>{phoneFormatted}</span>
              </a>
              <Link href={`/${getTranslatedSlug('quote', locale)}`} className="hidden md:flex items-center justify-center gap-2 border border-orange-700 bg-orange-700 hover:bg-orange-800 hover:border-orange-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors">
                {nav.header.cta.quoteButton}
                <ArrowRight className="w-4 h-4" />
              </Link>
              <MobileMenu nav={nav} services={services} cities={cities} locale={locale} phoneTel={phoneTel} phoneFormatted={phoneFormatted} callAriaLabel={ui.buttons.callAriaLabel} />
            </div>
          </div>
        </div>
      </header>
    </>
  )
}
