'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { allServices, getAllActiveCities } from '@/lib/data'
import ServiceIllustration from '../components/ServiceIllustration'

export default function ServicesContent() {
  const searchParams = useSearchParams()
  const locationSlug = searchParams.get('location')

  // Find the location if provided
  const cities = getAllActiveCities()
  const location = locationSlug ? cities.find(c => c.slug === locationSlug) : null

  const activeServices = allServices.filter(service => service.is_active !== false)

  return (
    <section className="py-0">
      <div className="container mx-auto">
        {/* Location filter indicator */}
        {location && (
          <div className="mb-8 flex items-center justify-between">
            <p className="text-lg text-gray-600">
              Showing services available in <span className="font-semibold text-orange-500">{location.name}</span>
            </p>
            <Link
              href="/services"
              className="text-orange-500 hover:text-orange-600 font-medium text-sm"
            >
              View All Locations →
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activeServices.map((service, index) => (
            <Link
              key={index}
              href={location ? `/${location.slug}-${service.slug}` : `/${service.slug}`}
              className="bg-white rounded-xl p-6 border-2 border-orange-500 hover:bg-orange-500 transition-all group"
            >
              <div className="flex justify-center mb-4">
                <ServiceIllustration service={service.slug} className="w-24 h-24" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-white transition-colors text-center">
                {location ? `${location.name} ${service.name}` : service.name}
              </h3>
              <p className="text-gray-600 mb-4 group-hover:text-white transition-colors text-center">{service.description}</p>
              <div className="text-orange-600 group-hover:text-white font-medium flex items-center justify-center transition-colors">
                Learn More
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
