import { preload } from 'react-dom'
import { getMessages, getLocale } from 'next-intl/server'
import type { Locale } from '@/i18n/config'
import reviewsData from '@/data/reviews.json'
import { ImageCollage } from './ImageCollage'
import { H1 } from '@/app/components/Heading'
import StarRating from '@/app/components/StarRating'
import HeroQuoteForm from './HeroQuoteForm'

// Default base paths (without extension) — resolved to WebP/JPG at the right size
const DEFAULT_IMAGES: [string, string, string] = ['/images/hero/1', '/images/hero/2', '/images/hero/3']

interface HeroProps {
  title?: string
  description?: string
  cta?: string
  /** Base paths without extension, e.g. ['/images/hero/1', '/images/hero/2', '/images/hero/3'] */
  images?: [string, string, string]
  collageVariant?: 'default' | 'variant1' | 'variant2' | 'variant3' | 'variant4'
}

export default async function Hero({
  title,
  description,
  cta,
  images = DEFAULT_IMAGES,
  collageVariant,
}: HeroProps = {}) {
  // Preload hero images at 960w (good SSR default) as WebP
  preload(`${images[2]}-960w.webp`, { as: 'image', fetchPriority: 'high' })
  preload(`${images[0]}-960w.webp`, { as: 'image' })
  preload(`${images[1]}-960w.webp`, { as: 'image' })

  const { ui, content } = (await getMessages()) as any
  const locale = (await getLocale()) as Locale

  // Use provided props with fallback defaults
  const displayTitle = title || ui.hero.defaultTitle
  const displayDescription = description || ui.hero.defaultDescription
  const displayCta = cta || ui.hero.defaultCta

  return (
    <section className="pt-2 md:px-6 lg:px-8 relative z-10">
      <div className="container mx-auto rounded-4xl border border-gray-700 bg-black p-6 md:p-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-16 items-center">
          {/* Left side - Image */}
          <div className="relative aspect-[4/3] order-last lg:order-first">
            <ImageCollage
              images={images}
              variant={collageVariant}
              containerLabel={ui.images?.heroCollageLabel}
              alt={{
                slot1: ui.images?.heroCollage?.slot1 ?? "Professional movers carefully wrapping items for safe transport",
                slot2: ui.images?.heroCollage?.slot2 ?? "Rapid Panda Movers providing service to a customer",
                slot3: ui.images?.heroCollage?.slot3 ?? "Rapid Panda Movers team standing next to a moving truck",
              }}
            />
          </div>

          {/* Right side - Content */}
          <div className="space-y-6">
            {/* Rating display — mobile only */}
            <div className="flex flex-col items-center md:hidden">
              <StarRating size="w-9 h-9" />
              <span className="text-white text-center mt-2">{reviewsData.stats.averageRating}{ui.hero.ratingText.replace('{count}', String(reviewsData.stats.totalReviews))}</span>
            </div>

            <div>
              <H1 className="font-display text-4xl md:text-5xl text-white mb-4 font-black leading-[1.15]">
                {displayTitle}
              </H1>
              <p className="text-xl text-white mb-8">
                {displayDescription}
              </p>
            </div>

            {/* Mobile + Desktop CTAs (client component) */}
            <HeroQuoteForm
              locale={locale}
              ctaText={displayCta}
              pickupPlaceholder={ui.forms.hero.pickupPlaceholder}
              dropoffPlaceholder={ui.forms.hero.dropoffPlaceholder}
              buttonText={ui.buttons.getFreeQuote}
              phone={content.site.phone}
            />

            {/* Rating display — desktop only */}
            <div className="hidden md:flex md:flex-row md:items-center md:space-x-2">
              <StarRating />
              <span className="text-white">{reviewsData.stats.averageRating}{ui.hero.ratingText.replace('{count}', String(reviewsData.stats.totalReviews))}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
