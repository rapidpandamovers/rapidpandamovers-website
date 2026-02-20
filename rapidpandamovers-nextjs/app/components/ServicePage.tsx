import Hero from './Hero';
import WhySection from './WhySection';
import AboutSection from './AboutSection';
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
import ServiceIllustration from './ServiceIllustration';
import FAQSection from './FAQSection';
import Breadcrumbs from './Breadcrumbs';
import { ServiceSchema, FAQSchema } from './Schema';

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
        icon={<ServiceIllustration service={service.slug} className="w-44 h-44" />}
      >
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

      {/* Service Areas - Only show when not location-specific */}
      {!location && <LocationSection variant="left" title={`${service.name} Locations`} />}

      {/* Neighborhoods Section - Only for location-specific city pages */}
      {location && !isNeighborhood && location.neighborhoods && (
        <LocationSection variant="left" city={location} />
      )}

      {/* Routes Section - Only for location-specific pages */}
      {location && <RouteSection variant="left" location={location} />}

      {/* FAQ Section */}
      {service.faq && service.faq.length > 0 && (
        <FAQSection
          title={`${service.name} FAQ`}
          subtitle={`Common questions about our ${service.name.toLowerCase()} services`}
          faqs={service.faq}
          variant="compact"
        />
      )}

      {/* Related Blog Posts */}
      <BlogSection
        variant="left"
        serviceFilter={service.slug}
        locationFilter={location?.slug}
        locationFilterFallback={isNeighborhood ? location!.parentCity!.slug : undefined}
        categoryFilterFallback="Moving Tips"
        title={location ? `${service.name} Tips for ${location.name}` : `${service.name} Tips & Guides`}
        showFeatured={false}
        showCategories={false}
        showExcerpts={false}
        showCategoryPill={false}
        showViewMore
        viewMoreButtonText="View All Articles"
        viewMoreLink="/blog/service/${service.slug}"
        maxPosts={3}
      />

      {/* Other Services */}
      <ServiceSection
        variant="left"
        location={location}
        excludeService={service.slug}
        title={location
          ? <>Other Services in {location.name}</>
          : <>Other Services You May Need</>
        }
      />

      {/* Why Choose Us */}
      <WhySection variant="left" />

      {/* About Us */}
      <AboutSection />

      {/* CTA Section */}
      <QuoteSection />
    </div>
  );
}




