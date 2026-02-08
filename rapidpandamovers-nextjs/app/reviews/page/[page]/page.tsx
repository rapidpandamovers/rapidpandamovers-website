import { notFound, redirect } from 'next/navigation'
import ReviewsListPage from '../../ReviewsListPage'
import reviewsData from '@/data/reviews.json'

const REVIEWS_PER_PAGE = 9

// Generate static params for all pages
export async function generateStaticParams() {
  const totalReviews = reviewsData.reviews.length
  const totalPages = Math.ceil(totalReviews / REVIEWS_PER_PAGE)

  // Generate pages 2 through totalPages (page 1 is handled by /reviews)
  return Array.from({ length: totalPages - 1 }, (_, i) => ({
    page: String(i + 2),
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ page: string }> }) {
  const { page } = await params
  const pageNum = parseInt(page, 10)

  return {
    title: `Customer Reviews - Page ${pageNum} | Rapid Panda Movers`,
    description: `Read real reviews from our satisfied customers - Page ${pageNum}. See why Miami trusts Rapid Panda Movers.`,
  }
}

export default async function ReviewsPaginatedPage({ params }: { params: Promise<{ page: string }> }) {
  const { page } = await params
  const pageNum = parseInt(page, 10)

  // Redirect page 1 to /reviews
  if (pageNum === 1) {
    redirect('/reviews')
  }

  // Validate page number
  const totalReviews = reviewsData.reviews.length
  const totalPages = Math.ceil(totalReviews / REVIEWS_PER_PAGE)

  if (isNaN(pageNum) || pageNum < 1 || pageNum > totalPages) {
    notFound()
  }

  return <ReviewsListPage currentPage={pageNum} />
}
