import { notFound } from 'next/navigation'
import Hero from '@/app/components/Hero'
import QuoteSection from '@/app/components/QuoteSection'
import WhySection from '@/app/components/WhySection'
import ServicesContent from '@/app/[locale]/services/ServicesContent'
import { getAllActiveCities, getNeighborhoodBySlug, titleCase } from '@/lib/data'
import { locales, type Locale } from '@/i18n/config'
import { getMessages, getLocale } from 'next-intl/server'
import { generatePageMetadata } from '@/lib/metadata'

export const dynamicParams = false;

export async function generateStaticParams() {
  const cities = getAllActiveCities()
  const locations = cities.map(city => ({ location: city.slug }))
  return locales.flatMap(locale => locations.map(l => ({ locale, ...l })))
}

export async function generateMetadata({ params }: { params: Promise<{ location: string }> }) {
  const { location } = await params
  const locale = await getLocale() as Locale
  const { ui } = (await getMessages()) as any
  const name = titleCase(location)

  return generatePageMetadata({
    title: `${ui.location.movingServicesIn.replace('{name}', name)} | Rapid Panda Movers`,
    description: ui.location.heroDescriptionCity.replace('{name}', name),
    path: `/services/${location}`,
    locale,
  })
}

export default async function ServicesLocationPage({ params }: { params: Promise<{ location: string }> }) {
  const { location } = await params
  const { content, ui } = (await getMessages()) as any

  // Validate location exists
  const cities = getAllActiveCities()
  const isCity = cities.some(c => c.slug === location)
  const isNeighborhood = !isCity && !!getNeighborhoodBySlug(location)

  if (!isCity && !isNeighborhood) {
    notFound()
  }

  const name = titleCase(location)

  return (
    <div className="min-h-screen">
      <Hero
        title={ui.location.movingServicesIn.replace('{name}', name)}
        description={ui.location.heroDescriptionCity.replace('{name}', name)}
        cta={content.services.hero.cta}
      />

      <ServicesContent locationSlug={location} />

      <WhySection />

      <QuoteSection
        title={content.services.locationQuote.title}
        subtitle={content.services.locationQuote.subtitle.replace('{name}', name)}
      />
    </div>
  )
}
