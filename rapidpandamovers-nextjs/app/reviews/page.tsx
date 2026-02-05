import content from '../../data/content.json'
import Hero from '../components/Hero'
import ReviewSection from '../components/ReviewSection'
import ResourceSection from '../components/ResourceSection'
import QuoteSection from '../components/QuoteSection'

export default function ReviewsPage() {
  const { reviews } = content

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero
        title={reviews.title}
        description={reviews.description}
        cta="Get Your Free Quote"
      />

      {/* Reviews Section - Using ReviewSection Component */}
      <ReviewSection
        title="What Our Customers Say"
        subtitle="Real reviews from real customers who trusted Rapid Panda Movers with their most important move."
        limit={12}
        showPlatformFilter={true}
        showAllLink={false}
      />

      {/* Resources Section - Using ResourceSection Component */}
      <ResourceSection
        title="More Moving Resources"
        subtitle="Explore our comprehensive guides and services for a successful move"
        variant="grid"
      />

      {/* CTA Section */}
      <QuoteSection
        title="Join Our Satisfied Customers"
        subtitle="Experience the Rapid Panda difference. Get your free quote today and see why Miami trusts us with their moves."
      />
    </div>
  )
}
