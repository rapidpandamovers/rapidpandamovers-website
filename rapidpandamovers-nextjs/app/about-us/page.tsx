import content from '../../data/content.json'
import Hero from '../components/Hero'
import StatisticSection from '../components/StatisticSection'
import AboutSection from '../components/AboutSection'
import LocationSection from '../components/LocationSection'
import QuoteSection from '../components/QuoteSection'

export const metadata = {
  title: content.about.meta.title,
  description: content.about.meta.description,
}

export default function AboutPage() {
  const { reviews } = content

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero
        title="About Rapid Panda Moving"
        description="Welcome to Rapid Panda Movers, where every move we make is guided by a commitment to excellence and a dedication to serving our community."
        cta="Get Your Free Quote"
      />

      <AboutSection variant="detail" />

      <StatisticSection stats={reviews.stats} />

      <LocationSection
        title="Areas We Serve"
        description="Rapid Panda Movers proudly serves all of Miami-Dade County and beyond"
      />

      {/* CTA Section */}
      <QuoteSection
        title="Ready to Experience the Rapid Panda Difference?"
        subtitle="Contact us today to learn more about how we can make your next move smooth and stress-free."
      />
    </div>
  )
}
