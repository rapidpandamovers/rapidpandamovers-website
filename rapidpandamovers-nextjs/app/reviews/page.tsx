import { Metadata } from 'next'
import ReviewsListPage from './ReviewsListPage'
import content from '@/data/content.json'

export const metadata: Metadata = {
  title: content.reviews.meta.title,
  description: content.reviews.meta.description,
}

export default function ReviewsPage() {
  return <ReviewsListPage currentPage={1} />
}
