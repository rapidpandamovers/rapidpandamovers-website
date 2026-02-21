import ReviewsListPage from './ReviewsListPage'
import QuoteSection from '@/app/components/QuoteSection'
import { ReviewSchema } from '@/app/components/Schema'
import reviewsData from '@/data/reviews.json'
import { getMessages, getLocale } from 'next-intl/server'
import { generatePageMetadata } from '@/lib/metadata'
import type { Locale } from '@/i18n/config'

export async function generateMetadata() {
  const locale = await getLocale() as Locale
  const { meta } = (await getMessages()) as any
  return generatePageMetadata({
    title: meta.reviews.title,
    description: meta.reviews.description,
    path: meta.reviews.path,
    locale,
  })
}

export default async function ReviewsPage() {
  const locale = await getLocale() as Locale
  const { content } = (await getMessages()) as any

  return (
    <>
      <ReviewSchema
        ratingValue={reviewsData.stats.averageRating.toString()}
        reviewCount={reviewsData.stats.totalReviews.toString()}
        locale={locale}
      />
      <ReviewsListPage currentPage={1} />
      <QuoteSection
        title={content.reviews.quote.title}
        subtitle={content.reviews.quote.subtitle}
      />
    </>
  )
}
