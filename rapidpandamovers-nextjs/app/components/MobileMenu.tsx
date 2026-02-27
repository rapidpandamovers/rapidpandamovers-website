'use client'

import { useState, useEffect } from 'react'
import { Link, usePathname, useRouter } from '@/i18n/routing'
import { useLocale } from 'next-intl'
import { Phone, X, ChevronDown, Globe } from 'lucide-react'
import { locales } from '@/i18n/config'
import type { Locale } from '@/i18n/config'
import { translatePathname } from '@/i18n/slug-map'
import { stripDiacritics } from '@/lib/strip-diacritics'

const languageNames: Record<string, string> = {
  en: 'English',
  es: 'Español',
}

interface MobileMenuProps {
  nav: any
  services: { slug: string; name: string }[]
  cities: { slug: string; name: string }[]
  locale: string
  phoneTel: string
  phoneFormatted: string
}

export default function MobileMenu({ nav, services, cities, locale, phoneTel, phoneFormatted }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [openSection, setOpenSection] = useState<string | null>(null)
  const pathname = usePathname()
  const router = useRouter()
  const currentLocale = useLocale()

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false)
    setOpenSection(null)
  }, [pathname])

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  function toggleSection(section: string) {
    setOpenSection(openSection === section ? null : section)
  }

  function onLanguageChange(nextLocale: string) {
    const translatedPath = translatePathname(pathname, currentLocale as Locale, nextLocale as Locale)
    router.replace(translatedPath, { locale: nextLocale })
    setIsOpen(false)
  }

  const nameTemplate = nav.header.locations.nameTemplate || '{name} Movers'

  return (
    <>
      {/* Hamburger / Close toggle */}
      <button onClick={() => setIsOpen(!isOpen)} className="p-2" aria-label={isOpen ? 'Close menu' : 'Open menu'}>
        {isOpen ? (
          <X className="w-8 h-8" />
        ) : (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {/* Menu overlay + card container */}
      <div
        className={`fixed inset-0 z-50 overflow-hidden transition-[visibility] duration-300 ${
          isOpen ? 'visible pointer-events-auto' : 'invisible pointer-events-none'
        }`}
      >
        {/* Backdrop (transparent, closes menu on tap) */}
        <div
          className="absolute inset-0"
          onClick={() => setIsOpen(false)}
        />

        {/* Card panel */}
        <div
          className={`absolute top-24 left-4 right-4 bg-white border-2 border-orange-600 rounded-4xl shadow-[0_8px_60px_-10px_rgba(0,0,0,0.4)] max-h-[calc(100dvh-7rem)] flex flex-col transform transition-all duration-300 ease-in-out ${
            isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
          }`}
        >
          {/* Scrollable content */}
          <div className="overflow-y-auto flex-1 min-h-0 px-6 pt-2 pb-6" onClick={(e) => {
            const target = e.target as HTMLElement
            if (target.closest('a')) setIsOpen(false)
          }}>
          {/* Home link */}
          <Link
            href="/"
            className="block py-3 px-3 -mx-3 text-gray-800 font-display font-semibold text-lg rounded-xl"
          >
            {stripDiacritics(nav.header.home.label)}
          </Link>

          {/* Services accordion */}
          <AccordionSection
            title={nav.header.services.label}
            isOpen={openSection === 'services'}
            onToggle={() => toggleSection('services')}
          >
            {services.map((service) => (
              <Link
                key={service.slug}
                href={`/${service.slug}`}
                className="block py-2.5 text-gray-600 hover:text-orange-600 transition-colors text-sm"
              >
                {service.name}
              </Link>
            ))}
          </AccordionSection>

          {/* Locations accordion */}
          <AccordionSection
            title={nav.header.locations.label}
            isOpen={openSection === 'locations'}
            onToggle={() => toggleSection('locations')}
          >
            {cities.map((city) => (
              <Link
                key={city.slug}
                href={`/${city.slug}-movers`}
                className="block py-2.5 text-gray-600 hover:text-orange-600 transition-colors text-sm"
              >
                {nameTemplate.replace('{name}', city.name)}
              </Link>
            ))}
          </AccordionSection>

          {/* Compare accordion */}
          <AccordionSection
            title={nav.header.compare.label}
            isOpen={openSection === 'compare'}
            onToggle={() => toggleSection('compare')}
          >
            {nav.header.compare.items.map((item: any) => (
              <Link
                key={item.href}
                href={item.href}
                className="block py-2.5 text-gray-600 hover:text-orange-600 transition-colors text-sm"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href={nav.header.compare.bottomLink.href}
              className="block py-2.5 text-gray-600 hover:text-orange-600 transition-colors text-sm"
            >
              {nav.header.compare.bottomLink.label}
            </Link>
          </AccordionSection>

          {/* Resources accordion */}
          <AccordionSection
            title={nav.header.resources.label}
            isOpen={openSection === 'resources'}
            onToggle={() => toggleSection('resources')}
          >
            {nav.header.resources.items.map((item: any) => (
              <Link
                key={item.href}
                href={item.href}
                className="block py-2.5 text-gray-600 hover:text-orange-600 transition-colors text-sm"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href={nav.header.resources.bottomLink.href}
              className="block py-2.5 text-gray-600 hover:text-orange-600 transition-colors text-sm"
            >
              {nav.header.resources.bottomLink.label}
            </Link>
          </AccordionSection>

          {/* Company accordion */}
          <AccordionSection
            title={nav.header.company.label}
            isOpen={openSection === 'company'}
            onToggle={() => toggleSection('company')}
          >
            {nav.header.company.items.map((item: any) => (
              <Link
                key={item.href}
                href={item.href}
                className="block py-2.5 text-gray-600 hover:text-orange-600 transition-colors text-sm"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href={nav.header.company.bottomLink.href}
              className="block py-2.5 text-gray-600 hover:text-orange-600 transition-colors text-sm"
            >
              {nav.header.company.bottomLink.label}
            </Link>
          </AccordionSection>

          {/* Language accordion */}
          <AccordionSection
            title={languageNames[currentLocale] ?? 'Language'}
            isOpen={openSection === 'language'}
            onToggle={() => toggleSection('language')}
            icon={<Globe className="w-5 h-5" />}
          >
            {locales.map((loc) => (
              <button
                key={loc}
                onClick={() => onLanguageChange(loc)}
                className="block py-2.5 text-gray-600 hover:text-orange-600 transition-colors text-sm"
              >
                {languageNames[loc]}
              </button>
            ))}
          </AccordionSection>

          {/* Phone + Quote buttons (visible on small screens) */}
          <div className="space-y-3 pt-4">
            <a
              href={`tel:${phoneTel}`}
              className="flex items-center justify-center space-x-2 border border-orange-600 bg-orange-600 hover:bg-orange-700 hover:border-orange-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors w-full text-shadow-sm"
            >
              <Phone className="w-4 h-4" />
              <span>{phoneFormatted}</span>
            </a>
            <Link
              href="/quote"
              className="flex items-center justify-center border border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white font-semibold py-3 px-4 rounded-lg transition-colors w-full"
            >
              {nav.header.cta.quoteButton}
            </Link>
          </div>
        </div>
        </div>
      </div>
    </>
  )
}

function AccordionSection({
  title,
  isOpen,
  onToggle,
  children,
  icon,
}: {
  title: string
  isOpen: boolean
  onToggle: () => void
  children: React.ReactNode
  icon?: React.ReactNode
}) {
  return (
    <div>
      <button
        onClick={onToggle}
        className={`flex items-center justify-between w-[calc(100%+1.5rem)] py-3 px-3 -mx-3 font-display font-semibold text-lg rounded-xl transition-colors duration-200 ${
          isOpen ? 'bg-orange-100 text-orange-600' : 'text-gray-800'
        }`}
      >
        <span className="flex items-center gap-2">{icon}{stripDiacritics(title)}</span>
        <ChevronDown
          className={`w-5 h-5 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-200 ${
          isOpen ? 'max-h-[2000px] pb-3' : 'max-h-0'
        }`}
      >
        <div className="pl-4 pt-2">{children}</div>
      </div>
    </div>
  )
}
