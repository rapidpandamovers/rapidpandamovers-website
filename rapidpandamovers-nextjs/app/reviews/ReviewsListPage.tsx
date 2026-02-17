'use client'

import Link from 'next/link'
import { useState, useMemo } from 'react'
import { Star, Quote, ChevronLeft, ChevronRight, BadgeCheck, ChevronDown, ChevronUp } from 'lucide-react'
import reviewsData from '@/data/reviews.json'
import content from '@/data/content.json'
import Hero from '../components/Hero'
import QuoteSection from '../components/QuoteSection'
import { PlatformIcon } from '../components/ReviewSection'

export const REVIEWS_PER_PAGE = 9
const TRUNCATE_LENGTH = 200 // Characters before showing "Read more"

interface ReviewsListPageProps {
  currentPage: number
  platform?: string | null
}

export default function ReviewsListPage({ currentPage, platform }: ReviewsListPageProps) {
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
  const getPageUrl = (page: number) => {
    if (platform) {
      if (page === 1) return `/reviews/${encodeURIComponent(platform)}`
      return `/reviews/${encodeURIComponent(platform)}/page/${page}`
    }
    if (page === 1) return '/reviews'
    return `/reviews/page/${page}`
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
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero
        title={reviewsContent.title}
        description={reviewsContent.description}
        cta="Get Your Free Quote"
      />

      {/* Reviews Section */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto">

          {/* Platform Filter */}
          <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-10">
            <Link
              href="/reviews"
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                !platform
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Reviews
            </Link>
            {availablePlatforms.map((p) => (
              <Link
                key={p}
                href={`/reviews/${p}`}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
                  platform === p
                    ? 'bg-orange-500 text-white'
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
                    className="flex items-center px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-orange-50 hover:border-orange-500 hover:text-orange-500 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Previous
                  </Link>
                ) : (
                  <span className="flex items-center px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-400 cursor-not-allowed opacity-50">
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Previous
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
                            ? 'bg-orange-500 text-white'
                            : 'bg-white border border-gray-300 text-gray-700 hover:bg-orange-50 hover:border-orange-500 hover:text-orange-500'
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
                    className="flex items-center px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-orange-50 hover:border-orange-500 hover:text-orange-500 transition-colors"
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                ) : (
                  <span className="flex items-center px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-400 cursor-not-allowed opacity-50">
                    Next
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </span>
                )}
              </div>

              {/* Page indicator */}
              <p className="text-center text-gray-500 mt-4">
                Page {currentPage} of {totalPages} ({allReviews.length} reviews)
              </p>
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <QuoteSection
        title="Join Our Satisfied Customers"
        subtitle="Experience the Rapid Panda difference. Get your free quote today and see why Miami trusts us with their moves."
      />
    </div>
  )
}

// Review Card Component with expand/collapse
function ReviewCard({
  review,
  formatDate
}: {
  review: typeof reviewsData.reviews[0]
  formatDate: (date: string) => string
}) {
  const [isExpanded, setIsExpanded] = useState(false)
  const needsTruncation = review.text.length > TRUNCATE_LENGTH

  return (
    <div className="bg-gray-50 rounded-4xl p-8 flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-sm">
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
              i < review.rating ? 'text-orange-500 fill-current' : 'text-gray-200'
            }`}
          />
        ))}
      </div>

      {/* Review Text */}
      <div className="flex-1">
        <Quote className="w-8 h-8 text-gray-300 mb-2" />
        <p className={`text-gray-700 leading-relaxed ${!isExpanded && needsTruncation ? 'line-clamp-4' : ''}`}>
          {review.text}
        </p>
        {needsTruncation && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-2 text-orange-500 hover:text-orange-600 text-sm font-medium flex items-center gap-1 transition-colors"
          >
            {isExpanded ? (
              <>
                Show less
                <ChevronUp className="w-4 h-4" />
              </>
            ) : (
              <>
                Read more
                <ChevronDown className="w-4 h-4" />
              </>
            )}
          </button>
        )}
      </div>

      {/* Service/Location Tags */}
      {(review.services?.length > 0 || review.location?.city) && (
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
          {review.services?.map((svc: string, idx: number) => (
            <span key={idx} className="text-xs bg-orange-50 text-orange-600 px-2.5 py-1 rounded-full font-medium">
              {svc.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
            </span>
          ))}
          {review.location?.city && (
            <span className="text-xs bg-white text-gray-600 px-2.5 py-1 rounded-full font-medium">
              {review.location.city.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
