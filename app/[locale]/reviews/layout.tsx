import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Customer Reviews',
  description: 'Read real reviews from satisfied customers. See why Miami trusts Rapid Panda Movers for their local and long-distance moves.',
}

// Aggregate rating structured data
const reviewsStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Rapid Panda Movers',
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    reviewCount: '9568',
    bestRating: '5',
    worstRating: '1',
  },
}

export default function ReviewsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(reviewsStructuredData),
        }}
      />
      {children}
    </>
  )
}
