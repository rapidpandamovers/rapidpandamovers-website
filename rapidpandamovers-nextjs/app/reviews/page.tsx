import { Metadata } from 'next'
import ReviewsListPage from './ReviewsListPage'

export const metadata: Metadata = {
  title: 'Customer Reviews | Rapid Panda Movers',
  description: 'Read real reviews from our satisfied customers. See why Miami trusts Rapid Panda Movers for their local and long-distance moves.',
}

export default function ReviewsPage() {
  return <ReviewsListPage currentPage={1} />
}
