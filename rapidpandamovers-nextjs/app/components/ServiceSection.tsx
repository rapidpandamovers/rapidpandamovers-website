import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { allServices } from '@/lib/data'
import ServiceIllustration from './ServiceIllustration'
import { ReactNode } from 'react'

interface ServiceSectionProps {
  // When location is provided, show services for that location
  location?: {
    name: string;
    slug: string;
    // If parentCity is present, this is a neighborhood
    parentCity?: {
      name: string;
      slug: string;
    };
  };
  // Show all services from data instead of hardcoded preview
  variant?: 'preview' | 'full';
  // Hide the section title and description
  hideHeader?: boolean;
  // Exclude a specific service (useful for "related services" on service pages)
  excludeService?: string;
  // Custom title override (can be string or JSX)
  title?: ReactNode;
  // Custom subtitle override
  subtitle?: string;
}

export default function ServiceSection({ location, variant = 'preview', hideHeader = false, excludeService, title, subtitle }: ServiceSectionProps = {}) {
  // If location is provided, show location-specific services
  if (location) {
    const isNeighborhood = !!location.parentCity;
    const activeServices = allServices
      .filter(service => service.is_active !== false)
      .filter(service => !excludeService || service.slug !== excludeService)
      .slice(0, 6);

    const defaultTitle = isNeighborhood ? 'Our' : 'Moving';
    const defaultSubtitle = isNeighborhood
      ? 'Professional moving services tailored to your needs'
      : 'We offer a complete range of moving services to meet all your relocation needs';

    return (
      <section className="py-20">
        <div className="container mx-auto">
          {!hideHeader && (
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                {title || <>{defaultTitle} <span className="text-orange-500">Services</span> in {location.name}</>}
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {subtitle || defaultSubtitle}
              </p>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {activeServices.map((service, index) => (
              <Link
                key={index}
                href={`/${location.slug}-${service.slug}`}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:border-orange-500 hover:shadow-md transition-all group"
              >
                <div className="flex justify-center mb-4">
                  <ServiceIllustration service={service.slug} className="w-20 h-20" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-orange-500 transition-colors text-center">
                  {service.name}
                </h3>
                <p className="text-gray-600 mb-4 text-sm text-center">{service.description}</p>
                <div className="text-orange-600 group-hover:text-orange-700 font-medium flex items-center justify-center text-sm">
                  Learn More
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Full variant: show all services from data with links
  if (variant === 'full') {
    const activeServices = allServices
      .filter(service => service.is_active !== false)
      .filter(service => !excludeService || service.slug !== excludeService);

    return (
      <section className="py-0">
        <div className="container mx-auto">
          {!hideHeader && (
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                {title || <>Our Moving <span className="text-orange-500">Services</span></>}
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {subtitle || 'Professional moving services tailored to meet your specific needs, timeline, and budget.'}
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activeServices.map((service, index) => (
              <Link
                key={index}
                href={`/${service.slug}`}
                className="bg-white rounded-xl p-6 border-2 border-orange-500 hover:bg-orange-500 transition-all group"
              >
                <div className="flex justify-center mb-4">
                  <ServiceIllustration service={service.slug} className="w-24 h-24" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-white transition-colors text-center">
                  {service.name}
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
    );
  }

  // Default (preview): show first 6 services from data
  const previewServices = allServices
    .filter(service => service.is_active !== false)
    .filter(service => !excludeService || service.slug !== excludeService)
    .slice(0, 6);

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto">
        {!hideHeader && (
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              {title || <>Our Moving <span className="text-orange-500">Services</span></>}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {subtitle || 'Professional moving services tailored to meet your specific needs, timeline, and budget.'}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {previewServices.map((service, index) => (
            <Link
              key={index}
              href={`/${service.slug}`}
              className="bg-white rounded-xl p-6 border-2 border-orange-500 hover:bg-orange-500 transition-all group"
            >
              <div className="flex justify-center mb-4">
                <ServiceIllustration service={service.slug} className="w-24 h-24" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-white transition-colors text-center">
                {service.name}
              </h3>
              <p className="text-gray-600 mb-4 group-hover:text-white transition-colors text-center">{service.description}</p>
              <div className="text-orange-600 group-hover:text-white font-medium flex items-center justify-center transition-colors">
                Learn More
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/services" className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-8 rounded-lg transition-colors">
            View All Services
          </Link>
        </div>
      </div>
    </section>
  )
}
