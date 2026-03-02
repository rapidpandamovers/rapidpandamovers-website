import Hero from '@/app/components/Hero'
import QuoteSection from '@/app/components/QuoteSection'
import OverviewSection from '@/app/components/OverviewSection'
import LocationSection from '@/app/components/LocationSection'
import WhySection from '@/app/components/WhySection'
import { getMessages, getLocale } from 'next-intl/server'
import { generatePageMetadata } from '@/lib/metadata'
import type { Locale } from '@/i18n/config'

export async function generateMetadata() {
  const locale = await getLocale() as Locale
  const { meta } = (await getMessages()) as any
  return generatePageMetadata({
    title: meta.locations.title,
    description: meta.locations.description,
    path: meta.locations.path,
    locale,
  })
}

export default async function LocationsPage() {
  const { content } = (await getMessages()) as any
  const serviceAreas = content.contact.service_areas
  const locationsContent = content.locations

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero
        title={serviceAreas.title}
        description={serviceAreas.description}
        cta={content.locations.hero.cta}
      />

      {/* Content Section */}
      {locationsContent?.content && (
        <OverviewSection title={content.locations.overviewSection.title}>
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
        title={content.locations.quote.title}
        subtitle={content.locations.quote.subtitle}
      />
    </div>
  )
}
