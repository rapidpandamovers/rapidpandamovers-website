import { getAllActiveCities, getNeighborhoodBySlug } from '@/lib/data'
import ServiceSection from '@/app/components/ServiceSection'

interface ServicesContentProps {
  locationSlug?: string
}

export default function ServicesContent({ locationSlug }: ServicesContentProps) {
  let location: { name: string; slug: string; parentCity?: { name: string; slug: string } } | undefined

  if (locationSlug) {
    // Check cities first
    const cities = getAllActiveCities()
    const city = cities.find(c => c.slug === locationSlug)
    if (city) {
      location = { name: city.name, slug: city.slug }
    } else {
      // Check neighborhoods
      const neighborhood = getNeighborhoodBySlug(locationSlug)
      if (neighborhood) {
        location = {
          name: neighborhood.name,
          slug: neighborhood.slug,
          parentCity: neighborhood.parentCity ? { name: neighborhood.parentCity.name, slug: neighborhood.parentCity.slug } : undefined,
        }
      }
    }
  }

  return (
    <ServiceSection
      variant="full"
      location={location}
      hideHeader
    />
  )
}
