'use client'

import { Link } from '@/i18n/routing'
import { useState, useMemo } from 'react'
import { Star, Quote, ChevronLeft, ChevronRight, BadgeCheck, ChevronDown, ChevronUp } from 'lucide-react'
import reviewsData from '@/data/reviews.json'
import { useMessages, useLocale } from 'next-intl'
import { getTranslatedSlug } from '@/i18n/slug-map'
import type { Locale } from '@/i18n/config'
import Hero from '@/app/components/Hero'
import { PlatformIcon } from '@/app/components/ReviewSection'

export const REVIEWS_PER_PAGE = 9
const TRUNCATE_LENGTH = 200 // Characters before showing "Read more"

interface ReviewsListPageProps {
  currentPage: number
  platform?: string | null
}

export default function ReviewsListPage({ currentPage, platform }: ReviewsListPageProps) {
  const { content, ui } = useMessages() as any
  const locale = useLocale()
  const dateLocale = locale === 'es' ? 'es-US' : 'en-US'
  const { reviews: reviewsContent } = content

  // Get all reviews sorted by ID descending (newest first)
  const allReviews = useMemo(() => {
    let reviews = reviewsData.reviews

    // Filter by platform if selected
    if (platform) {
      reviews = reviews.filter(r => r.platform === platform)
    }

    // Sort by ID descending (newest first)
    return [...reviews].sort((a, b) => parseInt(b.id) - parseInt(a.id))
  }, [platform])

  // Get unique platforms
  const availablePlatforms = useMemo(() => {
    const platforms = new Set(reviewsData.reviews.map(r => r.platform))
    return Array.from(platforms)
  }, [])

  // Pagination logic
  const totalPages = Math.ceil(allReviews.length / REVIEWS_PER_PAGE)
  const startIndex = (currentPage - 1) * REVIEWS_PER_PAGE
  const paginatedReviews = allReviews.slice(startIndex, startIndex + REVIEWS_PER_PAGE)

  // Generate page URL
  const reviewsSlug = getTranslatedSlug('reviews', locale as Locale)
  const pageSlug = getTranslatedSlug('page', locale as Locale)
  const getPageUrl = (page: number) => {
    if (platform) {
      if (page === 1) return `/${reviewsSlug}/${encodeURIComponent(platform)}`
      return `/${reviewsSlug}/${encodeURIComponent(platform)}/${pageSlug}/${page}`
    }
    if (page === 1) return `/${reviewsSlug}`
    return `/${reviewsSlug}/${pageSlug}/${page}`
  }

  // Generate pagination numbers (same logic as blog)
  const getPaginationNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = []
    const edgeCount = 2
    const surroundCount = 1

    const showEllipsisStart = currentPage > edgeCount + surroundCount + 1
    const showEllipsisEnd = currentPage < totalPages - edgeCount - surroundCount

    // Always show first edgeCount pages
    for (let i = 1; i <= Math.min(edgeCount, totalPages); i++) {
      pages.push(i)
    }

    // Show ellipsis if needed
    if (showEllipsisStart) {
      pages.push('...')
    }

    // Show pages around current
    for (let i = Math.max(edgeCount + 1, currentPage - surroundCount); i <= Math.min(totalPages - edgeCount, currentPage + surroundCount); i++) {
      if (!pages.includes(i)) pages.push(i)
    }

    // Show ellipsis if needed
    if (showEllipsisEnd) {
      pages.push('...')
    }

    // Always show last edgeCount pages
    for (let i = Math.max(totalPages - edgeCount + 1, edgeCount + 1); i <= totalPages; i++) {
      if (!pages.includes(i)) pages.push(i)
    }

    return pages
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(dateLocale, { month: 'short', year: 'numeric' })
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero
        title={reviewsContent.title}
        description={reviewsContent.description}
        cta={reviewsContent.hero.cta}
      />

      {/* Reviews Section */}
      <section className="pt-20">
        <div className="container mx-auto">

          {/* Platform Filter */}
          <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-10">
            <Link
              href={`/${reviewsSlug}`}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                !platform
                  ? 'bg-orange-600 text-white text-shadow-sm'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {ui.review.allReviews}
            </Link>
            {availablePlatforms.map((p) => (
              <Link
                key={p}
                href={`/${reviewsSlug}/${p}`}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
                  platform === p
                    ? 'bg-orange-600 text-white text-shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <PlatformIcon platform={p} />
                {reviewsData.platforms[p as keyof typeof reviewsData.platforms]?.name || p.charAt(0).toUpperCase() + p.slice(1)}
              </Link>
            ))}
          </div>

          {/* Reviews Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {paginatedReviews.map((review) => (
              <ReviewCard key={review.id} review={review} formatDate={formatDate} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <>
              <div className="flex items-center justify-center gap-2 mt-12">
                {currentPage > 1 ? (
                  <Link
                    href={getPageUrl(currentPage - 1)}
                    className="flex items-center px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-orange-50 hover:border-orange-600 hover:text-orange-600 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    {ui.pagination.previous}
                  </Link>
                ) : (
                  <span className="flex items-center px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-400 cursor-not-allowed opacity-50">
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    {ui.pagination.previous}
                  </span>
                )}

                <div className="flex items-center gap-1">
                  {getPaginationNumbers().map((page, idx) => (
                    typeof page === 'string' ? (
                      <span key={`ellipsis-${idx}`} className="w-10 h-10 flex items-center justify-center text-gray-500">
                        ...
                      </span>
                    ) : (
                      <Link
                        key={page}
                        href={getPageUrl(page)}
                        className={`w-10 h-10 flex items-center justify-center rounded-lg font-medium transition-colors ${
                          currentPage === page
                            ? 'bg-orange-600 text-white text-shadow-sm'
                            : 'bg-white border border-gray-300 text-gray-700 hover:bg-orange-50 hover:border-orange-600 hover:text-orange-600'
                        }`}
                      >
                        {page}
                      </Link>
                    )
                  ))}
                </div>

                {currentPage < totalPages ? (
                  <Link
                    href={getPageUrl(currentPage + 1)}
                    className="flex items-center px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-orange-50 hover:border-orange-600 hover:text-orange-600 transition-colors"
                  >
                    {ui.pagination.next}
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                ) : (
                  <span className="flex items-center px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-400 cursor-not-allowed opacity-50">
                    {ui.pagination.next}
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </span>
                )}
              </div>

              {/* Page indicator */}
              <p className="text-center text-gray-500 mt-4">
                {ui.pagination.pageIndicator.replace('{current}', String(currentPage)).replace('{total}', String(totalPages)).replace('{count}', String(allReviews.length)).replace('{itemType}', ui.review.itemType)}
              </p>
            </>
          )}
        </div>
      </section>

    </div>
  )
}

// Helper to get display text for a review based on locale
function getReviewText(review: typeof reviewsData.reviews[0], locale: string) {
  const translations = (review as any).translations
  if (locale !== 'en' && translations?.[locale]?.text) {
    return { displayText: translations[locale].text, isTranslated: true, originalText: review.text }
  }
  return { displayText: review.text, isTranslated: false, originalText: review.text }
}

// Review Card Component with expand/collapse
function ReviewCard({
  review,
  formatDate
}: {
  review: typeof reviewsData.reviews[0]
  formatDate: (date: string) => string
}) {
  const { ui } = useMessages() as any
  const locale = useLocale()
  const [isExpanded, setIsExpanded] = useState(false)
  const [showOriginal, setShowOriginal] = useState(false)
  const { displayText, isTranslated, originalText } = getReviewText(review, locale)
  const text = showOriginal ? originalText : displayText
  const needsTruncation = text.length > TRUNCATE_LENGTH

  return (
    <div className="bg-gray-50 rounded-4xl p-8 flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center text-white text-shadow-sm font-bold text-lg shadow-sm">
            {review.author.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-gray-900">{review.author}</h4>
              {review.verified && (
                <BadgeCheck className="w-4 h-4 text-orange-500" />
              )}
            </div>
            <p className="text-sm text-gray-500">{formatDate(review.date)}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 bg-white rounded-lg p-1.5">
          <PlatformIcon platform={review.platform} />
        </div>
      </div>

      {/* Rating */}
      <div className="flex items-center gap-1 mb-3">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < review.rating ? 'text-orange-600 fill-current' : 'text-gray-200'
            }`}
          />
        ))}
      </div>

      {/* Review Text */}
      <div className="flex-1">
        <Quote className="w-8 h-8 text-gray-300 mb-2" />
        <p className={`text-gray-700 leading-relaxed ${!isExpanded && needsTruncation ? 'line-clamp-4' : ''}`}>
          {text}
        </p>
        <div className="flex items-center gap-3 mt-2">
          {needsTruncation && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-orange-700 hover:text-orange-800 text-sm font-medium flex items-center gap-1 transition-colors"
            >
              {isExpanded ? (
                <>
                  {ui.buttons.showLess}
                  <ChevronUp className="w-4 h-4" />
                </>
              ) : (
                <>
                  {ui.buttons.readMore}
                  <ChevronDown className="w-4 h-4" />
                </>
              )}
            </button>
          )}
          {isTranslated && (
            <button
              onClick={() => setShowOriginal(!showOriginal)}
              className="text-gray-500 hover:text-gray-600 text-sm transition-colors"
            >
              {showOriginal ? ui.review.hideOriginal : ui.review.seeOriginal}
            </button>
          )}
        </div>
      </div>

      {/* Service/Location Tags */}
      {(review.services?.length > 0 || review.location?.city) && (
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
          {review.services?.map((svc: string, idx: number) => (
            <span key={idx} className="text-xs bg-orange-50 text-orange-700 px-2.5 py-1 rounded-full font-medium">
              {svc.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
            </span>
          ))}
          {review.location?.city && (
            <span className="text-xs bg-white text-gray-600 px-2.5 py-1 rounded-full font-medium">
              {review.location.city.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
