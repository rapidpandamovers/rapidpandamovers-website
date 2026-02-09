'use client'

import { useState, useMemo, useEffect } from 'react'
import { Star, Quote, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, BadgeCheck } from 'lucide-react'
import Link from 'next/link'
import reviewsData from '@/data/reviews.json'

const TRUNCATE_LENGTH = 200 // Characters before showing "Read more"

interface ReviewSectionProps {
  // Filter options
  city?: string
  neighborhood?: string
  service?: string
  route?: string
  // Display options
  title?: string
  subtitle?: string
  limit?: number
  perPage?: number
  showPlatformFilter?: boolean
  showAllLink?: boolean
  showPagination?: boolean
  className?: string
  variant?: 'default' | 'compact' | 'carousel'
}

// Platform icons as simple SVG components
const PlatformIcon = ({ platform }: { platform: string }) => {
  switch (platform) {
    case 'google':
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
      )
    case 'yelp':
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#D32323">
          <path d="M20.16 12.594l-4.995 1.433c-.96.276-1.74-.8-1.176-1.63l2.905-4.308a1.072 1.072 0 0 1 1.596-.206 9.194 9.194 0 0 1 2.364 3.252 1.073 1.073 0 0 1-.694 1.459zm-3.984 5.838l-4.59-2.655a1.073 1.073 0 0 1 .063-1.89l4.59-2.655c.89-.515 1.89.29 1.628 1.31l-1.165 4.58c-.18.706-1.144.985-1.726.31zm-5.943-2.655l-4.59 2.655c-.89.515-1.89-.29-1.628-1.31l1.165-4.58c.18-.706 1.144-.985 1.726-.31l4.59 2.655c.963.557.89 1.947-.263 2.39zM5.17 12.594l4.995 1.433c.96.276 1.74-.8 1.176-1.63l-2.905-4.308a1.072 1.072 0 0 0-1.596-.206 9.194 9.194 0 0 0-2.364 3.252 1.073 1.073 0 0 0 .694 1.459zM12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z"/>
        </svg>
      )
    case 'facebook':
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#1877F2">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      )
    case 'trustpilot':
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#00B67A">
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
        </svg>
      )
    case 'bbb':
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#005A78">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
        </svg>
      )
    case 'thumbtack':
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#009FD9">
          <path d="M16 4a1 1 0 01.117 1.993L16 6H8a1 1 0 01-.117-1.993L8 4h8zm-3 4a1 1 0 011 1v5.586l3.707 3.707a1 1 0 01-1.414 1.414L12 15.414V9a1 1 0 011-1z"/>
          <circle cx="12" cy="12" r="10" fill="none" stroke="#009FD9" strokeWidth="2"/>
        </svg>
      )
    case 'consumeraffairs':
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#ED7430">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
        </svg>
      )
    case 'hireahelper':
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#00A3E0">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
      )
    case 'angi':
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#FF5722">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
        </svg>
      )
    case 'moverscom':
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#1E88E5">
          <path d="M18 18.5v-1a1 1 0 0 0-1-1h-1v-3a1 1 0 0 0-1-1H9v2h5v4H9v-3H6v3H3v-6H2L12 3l10 9h-1v6.5h-3z"/>
          <circle cx="9" cy="19" r="1.5"/>
          <circle cx="15" cy="19" r="1.5"/>
        </svg>
      )
    default:
      return null
  }
}

export default function ReviewSection({
  city,
  neighborhood,
  service,
  route,
  title,
  subtitle,
  limit = 6,
  perPage = 9,
  showPlatformFilter = false,
  showAllLink = true,
  showPagination = false,
  className = "",
  variant = 'default'
}: ReviewSectionProps) {
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)

  // Filter reviews based on props (without limit for pagination)
  const allFilteredReviews = useMemo(() => {
    let reviews = reviewsData.reviews

    // Filter by platform if selected
    if (selectedPlatform) {
      reviews = reviews.filter(r => r.platform === selectedPlatform)
    }

    // Filter by location
    if (city) {
      reviews = reviews.filter(r => r.location?.city === city)
    }
    if (neighborhood) {
      reviews = reviews.filter(r => r.location?.neighborhood === neighborhood)
    }

    // Filter by service (check if service is in the services array)
    if (service) {
      reviews = reviews.filter(r => (r.services as string[] | undefined)?.includes(service))
    }

    // Filter by route
    if (route) {
      reviews = reviews.filter(r => r.route === route)
    }

    // Sort by ID descending (newest first)
    reviews = [...reviews].sort((a, b) => parseInt(b.id) - parseInt(a.id))

    return reviews
  }, [city, neighborhood, service, route, selectedPlatform])

  // Calculate pagination
  const totalPages = showPagination ? Math.ceil(allFilteredReviews.length / perPage) : 1

  // Get reviews for current page
  const filteredReviews = useMemo(() => {
    if (showPagination) {
      const startIndex = (currentPage - 1) * perPage
      return allFilteredReviews.slice(startIndex, startIndex + perPage)
    }
    return allFilteredReviews.slice(0, limit)
  }, [allFilteredReviews, showPagination, currentPage, perPage, limit])

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [selectedPlatform])

  // Get unique platforms from filtered reviews for filter buttons
  const availablePlatforms = useMemo(() => {
    const platforms = new Set(reviewsData.reviews.map(r => r.platform))
    return Array.from(platforms)
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % Math.ceil(filteredReviews.length / 3))
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + Math.ceil(filteredReviews.length / 3)) % Math.ceil(filteredReviews.length / 3))
  }

  if (filteredReviews.length === 0) {
    return null
  }

  const hasHeader = title || subtitle

  return (
    <section className={`py-16 md:py-20 ${className}`}>
      <div className="container mx-auto px-4">
        {/* Header */}
        {hasHeader && (
          <div className="text-center mb-12">
            {title && (
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                {subtitle}
              </p>
            )}
          </div>
        )}

        {/* Platform Filter */}
        {showPlatformFilter && (
          <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-10">
            <button
              onClick={() => setSelectedPlatform(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedPlatform === null
                  ? 'bg-orange-500 text-white'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-orange-500 hover:text-orange-500'
              }`}
            >
              All Reviews
            </button>
            {availablePlatforms.map((platform) => (
              <button
                key={platform}
                onClick={() => setSelectedPlatform(platform)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
                  selectedPlatform === platform
                    ? 'bg-orange-500 text-white'
                    : 'bg-white text-gray-700 border border-gray-200 hover:border-orange-500 hover:text-orange-500'
                }`}
              >
                <PlatformIcon platform={platform} />
                {reviewsData.platforms[platform as keyof typeof reviewsData.platforms]?.name}
              </button>
            ))}
          </div>
        )}

        {/* Reviews Grid */}
        {variant === 'carousel' ? (
          <div className="relative">
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {filteredReviews.map((review) => (
                  <div key={review.id} className="w-full md:w-1/3 flex-shrink-0 px-3">
                    <ReviewCard review={review} formatDate={formatDate} />
                  </div>
                ))}
              </div>
            </div>
            {filteredReviews.length > 3 && (
              <>
                <button
                  onClick={prevSlide}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-full shadow-lg transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-full shadow-lg transition-colors"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>
        ) : (
          <div className={`grid gap-6 ${
            variant === 'compact'
              ? 'grid-cols-1 md:grid-cols-2'
              : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
          }`}>
            {filteredReviews.map((review) => (
              <ReviewCard key={review.id} review={review} formatDate={formatDate} compact={variant === 'compact'} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {showPagination && totalPages > 1 && (
          <>
            <div className="flex items-center justify-center gap-2 mt-12">
              {/* Previous Button */}
              {currentPage > 1 ? (
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  className="flex items-center px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-orange-50 hover:border-orange-500 hover:text-orange-500 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Previous
                </button>
              ) : (
                <span className="flex items-center px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-400 cursor-not-allowed opacity-50">
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Previous
                </span>
              )}

              {/* Page Numbers */}
              <div className="flex items-center gap-1">
                {(() => {
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

                  return pages.map((page, idx) => (
                    typeof page === 'string' ? (
                      <span key={`ellipsis-${idx}`} className="w-10 h-10 flex items-center justify-center text-gray-500">
                        ...
                      </span>
                    ) : (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-10 h-10 flex items-center justify-center rounded-lg font-medium transition-colors ${
                          currentPage === page
                            ? 'bg-orange-500 text-white'
                            : 'bg-white border border-gray-300 text-gray-700 hover:bg-orange-50 hover:border-orange-500 hover:text-orange-500'
                        }`}
                      >
                        {page}
                      </button>
                    )
                  ))
                })()}
              </div>

              {/* Next Button */}
              {currentPage < totalPages ? (
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  className="flex items-center px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-orange-50 hover:border-orange-500 hover:text-orange-500 transition-colors"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              ) : (
                <span className="flex items-center px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-400 cursor-not-allowed opacity-50">
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </span>
              )}
            </div>

            {/* Page indicator */}
            <p className="text-center text-gray-500 mt-4">
              Page {currentPage} of {totalPages} ({allFilteredReviews.length} reviews)
            </p>
          </>
        )}

        {/* View All Link */}
        {showAllLink && !showPagination && (
          <div className="text-center mt-12">
            <Link
              href="/reviews"
              className="inline-flex items-center bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
            >
              View All Reviews
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}

// Review Card Component with expand/collapse
function ReviewCard({
  review,
  formatDate,
  compact = false
}: {
  review: typeof reviewsData.reviews[0]
  formatDate: (date: string) => string
  compact?: boolean
}) {
  const [isExpanded, setIsExpanded] = useState(false)
  const needsTruncation = review.text.length > TRUNCATE_LENGTH

  return (
    <div className={`bg-white rounded-2xl p-6 flex flex-col shadow-sm border border-gray-100 hover:shadow-md transition-shadow ${compact ? 'p-5' : ''}`}>
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
        <div className="flex items-center gap-1 bg-gray-50 rounded-lg p-1.5">
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
        <Quote className="w-8 h-8 text-orange-100 mb-2" />
        <p className={`text-gray-700 leading-relaxed ${compact ? 'text-sm line-clamp-3' : ''} ${!compact && !isExpanded && needsTruncation ? 'line-clamp-4' : ''}`}>
          {review.text}
        </p>
        {!compact && needsTruncation && (
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
            <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full font-medium">
              {review.location.city.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
