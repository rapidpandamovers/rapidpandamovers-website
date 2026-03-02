import { notFound, redirect } from 'next/navigation'
import ReviewsListPage, { REVIEWS_PER_PAGE } from '../../../ReviewsListPage'
import QuoteSection from '@/app/components/QuoteSection'
import Hero from '@/app/components/Hero'
import reviewsData from '@/data/reviews.json'
import { locales } from '@/i18n/config'
import { getMessages, getLocale } from 'next-intl/server'
import { generatePageMetadata } from '@/lib/metadata'
import type { Locale } from '@/i18n/config'
import type { Metadata } from 'next'

export async function generateStaticParams() {
  const platforms = Array.from(new Set(reviewsData.reviews.map(r => r.platform)))
  const params: { slug: string; page: string }[] = []

  for (const platform of platforms) {
    const platformReviews = reviewsData.reviews.filter(r => r.platform === platform)
    const totalPages = Math.ceil(platformReviews.length / REVIEWS_PER_PAGE)
    for (let p = 2; p <= totalPages; p++) {
      params.push({ slug: platform, page: String(p) })
    }
  }

  return locales.flatMap(locale => params.map(p => ({ locale, ...p })))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; page: string }>
}): Promise<Metadata> {
  const { slug, page } = await params
  const platformName = reviewsData.platforms[slug as keyof typeof reviewsData.platforms]?.name || slug.charAt(0).toUpperCase() + slug.slice(1)
  const pageNum = parseInt(page, 10)
  const locale = await getLocale() as Locale

  return generatePageMetadata({
    title: `${platformName} Reviews - Page ${pageNum} | Rapid Panda Movers`,
    description: `${platformName} reviews - Page ${pageNum}. Read real reviews from our satisfied customers.`,
    path: `/reviews/${slug}/page/${pageNum}`,
    locale,
    noIndex: true,
  })
}

export default async function ReviewsPlatformPaginatedPage({
  params,
}: {
  params: Promise<{ slug: string; page: string }>
}) {
  const { slug, page } = await params
  const pageNum = parseInt(page, 10)
  const { content } = (await getMessages()) as any

  // Validate platform exists
  const validPlatforms = new Set(reviewsData.reviews.map(r => r.platform))
  if (!validPlatforms.has(slug)) {
    notFound()
  }

  // Redirect page 1 to canonical URL
  if (pageNum === 1) {
    redirect(`/reviews/${encodeURIComponent(slug)}`)
  }

  // Validate page number
  const platformReviews = reviewsData.reviews.filter(r => r.platform === slug)
  const totalPages = Math.ceil(platformReviews.length / REVIEWS_PER_PAGE)

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
      <ReviewsListPage currentPage={pageNum} platform={slug} />
      <QuoteSection
        title={content.reviews.quote.title}
        subtitle={content.reviews.quote.subtitle}
      />
    </>
  )
}
