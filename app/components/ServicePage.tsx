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
import dynamic from 'next/dynamic';
import Breadcrumbs from './Breadcrumbs';
import ServiceSchema from './Schema/ServiceSchema';
import FAQSchema from './Schema/FAQSchema';

const FAQSection = dynamic(() => import('./FAQSection'));
import { getMessages, getLocale } from 'next-intl/server';
import { getTranslatedSlug } from '@/i18n/slug-map';
import type { Locale } from '@/i18n/config';

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

export default async function ServicePage({ service, location }: ServicePageProps) {
  const locale = await getLocale() as Locale;
  const { ui } = (await getMessages()) as any;
  // Determine if this is a neighborhood (has parentCity)
  const isNeighborhood = !!location?.parentCity;

  // Build title and description based on whether we have a location
  const heroTitle = location
    ? `${location.name} ${service.name}`
    : (service.hero?.title || service.title);

  const heroDescription = location
    ? ui.services.serviceDescription.replace('{service}', service.name.toLowerCase()).replace('{location}', location.name + (isNeighborhood ? ', ' + location.parentCity!.name : ''))
    : (service.hero?.description || service.description);

  // Build breadcrumb items with translated hrefs
  const servicesSlug = getTranslatedSlug('services', locale);
  const breadcrumbItems = location
    ? [
        { label: ui.services.breadcrumb, href: `/${servicesSlug}` },
        { label: service.name, href: `/${getTranslatedSlug(service.slug, locale)}` },
        ...(isNeighborhood && location.parentCity
          ? [{ label: `${location.parentCity.name}`, href: `/${getTranslatedSlug(`${location.parentCity.slug}-movers`, locale)}` }]
          : []),
        { label: location.name },
      ]
    : [
        { label: ui.services.breadcrumb, href: `/${servicesSlug}` },
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
        cta={service.hero?.cta || ui.hero.defaultCta}
      />

      {/* Breadcrumbs */}
      <Breadcrumbs items={breadcrumbItems} showBackground={true} />

      {/* Content Section */}
      <OverviewSection
        title={<>{ui.services.aboutService.split('{name}')[0]}<span className="text-orange-700">{location ? `${location.name} ${service.name}` : service.name}</span>{ui.services.aboutService.split('{name}')[1]}</>}
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
      {!location && <LocationSection variant="left" title={ui.services.locationsTitle.replace('{name}', service.name)} />}

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
          subtitle={ui.services.faqSubtitle.replace('{name}', service.name.toLowerCase())}
          faqs={service.faq}
          variant="compact"
          compactCount={5}
        />
      )}

      {/* Related Blog Posts */}
      <BlogSection
        variant="left"
        serviceFilter={service.slug}
        locationFilter={location?.slug}
        locationFilterFallback={isNeighborhood ? location!.parentCity!.slug : undefined}
        categoryFilterFallback="Moving Tips"
        title={location ? ui.services.serviceTipsFor.replace('{service}', service.name).replace('{location}', location.name) : ui.services.serviceTipsGuides.replace('{name}', service.name)}
        showFeatured={false}
        showCategories={false}
        showExcerpts={false}
        showCategoryPill={false}
        showViewMore
        viewMoreButtonText={ui.blog.viewAllArticles}
        viewMoreLink={`/blog/${getTranslatedSlug('service', locale)}/${service.slug}`}
        maxPosts={3}
      />

      {/* Other Services */}
      <ServiceSection
        variant="left"
        location={location}
        excludeService={service.slug}
        title={location
          ? ui.services.otherServicesIn.replace('{name}', location.name)
          : ui.services.otherServices
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
