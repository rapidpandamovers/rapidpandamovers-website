import { Suspense } from 'react'
import Hero from '../components/Hero'
import QuoteSection from '../components/QuoteSection'
import ContentSection from '../components/ContentSection'
import WhySection from '../components/WhySection'
import ServicesContent from './ServicesContent'
import { allContent } from '@/lib/data'

export const metadata = {
  title: 'Professional Moving Services in Miami',
  description: 'Local moving, apartment moves, packing, long-distance, commercial, and storage solutions in Miami. Transparent pricing.',
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
        <ContentSection
          title="About Our"
          titleHighlight="Moving Services"
          description={servicesContent.content}
        />
      )}

      {/* Main Services */}
      <Suspense fallback={<div className="py-20 text-center">Loading services...</div>}>
        <ServicesContent />
      </Suspense>

      {/* Why Choose Us */}
      <WhySection />

      {/* CTA Section */}
      <QuoteSection
        title="Ready to Get Started?"
        subtitle="Contact us today for a free quote and discover how affordable professional moving can be."
      />
    </div>
  )
}