import Hero from '@/app/components/Hero'
import QuoteSection from '@/app/components/QuoteSection'
import OverviewSection from '@/app/components/OverviewSection'
import WhySection from '@/app/components/WhySection'
import ServicesContent from './ServicesContent'
import { allContent } from '@/lib/data'
import { getMessages, getLocale } from 'next-intl/server'
import { generatePageMetadata } from '@/lib/metadata'
import type { Locale } from '@/i18n/config'

export async function generateMetadata() {
  const locale = await getLocale() as Locale
  const { meta } = (await getMessages()) as any
  return generatePageMetadata({
    title: meta.services.title,
    description: meta.services.description,
    path: meta.services.path,
    locale,
  })
}

export default async function ServicesPage() {
  const { content } = (await getMessages()) as any
  const servicesContent = (allContent as any).services

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero
        title={content.services.hero.title}
        description={content.services.hero.description}
        cta={content.services.hero.cta}
      />

      {/* Content Section */}
      {servicesContent?.content && (
        <OverviewSection
          title={<>About Our <span className="text-orange-600">Moving Services</span></>}
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
        title={content.services.quote.title}
        subtitle={content.services.quote.subtitle}
      />
    </div>
  )
}
