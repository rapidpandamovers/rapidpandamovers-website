import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ReviewsListPage from '../ReviewsListPage'
import reviewsData from '@/data/reviews.json'

export async function generateStaticParams() {
  const platforms = new Set(reviewsData.reviews.map(r => r.platform))
  return Array.from(platforms).map((platform) => ({
    slug: platform,
  }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const platformName = reviewsData.platforms[slug as keyof typeof reviewsData.platforms]?.name || slug.charAt(0).toUpperCase() + slug.slice(1)

  return {
    title: `${platformName} Reviews | Rapid Panda Movers`,
    description: `Read real ${platformName} reviews from our satisfied customers. See why Miami trusts Rapid Panda Movers for their moves.`,
  }
}

export default async function ReviewsPlatformPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  // Validate platform exists
  const validPlatforms = new Set(reviewsData.reviews.map(r => r.platform))
  if (!validPlatforms.has(slug)) {
    notFound()
  }

  return <ReviewsListPage currentPage={1} platform={slug} />
}
