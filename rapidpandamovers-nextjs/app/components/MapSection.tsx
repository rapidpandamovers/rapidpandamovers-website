import { getMessages } from 'next-intl/server'
import { H2, H3 } from '@/app/components/Heading'
import MapIframe from './MapIframe'

interface MapSectionProps {
  // For location maps
  location?: {
    name: string
    address?: string
    city?: string
    state?: string
    zip?: string
  }
  // For route maps
  route?: {
    origin: string
    destination: string
    originZip?: string
    destinationZip?: string
    originState?: string
    destinationState?: string
  }
  // Display options
  title?: string
  height?: string
  className?: string
  embedded?: boolean // When true, renders without section/container wrapper
}

function getEmbedUrl(location?: MapSectionProps['location'], route?: MapSectionProps['route']): string {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  const baseUrl = 'https://www.google.com/maps/embed/v1'

  if (route) {
    const originState = route.originState || 'FL'
    const destState = route.destinationState || 'FL'
    const originAddr = route.originZip
      ? route.originZip
      : `${route.origin}, ${originState}`
    const destAddr = route.destinationZip
      ? route.destinationZip
      : `${route.destination}, ${destState}`

    if (apiKey) {
      return `${baseUrl}/directions?key=${apiKey}&origin=${encodeURIComponent(originAddr)}&destination=${encodeURIComponent(destAddr)}&mode=driving`
    }
    return `https://maps.google.com/maps?f=d&source=s_d&saddr=${encodeURIComponent(originAddr)}&daddr=${encodeURIComponent(destAddr)}&hl=en&output=embed`
  }

  if (location) {
    const query = location.address
      ? `${location.address}, ${location.city || ''}, ${location.state || 'FL'} ${location.zip || ''}`
      : `${location.name}, ${location.city || location.name}, ${location.state || 'FL'}`

    if (apiKey) {
      return `${baseUrl}/place?key=${apiKey}&q=${encodeURIComponent(query)}`
    }
    return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&output=embed`
  }

  return `https://maps.google.com/maps?q=${encodeURIComponent('Miami, FL')}&output=embed`
}

export default async function MapSection({
  location,
  route,
  title,
  height = '400px',
  className = '',
  embedded = false,
}: MapSectionProps) {
  const { ui } = (await getMessages()) as any
  const embedUrl = getEmbedUrl(location, route)

  const displayTitle = title !== undefined
    ? title
    : embedded
      ? ''
      : (route
          ? ui.map.drivingRoute.replace('{origin}', route.origin).replace('{destination}', route.destination)
          : location
            ? ui.map.locationArea.replace('{name}', location.name)
            : ui.map.serviceArea)

  const mapContent = (
    <>
      <MapIframe src={embedUrl} height={height} loadingText={ui.map.loadingMap} />

      {route && (
        <div className="mt-4 text-center text-gray-600">
          <p className="text-sm">
            {ui.map.viewDirections.replace('{origin}', route.origin).replace('{destination}', route.destination)}{' '}
            <a
              href={`https://www.google.com/maps/dir/${encodeURIComponent(route.originZip || `${route.origin}, ${route.originState || 'FL'}`)}/${encodeURIComponent(route.destinationZip || `${route.destination}, ${route.destinationState || 'FL'}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-700 hover:text-orange-800 underline"
            >
              {ui.map.googleMaps}
            </a>
          </p>
        </div>
      )}
    </>
  )

  if (embedded) {
    return (
      <div className={`my-8 ${className}`}>
        {displayTitle && <H3 className="text-xl font-bold text-gray-800 mb-4">{displayTitle}</H3>}
        {mapContent}
      </div>
    )
  }

  return (
    <section className={`pt-20 ${className}`}>
      <div className="container mx-auto">
        <div className="mx-auto">
          {displayTitle && (
            <H2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 text-center">
              {displayTitle}
            </H2>
          )}
          {mapContent}
        </div>
      </div>
    </section>
  )
}
