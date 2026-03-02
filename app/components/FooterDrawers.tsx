'use client'

import { useState, useEffect } from 'react'
import { Link, usePathname } from '@/i18n/routing'
function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m9 18 6-6-6-6"/>
    </svg>
  )
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m6 9 6 6 6-6"/>
    </svg>
  )
}

interface FooterDrawersProps {
  nav: any
  services: { slug: string; name: string }[]
  cities: { slug: string; name: string }[]
  locale: string
  contactInfo: {
    phoneTel: string
    phoneFormatted: string
    email: string
    addressLine1: string
    addressLine2: string
    hours: { label: string; time: string }[]
  }
  social: any[]
  comparisons: { slug: string; competitor: { name: string } }[]
  alternatives: { slug: string; alternative: { name: string } }[]
}

export default function FooterDrawers({
  nav,
  services,
  cities,
  locale,
  contactInfo,
  social,
  comparisons,
  alternatives,
}: FooterDrawersProps) {
  const [openSections, setOpenSections] = useState<Set<string>>(new Set())
  const pathname = usePathname()

  // Collapse all sections on route change
  useEffect(() => {
    setOpenSections(new Set())
  }, [pathname])

  function toggleSection(section: string) {
    setOpenSections((prev) => {
      const next = new Set(prev)
      if (next.has(section)) {
        next.delete(section)
      } else {
        next.add(section)
      }
      return next
    })
  }

  const nameTemplate = nav.footer.sections.locations.nameTemplate || '{name} Movers'

  return (
    <div>
      {/* Services */}
      <DrawerSection
        title={nav.footer.sections.services.title}
        isOpen={openSections.has('services')}
        onToggle={() => toggleSection('services')}
      >
        {services.map((service) => (
          <li key={service.slug}>
            <Link href={`/${service.slug}`} className="text-gray-400 hover:text-orange-700 transition-colors text-sm">
              {service.name}
            </Link>
          </li>
        ))}
      </DrawerSection>

      {/* Locations */}
      <DrawerSection
        title={nav.footer.sections.locations.title}
        isOpen={openSections.has('locations')}
        onToggle={() => toggleSection('locations')}
      >
        {cities.map((city) => (
          <li key={city.slug}>
            <Link href={`/${city.slug}-movers`} className="text-gray-400 hover:text-orange-700 transition-colors text-sm">
              {nameTemplate.replace('{name}', city.name)}
            </Link>
          </li>
        ))}
      </DrawerSection>

      {/* Resources */}
      <DrawerSection
        title={nav.footer.sections.resources.title}
        isOpen={openSections.has('resources')}
        onToggle={() => toggleSection('resources')}
      >
        {nav.footer.sections.resources.items.map((item: any) => (
          <li key={item.href}>
            <Link href={item.href} className="text-gray-400 hover:text-orange-700 transition-colors text-sm">
              {item.label}
            </Link>
          </li>
        ))}
      </DrawerSection>

      {/* Company */}
      <DrawerSection
        title={nav.footer.sections.company.title}
        isOpen={openSections.has('company')}
        onToggle={() => toggleSection('company')}
      >
        {nav.footer.sections.company.items.map((item: any) => (
          <li key={item.href}>
            <Link href={item.href} className="text-gray-400 hover:text-orange-700 transition-colors text-sm">
              {item.label}
            </Link>
          </li>
        ))}
      </DrawerSection>

      {/* Compare */}
      <DrawerSection
        title={nav.footer.sections.compare.title}
        isOpen={openSections.has('compare')}
        onToggle={() => toggleSection('compare')}
      >
        <li>
          <Link href="/compare" className="text-gray-400 hover:text-orange-700 transition-colors text-sm">
            {nav.footer.sections.compare.allLabel}
          </Link>
        </li>
        {comparisons.map((comparison) => (
          <li key={comparison.slug}>
            <Link href={`/compare/${comparison.slug}`} className="text-gray-400 hover:text-orange-700 transition-colors text-sm">
              {nav.footer.sections.compare.prefix} {comparison.competitor.name}
            </Link>
          </li>
        ))}
      </DrawerSection>

      {/* Alternatives */}
      <DrawerSection
        title={nav.footer.sections.alternatives.title}
        isOpen={openSections.has('alternatives')}
        onToggle={() => toggleSection('alternatives')}
      >
        <li>
          <Link href="/alternatives" className="text-gray-400 hover:text-orange-700 transition-colors text-sm">
            {nav.footer.sections.alternatives.allLabel}
          </Link>
        </li>
        {alternatives.map((alt) => (
          <li key={alt.slug}>
            <Link href={`/alternatives/${alt.slug}`} className="text-gray-400 hover:text-orange-700 transition-colors text-sm">
              {alt.alternative.name}
            </Link>
          </li>
        ))}
      </DrawerSection>

    </div>
  )
}

function DrawerSection({
  title,
  isOpen,
  onToggle,
  children,
}: {
  title: string
  isOpen: boolean
  onToggle: () => void
  children: React.ReactNode
}) {
  return (
    <div className="border-b border-gray-800">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full py-4 text-white font-bold text-base font-display"
      >
        <span>{title}</span>
        {isOpen ? (
          <ChevronDownIcon className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronRightIcon className="w-5 h-5 text-gray-400" />
        )}
      </button>
      <div
        className={`overflow-hidden transition-all duration-200 ${
          isOpen ? 'max-h-[2000px] pb-4' : 'max-h-0'
        }`}
      >
        <ul className="space-y-2">{children}</ul>
      </div>
    </div>
  )
}
