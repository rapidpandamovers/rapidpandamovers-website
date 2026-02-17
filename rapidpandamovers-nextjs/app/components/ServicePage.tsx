import Hero from './Hero';
import WhySection from './WhySection';
import QuoteSection from './QuoteSection';
import RouteSection from './RouteSection';
import LocationSection from './LocationSection';
import ServiceSection from './ServiceSection';
import BlogSection from './BlogSection';
import IncludedSection from './IncludedSection';
import ProcessSection from './ProcessSection';
import ProblemSection from './ProblemSection';
import SolutionSection from './SolutionSection';
import OverviewSection from './OverviewSection';
import FAQSection from './FAQSection';
import Breadcrumbs from './Breadcrumbs';
import { ServiceSchema, FAQSchema } from './Schema';
import { allLongDistanceRoutes, titleCase } from '@/lib/data';
import { MapPin, Navigation, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface ServicePageProps {
  service: {
    name: string;
    slug: string;
    title: string;
    description: string;
    hero?: {
      title: string;
      description: string;
      cta: string;
      image_url: string;
    };
    process?: Array<{
      step: string;
      title: string;
      description: string;
    }>;
    problems?: Array<{
      title: string;
      description: string;
    }>;
    solutions?: Array<{
      title: string;
      description: string;
    }>;
    included?: string[];
    areas?: string[];
    faq?: Array<{
      question: string;
      answer: string;
    }>;
  };
  // Optional location for location-specific service pages (e.g., /miami-local-moving)
  location?: {
    name: string;
    slug: string;
    neighborhoods?: Array<{
      name: string;
      slug: string;
      zip_codes?: string[];
      is_active?: boolean;
    }>;
    parentCity?: {
      name: string;
      slug: string;
    };
  };
}

export default function ServicePage({ service, location }: ServicePageProps) {
  // Get long distance routes for the long-distance-moving service (only when not location-specific)
  const longDistanceRoutes = !location && service.slug === 'long-distance-moving'
    ? allLongDistanceRoutes.filter(r => r.is_active !== false).slice(0, 6)
    : [];

  // Determine if this is a neighborhood (has parentCity)
  const isNeighborhood = !!location?.parentCity;

  // Build title and description based on whether we have a location
  const heroTitle = location
    ? `${location.name} ${service.name}`
    : (service.hero?.title || service.title);

  const heroDescription = location
    ? `Professional ${service.name.toLowerCase()} services in ${location.name}${isNeighborhood ? `, ${location.parentCity!.name}` : ''}. Experienced crews, transparent pricing, and reliable service.`
    : (service.hero?.description || service.description);

  // Build breadcrumb items
  const breadcrumbItems = location
    ? [
        { label: 'Services', href: '/services' },
        { label: service.name, href: `/${service.slug}` },
        ...(isNeighborhood && location.parentCity
          ? [{ label: `${location.parentCity.name}`, href: `/${location.parentCity.slug}-movers` }]
          : []),
        { label: location.name },
      ]
    : [
        { label: 'Services', href: '/services' },
        { label: service.name },
      ];

  // Build service URL for schema
  const serviceUrl = location
    ? `/${location.slug}-${service.slug}`
    : `/${service.slug}`;

  // Build area served for schema
  const areaServed = location
    ? isNeighborhood && location.parentCity
      ? `${location.name}, ${location.parentCity.name}, FL`
      : `${location.name}, FL`
    : 'Miami-Dade County, FL';

  return (
    <div className="min-h-screen">
      {/* Schema Markup */}
      <ServiceSchema
        name={location ? `${location.name} ${service.name}` : service.name}
        description={service.description}
        url={serviceUrl}
        areaServed={areaServed}
      />
      {service.faq && service.faq.length > 0 && <FAQSchema faqs={service.faq} />}

      {/* Hero Section */}
      <Hero
        title={heroTitle}
        description={heroDescription}
        cta={service.hero?.cta || 'Get Your Free Quote'}
        image_url={service.hero?.image_url}
      />

      {/* Breadcrumbs */}
      <Breadcrumbs items={breadcrumbItems} showBackground={true} />

      {/* Content Section */}
      <OverviewSection
        title={<>About <span className="text-orange-500">{location ? `${location.name} ${service.name}` : service.name}</span></>}
      >
        {location && (
          <p className="text-lg text-gray-700 font-medium mb-4">
            Professional {service.name.toLowerCase()} services in {location.name}
          </p>
        )}
        <p className="text-gray-600 leading-relaxed">{service.description}</p>
      </OverviewSection>

      {/* Problems Section */}
      <ProblemSection problems={service.problems} />

      {/* Solutions Section */}
      <SolutionSection solutions={service.solutions} />

      {/* Process Steps */}
      <ProcessSection steps={service.process} />

      {/* Included Items */}
      <IncludedSection items={service.included} />

      {/* FAQ Section */}
      {service.faq && service.faq.length > 0 && (
        <FAQSection
          title={`${service.name} FAQ`}
          subtitle={`Common questions about our ${service.name.toLowerCase()} services`}
          faqs={service.faq}
          variant="compact"
        />
      )}

      {/* Service Areas - Only show when not location-specific */}
      {!location && service.areas && service.areas.length > 0 && (
        <section className="py-20">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                Service <span className="text-orange-500">Areas</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                We provide {service.name.toLowerCase()} services in these areas
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mx-auto">
              {service.areas.map((area, index) => (
                <div key={index} className="bg-white rounded-lg p-4 text-center shadow-sm hover:shadow-md transition-shadow">
                  <MapPin className="w-5 h-5 text-orange-500 mx-auto mb-2" />
                  <h4 className="font-medium text-gray-800 text-sm">{area}</h4>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Neighborhoods Section - Only for location-specific city pages */}
      {location && !isNeighborhood && location.neighborhoods && (
        <LocationSection city={location} />
      )}

      {/* Routes Section - Only for location-specific pages */}
      {location && <RouteSection location={location} />}

      {/* Long Distance Routes */}
      {longDistanceRoutes.length > 0 && (
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                Popular <span className="text-orange-500">Long Distance Routes</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                We provide professional moving services for these popular routes
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {longDistanceRoutes.map((route, index) => {
                const hours = Math.floor(route.drive_time_min / 60);
                const mins = route.drive_time_min % 60;
                return (
                  <Link
                    key={index}
                    href={`/${route.slug}-movers`}
                    className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:border-orange-500 hover:shadow-md transition-all group"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <Navigation className="w-6 h-6 text-orange-500" />
                      <span className="text-sm text-gray-500">
                        {route.distance_mi} mi • {hours}h {mins}m
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {titleCase(route.origin_name)} to {titleCase(route.destination_name)}
                    </h3>
                    {route.house_sizes?.['1_bedroom']?.min_cost && (
                      <p className="text-orange-500 font-semibold mb-3">
                        Starting from ${route.house_sizes['1_bedroom'].min_cost.toLocaleString()}
                      </p>
                    )}
                    <div className="text-orange-600 group-hover:text-orange-700 font-medium flex items-center">
                      View Route
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                );
              })}
            </div>
            <div className="text-center mt-12">
              <Link
                href="/moving-routes?type=long-distance"
                className="inline-flex items-center px-8 py-4 bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-600 transition-colors"
              >
                See All Long Distance Routes
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Related Blog Posts */}
      <BlogSection
        variant="compact"
        serviceFilter={service.slug}
        locationFilter={location?.slug}
        locationFilterFallback={isNeighborhood ? location!.parentCity!.slug : undefined}
        showFeatured={false}
        showCategories={false}
        title={location ? `${service.name} Tips for ${location.name}` : `${service.name} Tips & Guides`}
        subtitle={location ? `Expert advice for your ${location.name} ${service.name.toLowerCase()}` : `Expert advice for your ${service.name.toLowerCase()}`}
        viewMoreTitle="More Moving Tips"
        viewMoreSubtitle="Browse our full collection of moving guides and advice"
        viewMoreButtonText="View All Tips"
        viewMoreLink="/blog"
      />

      {/* Other Services */}
      <ServiceSection
        location={location}
        excludeService={service.slug}
        title={location
          ? <>Other <span className="text-orange-500">Services</span> in {location.name}</>
          : <>Other <span className="text-orange-500">Services</span> You May Need</>
        }
        subtitle={location
          ? `Explore our full range of professional moving services in ${location.name}`
          : "Explore our full range of professional moving services"
        }
        variant="preview"
      />

      {/* Why Choose Us */}
      <WhySection />

      {/* CTA Section */}
      <QuoteSection />
    </div>
  );
}




