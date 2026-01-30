import Link from 'next/link';
import { allLongDistanceRoutes, allLocalRoutes, titleCase } from '@/lib/data';
import { Navigation, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Moving Routes | Rapid Panda Movers',
  description: 'Browse all our moving routes. Professional moving services for local and long distance moves across Florida and nationwide.',
};

export default function RoutesPage() {
  const longDistanceRoutes = allLongDistanceRoutes.filter(r => r.is_active !== false);
  const localRoutes = allLocalRoutes.filter(r => r.is_active !== false);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-16 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Moving <span className="text-orange-500">Routes</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Professional moving services for all your relocation needs
            </p>
          </div>
        </div>
      </section>

      {/* Long Distance Routes */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Long Distance <span className="text-orange-500">Routes</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Interstate and cross-country moving services
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-w-7xl mx-auto">
            {longDistanceRoutes.map((route, index) => {
              const hours = Math.floor(route.drive_time_min / 60);
              const mins = route.drive_time_min % 60;
              return (
                <Link
                  key={index}
                  href={`/${route.slug}-movers`}
                  className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <Navigation className="w-5 h-5 text-orange-500" />
                    <span className="text-xs text-gray-500">
                      {route.distance_mi} mi
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-1">
                    {titleCase(route.origin_name)} to {titleCase(route.destination_name)}
                  </h3>
                  <p className="text-sm text-gray-500 mb-2">
                    {hours}h {mins}m drive
                  </p>
                  {route.house_sizes?.['1_bedroom']?.min_cost && (
                    <p className="text-orange-500 font-semibold text-sm">
                      From ${route.house_sizes['1_bedroom'].min_cost.toLocaleString()}
                    </p>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Local Routes */}
      {localRoutes.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                Local <span className="text-orange-500">Routes</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Short distance moves within the Miami-Dade area
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-w-7xl mx-auto">
              {localRoutes.map((route, index) => {
                const hours = Math.floor(route.drive_time_min / 60);
                const mins = route.drive_time_min % 60;
                const timeDisplay = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
                return (
                  <Link
                    key={index}
                    href={`/${route.slug}-movers`}
                    className="bg-white rounded-lg p-4 hover:shadow-md transition-shadow group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Navigation className="w-5 h-5 text-orange-500" />
                      <span className="text-xs text-gray-500">
                        {route.distance_mi} mi
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-1">
                      {titleCase(route.origin_name)} to {titleCase(route.destination_name)}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">
                      {timeDisplay} drive
                    </p>
                    {route.house_sizes?.['1_bedroom']?.min_cost && (
                      <p className="text-orange-500 font-semibold text-sm">
                        From ${route.house_sizes['1_bedroom'].min_cost.toLocaleString()}
                      </p>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 bg-orange-500">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Don't See Your Route?
          </h2>
          <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
            We serve many more locations. Contact us for a custom quote for your move.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center px-8 py-4 bg-white text-orange-500 font-bold rounded-lg hover:bg-gray-100 transition-colors"
          >
            Get a Custom Quote
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </section>
    </div>
  );
}
