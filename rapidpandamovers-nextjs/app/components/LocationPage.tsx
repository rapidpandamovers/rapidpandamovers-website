import Hero from './Hero';
import WhySection from './WhySection';
import AboutSection from './AboutSection';
import LocationSection from './LocationSection';
import RouteSection from './RouteSection';
import ServiceSection from './ServiceSection';
import MapSection from './MapSection';
import InfoSection from './InfoSection';
import SightSection, { Sight } from './SightSection';

interface LocationPageProps {
  city: {
    name: string;
    slug: string;
    population?: number;
    lat?: number;
    lng?: number;
    zip_codes?: string[];
    description?: string;
    sights?: Sight[];
    neighborhoods?: Array<{
      name: string;
      slug: string;
      zip_codes?: string[];
      description?: string;
      sights?: Sight[];
      is_active?: boolean;
    }>;
    // Neighborhood-specific fields (present when this is a neighborhood, not a city)
    parentCity?: {
      name: string;
      slug: string;
    };
    county?: {
      name: string;
      slug: string;
    };
    state?: {
      name: string;
      abbreviation: string;
    };
  };
}

export default function LocationPage({ city }: LocationPageProps) {
  // Determine if this is a neighborhood (has parentCity) or a city
  const isNeighborhood = !!city.parentCity;

  // Hero description varies based on type
  const heroDescription = isNeighborhood
    ? `Professional moving services in ${city.name}, ${city.parentCity!.name}. Local movers you can trust.`
    : `Professional moving services in ${city.name}. Expert local and long-distance moving with experienced crews and transparent pricing.`;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero
        title={`${city.name} Movers`}
        description={heroDescription}
        cta="Get Your Free Quote"
        image_url="https://www.rapidpandamovers.com/wp-content/uploads/2024/11/about-us-rapid-panda.png"
      />

      {/* Location Info Section */}
      <InfoSection
        title="Professional Moving Services in"
        titleHighlight={city.name}
        subtitle={isNeighborhood ? `Serving ${city.name} and the greater ${city.parentCity!.name} area` : undefined}
        description={isNeighborhood ? undefined : `Rapid Panda Movers provides comprehensive moving services throughout ${city.name} and the surrounding areas. Whether you're moving locally or long-distance, we're here to make your move stress-free and efficient.`}
        locationDescription={city.description}
        info={
          isNeighborhood
            ? (city.zip_codes && city.zip_codes.length > 0 ? `ZIP Codes: ${city.zip_codes.join(', ')}` : undefined)
            : (city.population ? `Serving ${city.name} (Population: ${city.population.toLocaleString()})` : undefined)
        }
        breadcrumbs={
          isNeighborhood && city.county && city.state
            ? [
                { label: `${city.parentCity!.name} Movers`, href: `/${city.parentCity!.slug}-movers` },
                { label: `${city.county.name} County` },
                { label: city.state.name },
              ]
            : undefined
        }
      />

      {/* Neighborhoods Section - Only for Cities, not Neighborhoods */}
      {!isNeighborhood && city.neighborhoods && <LocationSection city={city} />}

      {/* Popular Sights Section */}
      {city.sights && city.sights.length > 0 && (
        <SightSection
          sights={city.sights}
          locationName={city.name}
        />
      )}

      {/* Popular Routes Section */}
      <RouteSection location={city} />

      {/* Available Services Section */}
      <ServiceSection location={city} />

      {/* Map Section */}
      <MapSection
        location={{
          name: city.name,
          city: isNeighborhood ? city.parentCity!.name : city.name,
          state: 'FL',
          zip: city.zip_codes?.[0],
        }}
        title={`${city.name} Service Area`}
      />

      {/* Why Choose Us */}
      <WhySection />

      {/* About Us - Only for Cities */}
      {!isNeighborhood && <AboutSection />}
    </div>
  );
}

