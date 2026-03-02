'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, MapPin, ExternalLink } from 'lucide-react'
import { useMessages } from 'next-intl'
import { H2, H3 } from '@/app/components/Heading'

export interface Sight {
  name: string
  slug: string
  description: string
  image: string
  address?: string
  website?: string
  category?: string
}

interface SightSectionProps {
  title?: string
  subtitle?: string
  sights: Sight[]
  locationName?: string
  className?: string
  showArrows?: boolean
  maxItems?: number
}

export default function SightSection({
  title,
  subtitle,
  sights,
  locationName,
  className = '',
  showArrows = true,
  maxItems,
}: SightSectionProps) {
  const { ui } = useMessages() as any
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 320
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  const displaySights = maxItems ? sights.slice(0, maxItems) : sights

  if (displaySights.length === 0) {
    return null
  }

  const defaultTitle = locationName
    ? ui.sights.popularSightsIn.replace('{name}', locationName)
    : ui.sights.popularSightsDefault

  const defaultSubtitle = locationName
    ? ui.sights.exploreIn.replace('{name}', locationName)
    : ui.sights.exploreDefault

  const getCategoryColor = (category?: string) => {
    switch (category) {
      case 'landmark': return 'bg-blue-500'
      case 'park': return 'bg-green-500'
      case 'museum': return 'bg-purple-500'
      case 'entertainment': return 'bg-pink-500'
      case 'shopping': return 'bg-yellow-500'
      case 'dining': return 'bg-red-500'
      case 'beach': return 'bg-cyan-500'
      case 'nature': return 'bg-emerald-500'
      default: return 'bg-gray-500'
    }
  }

  const getCategoryLabel = (category?: string) => {
    if (!category) return null
    return category.charAt(0).toUpperCase() + category.slice(1)
  }

  return (
    <section className={`pt-20 ${className}`}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10 px-6 md:px-0">
          <H2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            {title || defaultTitle}
          </H2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {subtitle || defaultSubtitle}
          </p>
        </div>

        {/* Cards Container */}
        <div className="relative">
          {/* Navigation Arrows */}
          {showArrows && displaySights.length > 4 && (
            <>
              <button
                onClick={() => scroll('left')}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white hover:bg-gray-100 rounded-full flex items-center justify-center shadow-lg transition-all -translate-x-1/2 hidden md:flex"
              >
                <ChevronLeft className="w-6 h-6 text-gray-800" />
              </button>
              <button
                onClick={() => scroll('right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white hover:bg-gray-100 rounded-full flex items-center justify-center shadow-lg transition-all translate-x-1/2 hidden md:flex"
              >
                <ChevronRight className="w-6 h-6 text-gray-800" />
              </button>
            </>
          )}

          {/* Scrollable Cards */}
          <div
            ref={scrollRef}
            className="flex gap-6 pb-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {displaySights.map((sight, index) => (
              <div
                key={index}
                className="group flex-shrink-0 snap-start w-72 md:w-80"
              >
                {/* Card */}
                <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow h-full">
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={sight.image}
                      alt={sight.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {/* Category Badge */}
                    {sight.category && (
                      <div className={`absolute top-3 left-3 ${getCategoryColor(sight.category)} text-white text-xs font-medium px-2 py-1 rounded-full`}>
                        {getCategoryLabel(sight.category)}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <H3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-orange-700 transition-colors">
                      {sight.name}
                    </H3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {sight.description}
                    </p>

                    {/* Address */}
                    {sight.address && (
                      <div className="flex items-start text-gray-500 text-sm mb-3">
                        <MapPin className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0" />
                        <span className="line-clamp-1">{sight.address}</span>
                      </div>
                    )}

                    {/* Website Link */}
                    {sight.website && (
                      <a
                        href={sight.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-orange-700 hover:text-orange-800 text-sm font-medium transition-colors"
                      >
                        {ui.buttons.learnMore}
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
