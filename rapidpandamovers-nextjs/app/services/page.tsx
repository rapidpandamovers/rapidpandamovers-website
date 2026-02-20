import Hero from '../components/Hero'
import QuoteSection from '../components/QuoteSection'
import OverviewSection from '../components/OverviewSection'
import WhySection from '../components/WhySection'
import ServicesContent from './ServicesContent'
import { allContent } from '@/lib/data'
import content from '@/data/content.json'

export const metadata = {
  title: content.services.meta.title,
  description: content.services.meta.description,
}

export default function ServicesPage() {
  const content = allContent
  const servicesContent = (content as any).services

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero
        title="Complete Moving Services in Miami"
        description="From local moves to long-distance relocations, packing to storage - we provide comprehensive moving services designed to make your relocation stress-free and affordable."
        cta="Get Your Free Quote"
      />

      {/* Content Section */}
      {servicesContent?.content && (
        <OverviewSection
          title={<>About Our <span className="text-orange-500">Moving Services</span></>}
        >
          <p className="text-gray-600 leading-relaxed">{servicesContent.content}</p>
        </OverviewSection>
      )}

      {/* Main Services */}
      <ServicesContent />

      {/* Why Choose Us */}
      <WhySection variant='left'/>

      {/* CTA Section */}
      <QuoteSection
        title="Ready to Get Started?"
        subtitle="Contact us today for a free quote and discover how affordable professional moving can be."
      />
    </div>
  )
}
