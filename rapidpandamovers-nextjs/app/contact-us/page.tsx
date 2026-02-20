import Hero from '../components/Hero'
import ContactSection from '../components/ContactSection'
import MapSection from '../components/MapSection'
import NewsletterSection from '../components/NewsletterSection'
import QuoteSection from '../components/QuoteSection'
import content from '@/data/content.json'

export const metadata = {
  title: content.contact.meta.title,
  description: content.contact.meta.description,
}

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      <Hero
        title="Contact Rapid Panda Movers"
        description="Ready to make your move? Get in touch with Miami's trusted moving professionals for a free quote and consultation."
        cta="Call (786) 585-4269"
      />

      <ContactSection />

      <MapSection
        location={{
          name: 'Rapid Panda Movers',
          address: '7001 North Waterway Dr #107',
          city: 'Miami',
          state: 'FL',
          zip: '33155'
        }}
        title="Our Location"
        height="450px"
      />

      <NewsletterSection />

      <QuoteSection />
    </div>
  )
}
