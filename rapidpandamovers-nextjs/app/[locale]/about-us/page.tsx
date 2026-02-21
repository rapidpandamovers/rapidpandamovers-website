import { getMessages, getLocale } from 'next-intl/server'
import Hero from '@/app/components/Hero'
import StatisticSection from '@/app/components/StatisticSection'
import AboutSection from '@/app/components/AboutSection'
import LocationSection from '@/app/components/LocationSection'
import QuoteSection from '@/app/components/QuoteSection'
import { generatePageMetadata } from '@/lib/metadata'
import type { Locale } from '@/i18n/config'

export async function generateMetadata() {
  const locale = await getLocale() as Locale
  const { meta } = (await getMessages()) as any
  return generatePageMetadata({
    title: meta.about.title,
    description: meta.about.description,
    path: meta.about.path,
    locale,
  })
}

export default async function AboutPage() {
  const { content } = (await getMessages()) as any
  const { reviews } = content

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero
        title={content.about.hero.title}
        description={content.about.hero.description}
        cta={content.about.hero.cta}
      />

      <AboutSection variant="detail" />

      <StatisticSection stats={reviews.stats} />

      <LocationSection
        title={content.about.locationSection.title}
        description={content.about.locationSection.description}
      />

      {/* CTA Section */}
      <QuoteSection
        title={content.about.quote.title}
        subtitle={content.about.quote.subtitle}
      />
    </div>
  )
}
