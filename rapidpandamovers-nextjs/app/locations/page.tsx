import { allContent } from '@/lib/data'
import Hero from '@/app/components/Hero'
import QuoteSection from '@/app/components/QuoteSection'
import ContentSection from '@/app/components/ContentSection'
import LocationSection from '@/app/components/LocationSection'

export default function LocationsPage() {
  const content = allContent
  const serviceAreas = content.contact.service_areas
  const locationsContent = (content as any).locations

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero
        title={serviceAreas.title}
        description={serviceAreas.description}
        cta="Get Your Free Quote"
      />

      {/* Content Section */}
      {locationsContent?.content && (
        <ContentSection content={locationsContent.content} />
      )}

      {/* Service Locations */}
      <LocationSection />

      {/* CTA Section */}
      <QuoteSection
        title="Ready to Move in Miami-Dade?"
        subtitle="Contact us today for your free moving quote. We serve all areas of Miami-Dade County."
      />
    </div>
  )
}
