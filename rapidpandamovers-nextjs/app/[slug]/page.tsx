import { getServiceBySlug, getCityBySlug, getRouteBySlug, getServiceSlugs } from '@/lib/data';
import ServicePage from '@/app/components/ServicePage';
import LocationPage from '@/app/components/LocationPage';
import RoutePage from '@/app/components/RoutePage';

export default async function Page({ params }: { params: { slug: string } }) {
  const { slug } = params;
  
  // Detect content type - check in order: service, city, route
  const service = getServiceBySlug(slug);
  const city = getCityBySlug(slug);
  const route = getRouteBySlug(slug);

  // Render appropriate component based on content type
  if (service) {
    return <ServicePage service={service} />;
  }
  
  if (city) {
    return <LocationPage city={city} />;
  }
  
  if (route) {
    return <RoutePage route={route} />;
  }

  // Fallback for unknown slugs
  return (
    <main className="prose max-w-3xl mx-auto py-10">
      <h1>Page Not Found</h1>
      <p>The page you're looking for doesn't exist.</p>
    </main>
  );
}

export async function generateStaticParams() {
  return [
    ...getStaticSlugs(),
  ];
}

function getStaticSlugs() {
  const { allCities, allRoutes, getServiceSlugs } = require('@/lib/data');
  const allCitiesFlat = allCities.states.flatMap((state: any) => 
    state.counties.flatMap((county: any) => county.cities)
  );
  return [
    ...allCitiesFlat.map((c: any) => ({ slug: `${c.slug}-movers` })),
    ...allRoutes.map((r: any) => ({ slug: `${r.slug}-movers` })),
    ...getServiceSlugs().map((s: string) => ({ slug: s }))
  ];
}
