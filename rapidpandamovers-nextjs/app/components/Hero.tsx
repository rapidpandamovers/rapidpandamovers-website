'use client'

import { Star } from 'lucide-react'
import { useState, useEffect } from 'react'
import { preload } from 'react-dom'
import { Link } from '@/i18n/routing'
import { useMessages, useLocale } from 'next-intl'
import { getTranslatedSlug } from '@/i18n/slug-map'
import type { Locale } from '@/i18n/config'
import reviewsData from '@/data/reviews.json'
import { ImageCollage } from './ImageCollage'
import { H1 } from '@/app/components/Heading'

// Default base paths (without extension) — resolved to WebP/JPG at the right size
const DEFAULT_IMAGES: [string, string, string] = ['/images/hero/1', '/images/hero/2', '/images/hero/3']
const RESPONSIVE_WIDTHS = [640, 960, 1280] as const

/** Pick the smallest responsive width that covers the viewport, or full-size */
function resolveImageUrl(basePath: string, viewportWidth: number): { webp: string; jpg: string } {
  const size = RESPONSIVE_WIDTHS.find(w => w >= viewportWidth)
  if (size) {
    return { webp: `${basePath}-${size}w.webp`, jpg: `${basePath}-${size}w.jpg` }
  }
  return { webp: `${basePath}.webp`, jpg: `${basePath}.jpg` }
}

interface HeroProps {
  title?: string
  description?: string
  cta?: string
  /** Base paths without extension, e.g. ['/images/hero/1', '/images/hero/2', '/images/hero/3'] */
  images?: [string, string, string]
  collageVariant?: 'default' | 'variant1' | 'variant2' | 'variant3' | 'variant4'
}

export default function Hero({
  title,
  description,
  cta,
  images = DEFAULT_IMAGES,
  collageVariant,
}: HeroProps = {}) {
  // SSR uses 960w (good balance); client upgrades if needed
  const [containerWidth, setContainerWidth] = useState(960)

  useEffect(() => {
    // The collage takes ~half the viewport on desktop, full on mobile
    const effective = window.innerWidth >= 1024 ? Math.round(window.innerWidth / 2) : window.innerWidth
    setContainerWidth(effective)
  }, [])

  const resolved = images.map(img => resolveImageUrl(img, containerWidth))

  // Preload hero images as WebP with JPG fallback
  preload(resolved[2].webp, { as: 'image', fetchPriority: 'high' })
  preload(resolved[0].webp, { as: 'image' })
  preload(resolved[1].webp, { as: 'image' })

  const { ui } = useMessages() as any
  const locale = useLocale() as Locale
  const [pickupZip, setPickupZip] = useState('')
  const [dropoffZip, setDropoffZip] = useState('')

  // Use provided props with fallback defaults
  const displayTitle = title || ui.hero.defaultTitle
  const displayDescription = description || ui.hero.defaultDescription
  const displayCta = cta || ui.hero.defaultCta


  // Build quote URL with zip codes
  const quoteSlug = getTranslatedSlug('quote', locale)
  const quoteUrl = `/${quoteSlug}${pickupZip || dropoffZip ? '?' : ''}${pickupZip ? `pickup=${encodeURIComponent(pickupZip)}` : ''}${pickupZip && dropoffZip ? '&' : ''}${dropoffZip ? `dropoff=${encodeURIComponent(dropoffZip)}` : ''}`
  return (
    <section className="pt-2 px-4 md:px-6 lg:px-8 relative">
      <div className="container mx-auto rounded-4xl border border-gray-700 bg-black p-6 md:p-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left side - Image */}
          <div className="relative aspect-[4/3]">
            <ImageCollage
              slot1Src={resolved[0].webp}
              slot1Fallback={resolved[0].jpg}
              slot2Src={resolved[1].webp}
              slot2Fallback={resolved[1].jpg}
              slot3Src={resolved[2].webp}
              slot3Fallback={resolved[2].jpg}
              variant={collageVariant}
              alt={{
                slot1: ui.images?.heroCollage?.slot1 ?? "Professional movers carefully wrapping items for safe transport",
                slot2: ui.images?.heroCollage?.slot2 ?? "Rapid Panda Movers providing service to a customer",
                slot3: ui.images?.heroCollage?.slot3 ?? "Rapid Panda Movers team standing next to a moving truck",
              }}
            />
          </div>
          
          {/* Right side - Content */}
          <div className="space-y-6">
            <div>
              <H1 className="font-display text-4xl md:text-5xl text-white mb-4 font-black tracking-tight">
                {displayTitle}
              </H1>
              <p className="text-xl text-white mb-8">
                {displayDescription}
              </p>
            </div>
            
            {/* Quote form */}
            <div className="space-y-4">
              <p className="text-white font-medium">{displayCta}</p>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder={ui.forms.hero.pickupPlaceholder}
                  value={pickupZip}
                  onChange={(e) => setPickupZip(e.target.value)}
                  className="px-4 py-3 bg-gray-800 border border-gray-600 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder={ui.forms.hero.dropoffPlaceholder}
                  value={dropoffZip}
                  onChange={(e) => setDropoffZip(e.target.value)}
                  className="px-4 py-3 bg-gray-800 border border-gray-600 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <Link
                href={quoteUrl}
                className="block w-full bg-orange-600 text-white text-shadow-sm font-bold py-3 px-6 rounded-lg hover:bg-orange-700 transition-colors text-center"
              >
                {ui.buttons.getFreeQuote}
              </Link>
            </div>
            
            {/* Rating display */}
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-orange-600 fill-current" />
                ))}
              </div>
              <span className="text-white">{reviewsData.stats.averageRating}{ui.hero.ratingText.replace('{count}', String(reviewsData.stats.totalReviews))}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}