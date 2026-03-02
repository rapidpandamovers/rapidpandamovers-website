import { getMessages } from 'next-intl/server'
import { H2 } from '@/app/components/Heading'
import StarRating from '@/app/components/StarRating'
import { PlatformIcon } from '@/app/components/ReviewSection'
import reviewsData from '@/data/reviews.json'

interface RatingSectionProps {
  title?: string
  className?: string
}

export default async function RatingSection({
  title,
  className = ''
}: RatingSectionProps) {
  const { ui } = (await getMessages()) as any
  const platforms = reviewsData.platforms as Record<string, { name: string; rating: number | string; reviewCount: number; color: string }>

  // Top 2 non-BBB platforms by reviewCount, then BBB always last
  const topPlatforms = Object.entries(platforms)
    .filter(([key, p]) => key !== 'bbb' && typeof p.rating === 'number' && p.rating >= 4.0 && p.reviewCount > 0)
    .sort(([, a], [, b]) => b.reviewCount - a.reviewCount)
    .slice(0, 2)
  const bbb = platforms.bbb ? (['bbb', platforms.bbb] as [string, typeof platforms[string]]) : null
  const ratings = bbb ? [...topPlatforms, bbb] : topPlatforms

  title = title ?? ui.ratings.defaultTitle

  return (
    <section className={`-mt-8 relative ${className}`}>
      <div className="container mx-auto">
        <div className="bg-gray-100 rounded-b-4xl px-6 pt-14 pb-6 md:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* Title */}
          <H2 className="text-xl md:text-[1.35rem] font-bold text-gray-900 lg:flex-shrink-0">
            {title}
          </H2>

          {/* Ratings */}
          <div className="grid grid-cols-3 gap-2 md:flex md:flex-wrap md:gap-4">
            {ratings.map(([key, platform]) => (
              <div
                key={key}
                className="flex items-center justify-center gap-2 md:gap-3 bg-white border border-gray-200 rounded-xl px-2 py-2 md:px-4 md:py-3"
              >
                {/* Platform Icon */}
                <div className="flex-shrink-0">
                  <PlatformIcon platform={key} size="w-6 h-6" />
                </div>

                {/* Rating Info */}
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-lg md:text-2xl font-bold text-gray-900">{String(platform.rating)}</span>
                    {platform.rating !== 'A+' && (
                      <StarRating size="w-3.5 h-3.5" className="hidden md:flex" />
                    )}
                  </div>
                </div>
              </div>
            ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
