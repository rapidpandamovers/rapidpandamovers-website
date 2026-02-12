'use client'

import { useSearchParams } from 'next/navigation'
import { getAllActiveCities } from '@/lib/data'
import ServiceSection from '../components/ServiceSection'

export default function ServicesContent() {
  const searchParams = useSearchParams()
  const locationSlug = searchParams.get('location')

  const cities = getAllActiveCities()
  const location = locationSlug ? cities.find(c => c.slug === locationSlug) : undefined

  return (
    <ServiceSection
      variant="full"
      location={location ? { name: location.name, slug: location.slug } : undefined}
      hideHeader
    />
  )
}
