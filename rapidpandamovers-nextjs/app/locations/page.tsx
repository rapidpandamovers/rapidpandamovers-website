import { allContent } from '@/lib/data'
import Hero from '@/app/components/Hero'
import QuoteSection from '@/app/components/QuoteSection'
import OverviewSection from '@/app/components/OverviewSection'
import LocationSection from '@/app/components/LocationSection'
import WhySection from '@/app/components/WhySection'
import contentData from '@/data/content.json'

export const metadata = {
  title: contentData.locations.meta.title,
  description: contentData.locations.meta.description,
}

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
        <OverviewSection title="Our Service Areas">
          <div className="text-gray-600 leading-relaxed space-y-4">
            {(Array.isArray(locationsContent.content) ? locationsContent.content : [locationsContent.content]).map((paragraph: string, index: number) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </OverviewSection>
      )}

      {/* Service Locations */}
      <LocationSection hideHeader />

      {/* Why Choose Us */}
      <WhySection variant="left" />

      {/* CTA Section */}
      <QuoteSection
        title="Ready to Move in Miami-Dade?"
        subtitle="Contact us today for your free moving quote. We serve all areas of Miami-Dade County."
      />
    </div>
  )
}
