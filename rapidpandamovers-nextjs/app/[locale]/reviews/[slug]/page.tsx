import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ReviewsListPage from '../ReviewsListPage'
import QuoteSection from '@/app/components/QuoteSection'
import reviewsData from '@/data/reviews.json'
import { locales, type Locale } from '@/i18n/config'
import { getMessages, getLocale } from 'next-intl/server'
import { generatePageMetadata } from '@/lib/metadata'

export async function generateStaticParams() {
  const platforms = new Set(reviewsData.reviews.map(r => r.platform))
  const slugs = Array.from(platforms).map((platform) => ({
    slug: platform,
  }))
  return locales.flatMap(locale => slugs.map(s => ({ locale, ...s })))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const locale = await getLocale() as Locale
  const platformName = reviewsData.platforms[slug as keyof typeof reviewsData.platforms]?.name || slug.charAt(0).toUpperCase() + slug.slice(1)

  return generatePageMetadata({
    title: `${platformName} Reviews | Rapid Panda Movers`,
    description: `Read real ${platformName} reviews from our satisfied customers. See why Miami trusts Rapid Panda Movers for their moves.`,
    path: `/reviews/${slug}`,
    locale,
  })
}

export default async function ReviewsPlatformPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const { content } = (await getMessages()) as any

  // Validate platform exists
  const validPlatforms = new Set(reviewsData.reviews.map(r => r.platform))
  if (!validPlatforms.has(slug)) {
    notFound()
  }

  return (
    <>
      <ReviewsListPage currentPage={1} platform={slug} />
      <QuoteSection
        title={content.reviews.quote.title}
        subtitle={content.reviews.quote.subtitle}
      />
    </>
  )
}
