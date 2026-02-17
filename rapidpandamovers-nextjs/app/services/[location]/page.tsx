import { notFound } from 'next/navigation'
import Hero from '../../components/Hero'
import QuoteSection from '../../components/QuoteSection'
import WhySection from '../../components/WhySection'
import ServicesContent from '../ServicesContent'
import { getAllActiveCities, getNeighborhoodBySlug, titleCase } from '@/lib/data'

export async function generateStaticParams() {
  const cities = getAllActiveCities()
  return cities.map(city => ({ location: city.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ location: string }> }) {
  const { location } = await params
  const name = titleCase(location)

  return {
    title: `Moving Services in ${name} | Rapid Panda Movers`,
    description: `Professional moving services in ${name}. Local moving, packing, long-distance, and more. Get a free quote today.`,
  }
}

export default async function ServicesLocationPage({ params }: { params: Promise<{ location: string }> }) {
  const { location } = await params

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
        title={`Moving Services in ${name}`}
        description={`Professional moving services in ${name}. From local moves to long-distance relocations, we provide comprehensive solutions for your move.`}
        cta="Get Your Free Quote"
      />

      <ServicesContent locationSlug={location} />

      <WhySection />

      <QuoteSection
        title="Ready to Get Started?"
        subtitle={`Contact us today for a free quote for your ${name} move.`}
      />
    </div>
  )
}
