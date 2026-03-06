import { notFound } from 'next/navigation'
import ReviewsListPage from '../../ReviewsListPage'
import QuoteSection from '@/app/components/QuoteSection'
import Hero from '@/app/components/Hero'
import reviewsData from '@/data/reviews.json'
import { locales } from '@/i18n/config'
import { getMessages, getLocale } from 'next-intl/server'
import { generatePageMetadata } from '@/lib/metadata'
import type { Locale } from '@/i18n/config'

const REVIEWS_PER_PAGE = 9

export const dynamicParams = false;

// Generate static params for all pages
export async function generateStaticParams() {
  const totalReviews = reviewsData.reviews.length
  const totalPages = Math.ceil(totalReviews / REVIEWS_PER_PAGE)

  // Generate pages 2 through totalPages (page 1 is handled by /reviews)
  const pages = Array.from({ length: totalPages - 1 }, (_, i) => ({
    page: String(i + 2),
  }))
  return locales.flatMap(locale => pages.map(p => ({ locale, ...p })))
}

export async function generateMetadata({ params }: { params: Promise<{ page: string }> }) {
  const { page } = await params
  const pageNum = parseInt(page, 10)
  const locale = await getLocale() as Locale

  return generatePageMetadata({
    title: `Customer Reviews - Page ${pageNum} | Rapid Panda Movers`,
    description: `Read real reviews from our satisfied customers - Page ${pageNum}. See why Miami trusts Rapid Panda Movers.`,
    path: `/reviews/page/${pageNum}`,
    locale,
    noIndex: true,
  })
}

export default async function ReviewsPaginatedPage({ params }: { params: Promise<{ page: string }> }) {
  const { page } = await params
  const pageNum = parseInt(page, 10)
  const { content } = (await getMessages()) as any

  // Validate page number
  const totalReviews = reviewsData.reviews.length
  const totalPages = Math.ceil(totalReviews / REVIEWS_PER_PAGE)

  if (isNaN(pageNum) || pageNum < 1 || pageNum > totalPages) {
    notFound()
  }

  return (
    <>
      <Hero
        title={content.reviews.title}
        description={content.reviews.description}
        cta={content.reviews.hero.cta}
      />
      <ReviewsListPage currentPage={pageNum} />
      <QuoteSection
        title={content.reviews.quote.title}
        subtitle={content.reviews.quote.subtitle}
      />
    </>
  )
}
