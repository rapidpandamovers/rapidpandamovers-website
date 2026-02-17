import type { Metadata } from 'next'
import content from '../../data/content.json'
import Hero from '../components/Hero'
import FAQSection from '../components/FAQSection'
import ResourceSection from '../components/ResourceSection'
import QuoteSection from '../components/QuoteSection'
import { FAQSchema } from '../components/Schema'
import { generatePageMetadata } from '../../lib/metadata'

export const metadata: Metadata = generatePageMetadata({
  title: 'Frequently Asked Questions | Rapid Panda Movers',
  description: 'Find answers to common questions about our moving services, pricing, insurance, and more. Get the information you need for a stress-free move.',
  path: '/faq',
})

export default function FAQPage() {
  return (
    <div className="min-h-screen">
      {/* Schema Markup */}
      <FAQSchema faqs={content.faq.questions} />

      {/* Hero Section */}
      <Hero
        title={content.faq.title}
        description={content.faq.description}
        cta="Get Your Free Quote"
      />

      {/* FAQ Section */}
      <FAQSection
        title=""
        faqs={content.faq.questions}
        showViewAllLink={false}
      />

      {/* Additional Resources */}
      <ResourceSection
        title="More Moving Resources"
        subtitle="Explore our comprehensive guides and tips for a successful move"
        variant="grid"
      />

      {/* CTA Section */}
      <QuoteSection
        title="Still Have Questions?"
        subtitle="Our team is here to help! Contact us for personalized assistance with your move."
      />
    </div>
  )
}
