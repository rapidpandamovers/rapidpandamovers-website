'use client'

import { useState, useMemo, useEffect } from 'react'
import { Quote, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, BadgeCheck, MessageSquare, ArrowRight } from 'lucide-react'
import StarRating from '@/app/components/StarRating'
import { H2, H3 } from '@/app/components/Heading'
import { Link } from '@/i18n/routing'
import { useMessages, useLocale } from 'next-intl'
import { getTranslatedSlug } from '@/i18n/slug-map'
import type { Locale } from '@/i18n/config'

const TRUNCATE_LENGTH = 200 // Characters before showing "Read more"

const PLATFORM_NAMES: Record<string, string> = {
  google: 'Google', yelp: 'Yelp', facebook: 'Facebook', trustpilot: 'Trustpilot',
  thumbtack: 'Thumbtack', consumeraffairs: 'ConsumerAffairs', hireahelper: 'HireAHelper',
  angi: 'Angi', moverscom: 'Movers.com', bbb: 'BBB',
}

export type Review = {
  id: string
  author: string
  rating: number
  text: string
  date: string
  platform: string
  verified: boolean
  location?: any
  services?: any
  route?: any
  translations?: any
}

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
  variant?: 'default' | 'compact' | 'carousel' | 'left'
  // Reviews data — pass from server to avoid bundling full dataset in client JS
  reviews?: Review[]
  platforms?: string[]
  minRating?: number
}

// Platform icons as simple SVG components
export const PlatformIcon = ({ platform, size = 'w-5 h-5' }: { platform: string; size?: string }) => {
  switch (platform) {
    case 'google':
      return (
        <svg viewBox="0 0 24 24" className={size} fill="currentColor">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
      )
    case 'yelp':
      return (
        <svg viewBox="0 0 24 24" className={size} fill="#D32323">
          <path d="m7.6885 15.1415-3.6715.8483c-.3769.0871-.755.183-1.1452.155-.2611-.0188-.5122-.0414-.7606-.213a1.179 1.179 0 0 1-.331-.3594c-.3486-.5519-.3656-1.3661-.3697-2.0004a6.2874 6.2874 0 0 1 .3314-2.0642 1.857 1.857 0 0 1 .1073-.2474 2.3426 2.3426 0 0 1 .1255-.2165 2.4572 2.4572 0 0 1 .1563-.1975 1.1736 1.1736 0 0 1 .399-.2831 1.082 1.082 0 0 1 .4592-.0837c.2355.0016.5139.052.91.1734.0555.0191.1237.0382.1856.0572.3277.1013.7048.2404 1.1499.3987.6863.2404 1.3663.487 2.0463.7397l1.2117.4423c.2217.0807.4363.18.6412.297.174.0984.3273.2298.4512.387a1.217 1.217 0 0 1 .192.4309 1.2205 1.2205 0 0 1-.872 1.4522c-.0468.0151-.0852.0239-.1085.0293l-1.105.2553-.0031-.001zM18.8208 7.565a1.8506 1.8506 0 0 0-.2042-.1754 2.4082 2.4082 0 0 0-.2077-.1394 2.3607 2.3607 0 0 0-.2269-.109 1.1705 1.1705 0 0 0-.482-.0796 1.0862 1.0862 0 0 0-.4498.1263c-.2107.1048-.4388.2732-.742.5551-.042.0417-.0947.0886-.142.133-.2502.2351-.5286.5252-.8599.863a114.6363 114.6363 0 0 0-1.5166 1.5629l-.8962.9293a4.1897 4.1897 0 0 0-.4466.5483 1.541 1.541 0 0 0-.2364.5459 1.2199 1.2199 0 0 0 .0107.4518l.0046.02a1.218 1.218 0 0 0 1.4184.923 1.162 1.162 0 0 0 .1105-.0213l4.7781-1.104c.3766-.087.7587-.1667 1.097-.3631.2269-.1316.4428-.262.5909-.5252a1.1793 1.1793 0 0 0 .1405-.4683c.0733-.6512-.2668-1.3908-.5403-1.963a6.2792 6.2792 0 0 0-1.2001-1.7103zM8.9703.0754a8.6724 8.6724 0 0 0-.83.1564c-.2754.066-.548.1383-.8146.2236-.868.2844-2.0884.8063-2.295 1.8065-.1165.5655.1595 1.1439.3737 1.66.2595.6254.614 1.1889.9373 1.7777.8543 1.5545 1.7245 3.0993 2.5922 4.6457.259.4617.5416 1.0464 1.043 1.2856a1.058 1.058 0 0 0 .1013.0383c.2248.0851.4699.1016.7041.0471a4.3015 4.3015 0 0 0 .0418-.0097 1.2136 1.2136 0 0 0 .5658-.3397 1.1033 1.1033 0 0 0 .079-.0822c.3463-.435.3454-1.0833.3764-1.6134.1042-1.771.2139-3.5423.3009-5.3142.0332-.6712.1055-1.3333.0655-2.0096-.0328-.5579-.0368-1.1984-.3891-1.6563-.6218-.8073-1.9476-.741-2.8523-.6158zm2.084 15.9505a1.1053 1.1053 0 0 0-1.2306-.4145 1.1398 1.1398 0 0 0-.1526.0633 1.4806 1.4806 0 0 0-.2171.1354c-.1992.1475-.3668.3392-.5196.5315-.0386.049-.074.1143-.12.1562l-.7686 1.0573a113.9168 113.9168 0 0 0-1.2913 1.789c-.278.3895-.5184.7184-.7083 1.0094-.036.0547-.0734.116-.1075.1647-.2277.3522-.3566.6092-.4228.8381a1.0945 1.0945 0 0 0-.046.4721c.0211.1655.0768.3246.1635.467.046.0715.0957.1406.1487.207a2.334 2.334 0 0 0 .1754.1825 1.843 1.843 0 0 0 .2108.1732c.5304.369 1.1112.6342 1.722.8391a6.0958 6.0958 0 0 0 1.5716.3004c.091.0046.1821.0025.2728-.006a2.3878 2.3878 0 0 0 .2506-.0351 2.3862 2.3862 0 0 0 .2447-.071 1.1927 1.1927 0 0 0 .4175-.2658c.1127-.113.1994-.249.2541-.3989.0889-.2214.1473-.5026.1857-.92.0034-.0593.0118-.1305.0177-.1958.0304-.3463.0443-.7531.0666-1.2315.0375-.7357.067-1.4681.0903-2.2026 0 0 .0495-1.3053.0494-1.306.0113-.3008.002-.6342-.0814-.9336a1.396 1.396 0 0 0-.1756-.4054zm8.6754 2.0439c-.1605-.176-.3878-.3514-.7462-.5682-.0518-.0288-.1124-.0674-.1684-.1009-.2985-.1795-.658-.3684-1.078-.5965a120.7615 120.7615 0 0 0-1.9427-1.042l-1.1515-.6107c-.0597-.0175-.1203-.0607-.1766-.0878-.2212-.1058-.4558-.2045-.6992-.2498a1.4915 1.4915 0 0 0-.2545-.0265 1.1527 1.1527 0 0 0-.1648.01 1.1077 1.1077 0 0 0-.9227.9133 1.4186 1.4186 0 0 0 .0159.439c.0563.3065.1932.6096.3346.875l.615 1.1526c.3422.65.6884 1.2963 1.0435 1.9406.229.4202.4196.7799.5982 1.078.0338.056.0721.1163.1011.1682.2173.3584.392.584.569.7458.1146.1107.252.195.4026.247.1583.0525.326.071.4919.0546a2.368 2.368 0 0 0 .251-.0435c.0817-.022.1622-.048.241-.0784a1.863 1.863 0 0 0 .2475-.1143 6.1018 6.1018 0 0 0 1.2818-.9597c.4596-.4522.8659-.9454 1.182-1.51.044-.08.0819-.163.1138-.2483a2.49 2.49 0 0 0 .0773-.2411c.0186-.083.033-.1669.0429-.2513a1.188 1.188 0 0 0-.0565-.491 1.0933 1.0933 0 0 0-.248-.4041z"/>
        </svg>
      )
    case 'facebook':
      return (
        <svg viewBox="0 0 24 24" className={size} fill="#1877F2">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      )
    case 'trustpilot':
      return (
        <svg viewBox="0 0 24 24" className={size} fill="#00B67A">
          <path d="M17.227 16.67l2.19 6.742-7.413-5.388 5.223-1.354zM24 9.31h-9.165L12.005.589l-2.84 8.723L0 9.3l7.422 5.397-2.84 8.714 7.422-5.388 4.583-3.326L24 9.311z"/>
        </svg>
      )
    case 'bbb':
      return (
        <svg viewBox="0 0 64 64" className={size} fill="#005A78">
          <g fillRule="evenodd" transform="matrix(1.4194,0,0,1.4194,-8.869,-7.742)">
            <path d="M28.572 5.568c-2.63 5.465-11.999 10.766-.446 19.19 3.185 2.363 8.527 3.801 5.802 9.371-.242.425.181.542.559.224 3.904-4.52 10.253-11.67 4.907-17.493-3.04-3.287-9.266-5.445-10.507-8.568-.24-.604.025-1.477.358-2.168.267-.64-.528-.81-.67-.558z"/>
            <path d="M23.173 24.485c-1.35 3.678-8.178 7.91.937 12.792 2.116 1.259 4.828 2.835 4.536 5.14-.113.294.152.335.354.097 3-3.452 5.26-8.362 1.58-11.67-1.921-1.862-6.472-2.877-6.961-6.055.111-.436-.382-.477-.448-.302z"/>
            <path d="M16.99 43.855h23.038v2.83H16.99z"/>
            <path d="m17.017 43.777-1.017 2.858 1.744.025zm22.991 0 1.017 2.858-1.744.025zm-18.16 2.147 1.699 4.621 9.987-.035 1.564-4.586z"/>
          </g>
        </svg>
      )
    case 'thumbtack':
      return (
        <svg viewBox="0 0 24 24" className={size} fill="#009FD9">
          <path d="M6.18 6.38h11.69v2.68H6.17zm7.27 3.8v3.14c0 3.23-.02 3.74-.14 4.36a7.95 7.95 0 0 1-1.3 2.87c-.03 0-.78-1.35-.9-1.62-.17-.4-.3-.8-.4-1.25l-.09-.41-.02-5.78.16-.2a3.3 3.3 0 0 1 2.44-1.1zM12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0Z"/>
        </svg>
      )
    case 'consumeraffairs':
      return (
        <svg viewBox="0 0 24 24" className={size} fill="#ED7430">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3.5c1.24 0 2.25 1.01 2.25 2.25S13.24 10 12 10s-2.25-1.01-2.25-2.25S10.76 5.5 12 5.5zM15 18H9v-1c0-1.1.9-2 2-2h2c1.1 0 2 .9 2 2v1zm-3-6.5c-1.93 0-3.5-.67-3.5-1.5S10.07 8.5 12 8.5s3.5.67 3.5 1.5S13.93 11.5 12 11.5z"/>
        </svg>
      )
    case 'hireahelper':
      return (
        <svg viewBox="0 0 24 24" className={size} fill="#00A3E0">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 2c4.42 0 8 3.58 8 8s-3.58 8-8 8-8-3.58-8-8 3.58-8 8-8zm-1 4v4H8l4 5 4-5h-3V8h-2z"/>
        </svg>
      )
    case 'angi':
      return (
        <svg viewBox="0 0 24 24" className={size} fill="#FF5722">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm.5 4h2l-4 12h-2l4-12z"/>
        </svg>
      )
    case 'moverscom':
      return (
        <svg viewBox="0 0 24 24" className={size} fill="#1E88E5">
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
  variant = 'default',
  reviews,
  platforms: platformsProp,
  minRating = 4,
}: ReviewSectionProps) {
  const { ui } = useMessages() as any
  const locale = useLocale()
  const dateLocale = locale === 'es' ? 'es-US' : 'en-US'
  const reviewsPath = `/${getTranslatedSlug('reviews', locale as Locale)}`
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)

  // Filter reviews based on props (without limit for pagination)
  const allFilteredReviews = useMemo(() => {
    let sourceReviews = reviews ?? []

    // Filter by minimum rating and require text
    sourceReviews = sourceReviews.filter(r => r.rating >= minRating && (r.text ?? '').trim() !== '')

    // Filter by platform if selected
    if (selectedPlatform) {
      sourceReviews = sourceReviews.filter(r => r.platform === selectedPlatform)
    }

    // Filter by location
    if (city) {
      sourceReviews = sourceReviews.filter(r => r.location?.city === city)
    }
    if (neighborhood) {
      sourceReviews = sourceReviews.filter(r => r.location?.neighborhood === neighborhood)
    }

    // Filter by service (check if service is in the services array)
    if (service) {
      sourceReviews = sourceReviews.filter(r => (r.services as string[] | undefined)?.includes(service))
    }

    // Filter by route
    if (route) {
      sourceReviews = sourceReviews.filter(r => r.route === route)
    }

    // Sort by ID descending (newest first)
    sourceReviews = [...sourceReviews].sort((a, b) => parseInt(b.id) - parseInt(a.id))

    return sourceReviews
  }, [reviews, city, neighborhood, service, route, selectedPlatform, minRating])

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
    setCurrentPage(1) // eslint-disable-line react-hooks/set-state-in-effect
  }, [selectedPlatform])

  // Get unique platforms from filtered reviews for filter buttons
  const availablePlatforms = useMemo(() => {
    const platforms = new Set(platformsProp ?? (reviews ?? []).map(r => r.platform))
    return Array.from(platforms)
  }, [platformsProp, reviews])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(dateLocale, { month: 'short', year: 'numeric' })
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

  // Compact variant: 3-column grid with 2 reviews + 1 orange CTA box
  if (variant === 'compact') {
    const compactReviews = filteredReviews.slice(0, 2)
    return (
      <section className={`pt-20 ${className}`}>
        <div className="container mx-auto">
          {hasHeader && (
            <div className="text-center mb-10 px-6 md:px-0">
              {title && (
                <H2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                  {title}
                </H2>
              )}
              {subtitle && (
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                  {subtitle}
                </p>
              )}
            </div>
          )}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {compactReviews.map((review) => (
              <div key={review.id} className="bg-gray-50 rounded-4xl p-6 md:p-8 flex flex-col">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-orange-700 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-sm">
                      {review.author.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-gray-900">{review.author}</p>
                        {review.verified && <BadgeCheck className="w-4 h-4 text-orange-700" />}
                      </div>
                      <p className="text-sm text-gray-500">{formatDate(review.date)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-white rounded-lg p-1.5">
                    <PlatformIcon platform={review.platform} />
                  </div>
                </div>
                <StarRating rating={review.rating} size="w-4 h-4" className="mb-3" />
                <div className="flex-1">
                  <Quote className="w-8 h-8 text-gray-300 mb-2" />
                  <p className="text-gray-700 leading-relaxed line-clamp-4">{getReviewText(review, locale).displayText}</p>
                </div>
              </div>
            ))}

            {/* CTA Box */}
            <div className="bg-orange-50 rounded-4xl p-6 md:p-8 flex flex-col">
              <div className="flex-1">
                <MessageSquare className="w-10 h-10 text-orange-700 mb-4" />
                <H3 className="text-2xl font-bold text-gray-800 mb-3">
                  {ui.review.ctaTitle}
                </H3>
                <p className="text-gray-600 mb-6">
                  {ui.review.ctaSubtitle}
                </p>
              </div>
              <Link
                href={reviewsPath}
                className="flex items-center justify-center gap-2 bg-orange-700 hover:bg-orange-800 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                {ui.buttons.viewAllReviews}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    )
  }

  // Left variant — left-aligned header with inline "View All" link
  if (variant === 'left') {
    return (
      <section className={`pt-20 ${className}`}>
        <div className="container mx-auto">
          {hasHeader && (
            <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10 px-6 md:px-0">
              <div>
                {title && (
                  <H2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                    {title}
                  </H2>
                )}
                {subtitle && (
                  <p className="text-lg text-gray-600">
                    {subtitle}
                  </p>
                )}
              </div>
              {showAllLink && (
                <Link
                  href={reviewsPath}
                  className="inline-flex items-center text-orange-700 hover:text-orange-800 font-semibold mt-4 md:mt-0"
                >
                  {ui.buttons.viewAllReviews}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              )}
            </div>
          )}

          <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {filteredReviews.map((review) => (
              <ReviewCard key={review.id} review={review} formatDate={formatDate} ui={ui} locale={locale} />
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className={`pt-20 ${className}`}>
      <div className="container mx-auto">
        {/* Header */}
        {hasHeader && (
          <div className="text-center mb-12 px-6 md:px-0">
            {title && (
              <H2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                {title}
              </H2>
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
                  ? 'bg-orange-700 text-white'
                  : 'bg-white text-gray-700 hover:bg-orange-50 hover:text-orange-700'
              }`}
            >
              {ui.review.allReviews}
            </button>
            {availablePlatforms.map((platform) => (
              <button
                key={platform}
                onClick={() => setSelectedPlatform(platform)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
                  selectedPlatform === platform
                    ? 'bg-orange-700 text-white'
                    : 'bg-white text-gray-700 hover:bg-orange-50 hover:text-orange-700'
                }`}
              >
                <PlatformIcon platform={platform} />
                {PLATFORM_NAMES[platform] || platform.charAt(0).toUpperCase() + platform.slice(1)}
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
                    <ReviewCard review={review} formatDate={formatDate} ui={ui} locale={locale} />
                  </div>
                ))}
              </div>
            </div>
            {filteredReviews.length > 3 && (
              <>
                <button
                  onClick={prevSlide}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-orange-700 hover:bg-orange-800 text-white p-2 rounded-full shadow-lg transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-orange-700 hover:bg-orange-800 text-white p-2 rounded-full shadow-lg transition-colors"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {filteredReviews.map((review) => (
              <ReviewCard key={review.id} review={review} formatDate={formatDate} ui={ui} locale={locale} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {showPagination && totalPages > 1 && (
          <>
            <div className="flex items-center justify-center gap-1 md:gap-2 mt-12">
              {/* Previous Button */}
              {currentPage > 1 ? (
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  className="flex items-center px-2 py-2 md:px-4 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-orange-50 hover:border-orange-700 hover:text-orange-700 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4 md:mr-1" />
                  <span className="hidden md:inline">{ui.pagination.previous}</span>
                </button>
              ) : (
                <span className="flex items-center px-2 py-2 md:px-4 rounded-lg border border-gray-300 bg-white text-gray-400 cursor-not-allowed opacity-50">
                  <ChevronLeft className="w-4 h-4 md:mr-1" />
                  <span className="hidden md:inline">{ui.pagination.previous}</span>
                </span>
              )}

              {/* Page Numbers */}
              <div className="flex items-center gap-1">
                {(() => {
                  const pages: (number | string)[] = []
                  const edgeCount = 1
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
                      <span key={`ellipsis-${idx}`} className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center text-gray-500 text-sm md:text-base">
                        ...
                      </span>
                    ) : (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-lg font-medium text-sm md:text-base transition-colors ${
                          currentPage === page
                            ? 'bg-orange-700 text-white'
                            : 'bg-white border border-gray-300 text-gray-700 hover:bg-orange-50 hover:border-orange-700 hover:text-orange-700'
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
                  className="flex items-center px-2 py-2 md:px-4 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-orange-50 hover:border-orange-700 hover:text-orange-700 transition-colors"
                >
                  <span className="hidden md:inline">{ui.pagination.next}</span>
                  <ChevronRight className="w-4 h-4 md:ml-1" />
                </button>
              ) : (
                <span className="flex items-center px-2 py-2 md:px-4 rounded-lg border border-gray-300 bg-white text-gray-400 cursor-not-allowed opacity-50">
                  <span className="hidden md:inline">{ui.pagination.next}</span>
                  <ChevronRight className="w-4 h-4 md:ml-1" />
                </span>
              )}
            </div>

            {/* Page indicator */}
            <p className="text-center text-gray-500 mt-4">
              {ui.pagination.pageIndicator.replace('{current}', String(currentPage)).replace('{total}', String(totalPages)).replace('{count}', String(allFilteredReviews.length)).replace('{itemType}', ui.review.itemType)}
            </p>
          </>
        )}

        {/* View All Link */}
        {showAllLink && !showPagination && (
          <div className="text-center mt-12">
            <Link
              href={reviewsPath}
              className="inline-flex items-center bg-orange-700 hover:bg-orange-800 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
            >
              {ui.review.viewAllReviews}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}

// Helper to get display text for a review based on locale
function getReviewText(review: Review, locale: string) {
  const translations = review.translations
  if (locale !== 'en' && translations?.[locale]?.text) {
    return { displayText: translations[locale].text, isTranslated: true, originalText: review.text }
  }
  return { displayText: review.text, isTranslated: false, originalText: review.text }
}

// Review Card Component with expand/collapse
function ReviewCard({
  review,
  formatDate,
  ui,
  locale,
}: {
  review: Review
  formatDate: (date: string) => string
  ui: any
  locale: string
}) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [showOriginal, setShowOriginal] = useState(false)
  const { displayText, isTranslated, originalText } = getReviewText(review, locale)
  const text = showOriginal ? originalText : displayText
  const needsTruncation = text.length > TRUNCATE_LENGTH

  return (
    <div className="bg-gray-50 rounded-4xl p-6 md:p-8 flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-orange-700 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-sm">
            {review.author.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-semibold text-gray-900">{review.author}</p>
              {review.verified && (
                <BadgeCheck className="w-4 h-4 text-orange-700" />
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
      <StarRating rating={review.rating} size="w-4 h-4" className="mb-3" />

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
