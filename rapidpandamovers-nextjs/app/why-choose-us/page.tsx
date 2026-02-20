import Link from 'next/link'
import Hero from '../components/Hero'
import IncludedSection from '../components/IncludedSection'
import PromiseSection from '../components/PromiseSection'
import WhySection from '../components/WhySection'
import CompareTable from '../components/CompareTable'
import ReviewSection from '../components/ReviewSection'
import QuoteSection from '../components/QuoteSection'
import content from '@/data/content.json'

const pageData = content.why_choose_us

export const metadata = {
  title: pageData.meta.title,
  description: pageData.meta.description,
}

export default function WhyChooseUsPage() {
  return (
    <div className="min-h-screen">
      <Hero
        title={pageData.hero.title}
        description={pageData.hero.description}
        cta={pageData.hero.cta}
      />

      {/* Main Benefits */}
      <WhySection
        variant="detail"
        title="The Rapid Panda Difference"
        subtitle="We're not just another moving company. Here's what sets us apart and why thousands of Miami residents trust us with their moves."
        benefits={pageData.main_benefits}
      />

      {/* Our Promise */}
      <PromiseSection cards={pageData.promise_cards} />

      {/* Reviews */}
      <ReviewSection
        variant="compact"
        title="What Our Customers Say"
        subtitle="Real reviews from real customers"
      />

      {/* Additional Reasons */}
      <IncludedSection
        title="More Reasons to Trust Us"
        items={pageData.additional_reasons}
        background="gray"
      />

      {/* Comparison */}
      <CompareTable
        title={pageData.comparison.title}
        columns={pageData.comparison.columns}
        rows={pageData.comparison.rows}
      />

      {/* Compare Link */}
      <div className="text-center -mt-10 pt-20">
        <Link
          href="/compare"
          className="text-orange-500 hover:text-orange-600 font-medium inline-flex items-center"
        >
          See detailed comparisons with specific competitors →
        </Link>
      </div>

      

      {/* CTA */}
      <QuoteSection
        title="Ready to Experience the Difference?"
        subtitle="Join thousands of satisfied customers who chose Rapid Panda Movers for their Miami move."
      />
      
    </div>
  )
}
