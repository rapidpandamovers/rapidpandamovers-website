import Hero from './Hero';
import WhySection from './WhySection';
import QuoteSection from './QuoteSection';
import PricingSection from './PricingSection';
import MapSection from './MapSection';
import TravelSection from './TravelSection';
import BlogSection from './BlogSection';
import Breadcrumbs from './Breadcrumbs';
import { RouteSchema } from './Schema';
import { titleCase, getCityNameBySlug } from '@/lib/data';
import { getMessages, getLocale } from 'next-intl/server';
import { getTranslatedSlug } from '@/i18n/slug-map';
import type { Locale } from '@/i18n/config';

interface HouseSize {
  min_cost: number;
  max_cost: number;
  avg_cost: number;
  movers: number;
  trucks: number;
  min_hours: number;
  max_hours: number;
}

interface RoutePageProps {
  route: {
    origin_name: string;
    origin_zip?: string;
    destination_name: string;
    destination_zip?: string;
    distance_mi: number;
    drive_time_min: number;
    avg_cost_usd?: number;
    slug: string;
    is_active?: boolean;
    house_sizes?: {
      '1_bedroom'?: HouseSize;
      '2_bedroom'?: HouseSize;
      '3_bedroom'?: HouseSize;
      '4_bedroom'?: HouseSize;
      '4plus_bedroom'?: HouseSize;
    };
  };
}

// Helper function to extract state from location name (e.g., "akron-oh" -> "OH")
// Returns "FL" for Florida locations without state suffix
function getStateFromName(name: string): string {
  const parts = name.split('-');
  const lastPart = parts[parts.length - 1];
  // Check if last part is a 2-letter state code
  if (lastPart.length === 2 && /^[a-z]{2}$/i.test(lastPart)) {
    return lastPart.toUpperCase();
  }
  return 'FL';
}

export default async function RoutePage({ route }: RoutePageProps) {
  const { ui, content } = (await getMessages()) as any;
  const locale = await getLocale() as Locale;
  const fromCityTitle = titleCase(route.origin_name);
  const toCityTitle = titleCase(route.destination_name);

  // Determine if this is a long distance route (different states)
  const originState = getStateFromName(route.origin_name);
  const destinationState = getStateFromName(route.destination_name);
  const isLongDistance = originState !== destinationState;

  // Category fallback based on route type
  const categoryFallback = isLongDistance ? 'Long Distance Moving' : 'Local Moving';

  // Breadcrumb items
  const breadcrumbItems = [
    { label: ui.routes.breadcrumb, href: `/${getTranslatedSlug('moving-routes', locale)}` },
    { label: `${fromCityTitle} ${ui.routes.to} ${toCityTitle}` },
  ];

  return (
    <div className="min-h-screen">
      {/* Schema Markup */}
      <RouteSchema
        originCity={fromCityTitle}
        destinationCity={toCityTitle}
        distance={route.distance_mi}
        url={`/${route.slug}-movers`}
      />

      {/* Hero Section */}
      <Hero
        title={ui.routes.toMovers.replace('{from}', fromCityTitle).replace('{to}', toCityTitle)}
        description={ui.routes.routeDescription.replace('{from}', fromCityTitle).replace('{to}', toCityTitle)}
        cta={content.moving_routes.hero.cta}
      />

      {/* Breadcrumbs */}
      <Breadcrumbs items={breadcrumbItems} showBackground={true} />

      {/* Route Details Section */}
      <TravelSection
        origin={fromCityTitle}
        destination={toCityTitle}
        originSlug={route.origin_name}
        destinationSlug={route.destination_name}
        distanceMiles={route.distance_mi}
        driveTimeMinutes={route.drive_time_min}
        startingCost={route.avg_cost_usd}
        destinationHasPage={getStateFromName(route.destination_name) === 'FL'}
      >
        {/* Map Section (between origin/destination and distance/drive time) */}
        <MapSection
          embedded
          route={{
            origin: fromCityTitle,
            destination: toCityTitle,
            originZip: route.origin_zip,
            destinationZip: route.destination_zip,
            originState: getStateFromName(route.origin_name),
            destinationState: getStateFromName(route.destination_name),
          }}
        />
      </TravelSection>

      {/* Estimated Moving Costs */}
      {route.house_sizes && (
        <PricingSection
          houseSizes={route.house_sizes}
          originCity={getCityNameBySlug(route.origin_name) || fromCityTitle}
          originZip={route.origin_zip}
          destinationCity={getCityNameBySlug(route.destination_name) || toCityTitle}
          destinationZip={route.destination_zip}
        />
      )}

      {/* Related Blog Posts */}
      <BlogSection
        variant="compact"
        locationFilter={route.destination_name}
        categoryFilterFallback={categoryFallback}
        showFeatured={false}
        showCategories={false}
        title={ui.routes.movingTipsFor.replace('{from}', fromCityTitle).replace('{to}', toCityTitle)}
        subtitle={ui.routes.helpfulGuides.replace('{from}', fromCityTitle).replace('{to}', toCityTitle)}
        viewMoreTitle={content.moving_routes.blogSection.viewMoreTitle}
        viewMoreSubtitle={content.moving_routes.blogSection.viewMoreSubtitle}
        viewMoreButtonText={content.moving_routes.blogSection.viewMoreButtonText}
        viewMoreLink="/blog"
      />

      {/* Why Choose Us */}
      <WhySection />

      {/* CTA Section */}
      <QuoteSection />
    </div>
  );
}

