'use client'

import { useState } from 'react'
function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
    </svg>
  )
}
import { Link } from '@/i18n/routing'
import { getTranslatedSlug } from '@/i18n/slug-map'
import type { Locale } from '@/i18n/config'

interface HeroQuoteFormProps {
  locale: Locale
  ctaText: string
  pickupPlaceholder: string
  dropoffPlaceholder: string
  buttonText: string
  phone: string
  callAriaLabel: string
}

export default function HeroQuoteForm({
  locale,
  ctaText,
  pickupPlaceholder,
  dropoffPlaceholder,
  buttonText,
  phone,
  callAriaLabel,
}: HeroQuoteFormProps) {
  const [pickupZip, setPickupZip] = useState('')
  const [dropoffZip, setDropoffZip] = useState('')

  const quoteSlug = getTranslatedSlug('quote', locale)
  const quoteUrl = `/${quoteSlug}${pickupZip || dropoffZip ? '?' : ''}${pickupZip ? `pickup=${encodeURIComponent(pickupZip)}` : ''}${pickupZip && dropoffZip ? '&' : ''}${dropoffZip ? `dropoff=${encodeURIComponent(dropoffZip)}` : ''}`

  return (
    <>
      {/* Mobile: Phone button + quote link */}
      <div className="md:hidden space-y-4">
        <a
          href={`tel:${phone.replace(/-/g, '')}`}
          aria-label={callAriaLabel}
          className="flex items-center justify-center space-x-2 w-full bg-white text-orange-700 font-bold py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <PhoneIcon className="w-5 h-5" />
          <span>{`(${phone.slice(0,3)}) ${phone.slice(4,7)}-${phone.slice(8)}`}</span>
        </a>
        <Link
          href={`/${quoteSlug}`}
          className="block w-full bg-orange-700 text-white font-bold py-3 px-6 rounded-lg hover:bg-orange-800 transition-colors text-center"
        >
          {buttonText}
        </Link>
      </div>

      {/* Desktop: Quote form with zip inputs */}
      <div className="hidden md:block space-y-4">
        <p className="text-white font-medium">{ctaText}</p>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder={pickupPlaceholder}
            value={pickupZip}
            onChange={(e) => setPickupZip(e.target.value)}
            className="px-4 py-3 bg-gray-800 border border-gray-600 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
          <input
            type="text"
            placeholder={dropoffPlaceholder}
            value={dropoffZip}
            onChange={(e) => setDropoffZip(e.target.value)}
            className="px-4 py-3 bg-gray-800 border border-gray-600 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
        <Link
          href={quoteUrl}
          className="block w-full bg-orange-700 text-white font-bold py-3 px-6 rounded-lg hover:bg-orange-800 transition-colors text-center"
        >
          {buttonText}
        </Link>
      </div>
    </>
  )
}
