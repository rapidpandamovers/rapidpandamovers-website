'use client';

import { useState } from 'react';

interface MapSectionProps {
  // For location maps
  location?: {
    name: string;
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
  };
  // For route maps
  route?: {
    origin: string;
    destination: string;
    originZip?: string;
    destinationZip?: string;
    originState?: string;
    destinationState?: string;
  };
  // Display options
  title?: string;
  height?: string;
  className?: string;
  embedded?: boolean; // When true, renders without section/container wrapper
}

export default function MapSection({
  location,
  route,
  title,
  height = '400px',
  className = '',
  embedded = false,
}: MapSectionProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  // Build the embed URL based on mode
  const getEmbedUrl = () => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    const baseUrl = 'https://www.google.com/maps/embed/v1';

    if (route) {
      // Directions mode for routes
      // Use zip code if available (works best with Google Maps), otherwise use city name with state
      const originState = route.originState || 'FL';
      const destState = route.destinationState || 'FL';

      // Zip codes work without state suffix, city names need state
      const originAddr = route.originZip
        ? route.originZip
        : `${route.origin}, ${originState}`;
      const destAddr = route.destinationZip
        ? route.destinationZip
        : `${route.destination}, ${destState}`;

      if (apiKey) {
        return `${baseUrl}/directions?key=${apiKey}&origin=${encodeURIComponent(originAddr)}&destination=${encodeURIComponent(destAddr)}&mode=driving`;
      }
      // Fallback without API key - use Google Maps directions embed format
      return `https://maps.google.com/maps?f=d&source=s_d&saddr=${encodeURIComponent(originAddr)}&daddr=${encodeURIComponent(destAddr)}&hl=en&output=embed`;
    }

    if (location) {
      // Place mode for locations
      const query = location.address
        ? `${location.address}, ${location.city || ''}, ${location.state || 'FL'} ${location.zip || ''}`
        : `${location.name}, ${location.city || location.name}, ${location.state || 'FL'}`;

      if (apiKey) {
        return `${baseUrl}/place?key=${apiKey}&q=${encodeURIComponent(query)}`;
      }
      // Fallback without API key - use Google Maps search embed format
      return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
    }

    // Default: Miami area
    return `https://maps.google.com/maps?q=${encodeURIComponent('Miami, FL')}&output=embed`;
  };

  const displayTitle = title !== undefined
    ? title
    : embedded
      ? ''
      : (route
          ? `Driving Route: ${route.origin} to ${route.destination}`
          : location
            ? `${location.name} Area`
            : 'Service Area');

  const mapContent = (
    <>
      <div
        className="relative rounded-lg overflow-hidden shadow-lg bg-gray-200"
        style={{ height }}
      >
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="text-center">
              <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-gray-500">Loading map...</p>
            </div>
          </div>
        )}

        <iframe
          src={getEmbedUrl()}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          onLoad={() => setIsLoaded(true)}
          className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        />
      </div>

      {route && (
        <div className="mt-4 text-center text-gray-600">
          <p className="text-sm">
            View directions from {route.origin} to {route.destination} on{' '}
            <a
              href={`https://www.google.com/maps/dir/${encodeURIComponent(route.originZip || `${route.origin}, ${route.originState || 'FL'}`)}/${encodeURIComponent(route.destinationZip || `${route.destination}, ${route.destinationState || 'FL'}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-500 hover:text-orange-600 underline"
            >
              Google Maps
            </a>
          </p>
        </div>
      )}
    </>
  );

  if (embedded) {
    return (
      <div className={`my-6 ${className}`}>
        {displayTitle && <h3 className="text-xl font-bold text-gray-800 mb-4">{displayTitle}</h3>}
        {mapContent}
      </div>
    );
  }

  return (
    <section className={`pt-20 ${className}`}>
      <div className="container mx-auto">
        <div className="mx-auto">
          {displayTitle && (
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 text-center">
              {displayTitle}
            </h2>
          )}
          {mapContent}
        </div>
      </div>
    </section>
  );
}
