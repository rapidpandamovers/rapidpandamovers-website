import { ArrowRight } from 'lucide-react'
import { Link } from '@/i18n/routing'
import { getLocalizedAllActiveServices } from '@/lib/data'
import ServiceIllustration from './ServiceIllustration'
import { ReactNode } from 'react'
import { getMessages, getLocale } from 'next-intl/server'
import { getTranslatedSlug } from '@/i18n/slug-map'
import type { Locale } from '@/i18n/config'
import { H2, H3 } from '@/app/components/Heading'

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
  variant?: 'preview' | 'full' | 'left';
  // Hide the section title and description
  hideHeader?: boolean;
  // Exclude a specific service (useful for "related services" on service pages)
  excludeService?: string;
  // Custom title override (can be string or JSX)
  title?: ReactNode;
  // Custom subtitle override
  subtitle?: string;
}

export default async function ServiceSection({ location, variant = 'preview', hideHeader = false, excludeService, title, subtitle }: ServiceSectionProps = {}) {
  const { ui } = (await getMessages()) as any
  const locale = await getLocale() as Locale
  const activeServices = getLocalizedAllActiveServices(locale)
    .filter(service => !excludeService || service.slug !== excludeService);

  const servicesSlug = getTranslatedSlug('services', locale)

  // Build link href for a service
  const getHref = (serviceSlug: string) =>
    location
      ? `/${getTranslatedSlug(`${location.slug}-${serviceSlug}`, locale)}`
      : `/${getTranslatedSlug(serviceSlug, locale)}`;

  // Build display name for a service
  const getDisplayName = (serviceName: string) =>
    location ? `${location.name} ${serviceName}` : serviceName;

  // Full variant: show all services
  if (variant === 'full') {
    return (
      <section className="pt-20">
        <div className="container mx-auto">
          {!hideHeader && (
            <div className="text-center mb-16 px-6 md:px-0">
              <H2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                {title || <>{ui.services.defaultTitle}</>}
              </H2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {subtitle || ui.services.defaultSubtitle}
              </p>
            </div>
          )}

          {/* Location filter indicator */}
          {location && (
            <div className="mb-8 flex items-center justify-between">
              <p className="text-lg text-gray-600">
                {ui.services.showingIn} <span className="font-semibold text-orange-600">{location.name}</span>
              </p>
              <Link
                href={`/${servicesSlug}`}
                className="text-orange-600 hover:text-orange-800 font-medium text-sm"
              >
                {ui.services.viewAllLocations}
              </Link>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activeServices.map((service, index) => (
              <Link
                key={index}
                href={getHref(service.slug)}
                className="bg-orange-600 group-hover:bg-orange-700 rounded-4xl overflow-hidden border-2 border-orange-600 hover:shadow-md transition-all group flex flex-col"
              >
                <div className="bg-white rounded-b-4xl p-6 flex-1">
                  <div className="flex justify-center mb-4">
                    <ServiceIllustration service={service.slug} className="w-24 h-24" />
                  </div>
                  <H3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-orange-600 transition-colors text-center">
                    {getDisplayName(service.name)}
                  </H3>
                  <p className="text-gray-600 text-center">{service.description}</p>
                </div>
                <div className="text-white text-shadow-sm font-medium flex items-center justify-center py-3">
                  {ui.services.learnMore}
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Left variant — left-aligned header with inline "View All" link
  if (variant === 'left') {
    const leftServices = activeServices.slice(0, 6);
    const ctaLink = location ? `/${servicesSlug}/${location.slug}` : `/${servicesSlug}`;
    const ctaText = location ? ui.services.viewAllServicesIn.replace('{name}', location.name) : ui.services.viewAllServices;

    return (
      <section className="pt-20">
        <div className="container mx-auto">
          {!hideHeader && (
            <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10 px-6 md:px-0">
              <div>
                <H2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                  {title || <>{ui.services.defaultTitle}</>}
                </H2>
                {subtitle && (
                  <p className="text-lg text-gray-600">
                    {subtitle}
                  </p>
                )}
              </div>
              <Link
                href={ctaLink}
                className="inline-flex items-center text-orange-600 hover:text-orange-800 font-semibold mt-4 md:mt-0"
              >
                {ctaText}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {leftServices.map((service, index) => (
              <Link
                key={index}
                href={getHref(service.slug)}
                className="bg-orange-600 group-hover:bg-orange-700 rounded-4xl overflow-hidden border-2 border-orange-600 hover:shadow-md transition-all group flex flex-col"
              >
                <div className="bg-white rounded-b-4xl p-6 flex-1">
                  <div className="flex justify-center mb-4">
                    <ServiceIllustration service={service.slug} className="w-24 h-24" />
                  </div>
                  <H3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-orange-600 transition-colors text-center">
                    {getDisplayName(service.name)}
                  </H3>
                  <p className="text-gray-600 text-center">{service.description}</p>
                </div>
                <div className="text-white text-shadow-sm font-medium flex items-center justify-center py-3">
                  {ui.services.learnMore}
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Preview variant with location: show 6 services for that location
  if (location) {
    const previewServices = activeServices.slice(0, 6);

    return (
      <section className="pt-20">
        <div className="container mx-auto">
          {!hideHeader && (
            <div className="text-center mb-16 px-6 md:px-0">
              <H2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                {title || ui.location.movingServicesIn.replace('{name}', location.name)}
              </H2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {subtitle || ui.services.defaultSubtitle}
              </p>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {previewServices.map((service, index) => (
              <Link
                key={index}
                href={getHref(service.slug)}
                className="bg-orange-600 group-hover:bg-orange-700 rounded-4xl overflow-hidden border-2 border-orange-600 hover:shadow-md transition-all group flex flex-col"
              >
                <div className="bg-white rounded-b-4xl p-6 flex-1">
                  <div className="flex justify-center mb-4">
                    <ServiceIllustration service={service.slug} className="w-24 h-24" />
                  </div>
                  <H3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-orange-600 transition-colors text-center">
                    {getDisplayName(service.name)}
                  </H3>
                  <p className="text-gray-600 text-center">{service.description}</p>
                </div>
                <div className="text-white text-shadow-sm font-medium flex items-center justify-center py-3">
                  {ui.services.learnMore}
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href={`/${servicesSlug}/${location.slug}`} className="inline-flex items-center bg-orange-600 hover:bg-orange-700 text-white text-shadow-sm font-semibold py-3 px-8 rounded-lg transition-colors">
              {ui.services.viewAllServicesIn.replace('{name}', location.name)}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>
    );
  }

  // Default preview: show first 6 services
  const previewServices = activeServices.slice(0, 6);

  return (
    <section className="pt-20">
      <div className="container mx-auto">
        {!hideHeader && (
          <div className="text-center mb-12 px-6 md:px-0">
            <H2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              {title || <>{ui.services.defaultTitle}</>}
            </H2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {subtitle || ui.services.defaultSubtitle}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {previewServices.map((service, index) => (
            <Link
              key={index}
              href={getHref(service.slug)}
              className="bg-orange-600 group-hover:bg-orange-700 rounded-4xl overflow-hidden border-2 border-orange-600 hover:shadow-md transition-all group flex flex-col"
            >
              <div className="bg-white rounded-b-4xl p-6 flex-1">
                <div className="flex justify-center mb-4">
                  <ServiceIllustration service={service.slug} className="w-24 h-24" />
                </div>
                <H3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-orange-600 transition-colors text-center">
                  {service.name}
                </H3>
                <p className="text-gray-600 text-center">{service.description}</p>
              </div>
              <div className="text-white font-medium flex items-center justify-center py-3">
                {ui.services.learnMore}
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href={`/${servicesSlug}`} className="inline-flex items-center bg-orange-600 hover:bg-orange-700 text-white text-shadow-sm font-semibold py-3 px-8 rounded-lg transition-colors">
            {ui.services.viewAllServices}
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </div>
    </section>
  )
}
