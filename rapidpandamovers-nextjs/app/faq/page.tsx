import content from '../../data/content.json'
import Hero from '../components/Hero'
import FAQSection from '../components/FAQSection'
import ResourceSection from '../components/ResourceSection'
import QuoteSection from '../components/QuoteSection'

export default function FAQPage() {
  return (
    <div className="min-h-screen">
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
        showContactCTA={true}
      />

      {/* Additional Resources */}
      <ResourceSection
        title="More Moving Resources"
        subtitle="Explore our comprehensive guides and tips for a successful move"
        variant="grid"
      />

      {/* CTA Section */}
      <QuoteSection
        title="Ready to Start Your Move?"
        subtitle="Get a free, no-obligation quote from Miami's trusted moving professionals."
      />
    </div>
  )
}
