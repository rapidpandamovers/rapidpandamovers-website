import { Navigation, MapPin, Clock, DollarSign, ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface TravelSectionProps {
  origin: string
  destination: string
  originSlug?: string
  destinationSlug?: string
  distanceMiles: number
  driveTimeMinutes: number
  startingCost?: number
  showLocationLinks?: boolean
  originHasPage?: boolean
  destinationHasPage?: boolean
  className?: string
}

export default function TravelSection({
  origin,
  destination,
  originSlug,
  destinationSlug,
  distanceMiles,
  driveTimeMinutes,
  startingCost,
  showLocationLinks = true,
  originHasPage = true,
  destinationHasPage = true,
  className = '',
}: TravelSectionProps) {
  // Format drive time
  const hours = Math.floor(driveTimeMinutes / 60)
  const minutes = driveTimeMinutes % 60
  const timeDisplay = hours > 0
    ? `${hours}h ${minutes}m`
    : `${minutes} min`

  return (
    <section className={`pt-20 ${className}`}>
      <div className="container mx-auto">
        <div className="mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              Moving from <span className="text-orange-500">{origin}</span> to <span className="text-orange-500">{destination}</span>
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Professional moving services for your relocation from {origin} to {destination}
            </p>
          </div>

          {/* Route Info Cards */}
          <div className={`grid grid-cols-1 ${startingCost ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-6 mb-12`}>
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <Navigation className="w-8 h-8 text-orange-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Distance</h3>
              <p className="text-2xl font-bold text-gray-800">{distanceMiles} miles</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <Clock className="w-8 h-8 text-orange-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Drive Time</h3>
              <p className="text-2xl font-bold text-gray-800">{timeDisplay}</p>
            </div>
            {startingCost && (
              <div className="bg-gray-50 rounded-lg p-6 text-center">
                <DollarSign className="w-8 h-8 text-orange-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Starting Cost</h3>
                <p className="text-2xl font-bold text-gray-800">${startingCost.toLocaleString()}</p>
              </div>
            )}
          </div>

          {/* Origin & Destination Cards */}
          {showLocationLinks && (originSlug || destinationSlug) && (
            <div className="bg-orange-50 rounded-lg p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                Origin & Destination
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Origin Card */}
                {originSlug && originHasPage ? (
                  <Link
                    href={`/${originSlug}-movers`}
                    className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between group"
                  >
                    <div className="flex items-center space-x-4">
                      <MapPin className="w-6 h-6 text-orange-500" />
                      <div>
                        <h4 className="font-semibold text-gray-700 mb-1">Origin</h4>
                        <p className="text-xl font-bold text-gray-800">{origin}</p>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-orange-500 group-hover:translate-x-1 transition-all" />
                  </Link>
                ) : (
                  <div className="bg-white rounded-lg p-6 shadow-sm flex items-center">
                    <div className="flex items-center space-x-4">
                      <MapPin className="w-6 h-6 text-orange-500" />
                      <div>
                        <h4 className="font-semibold text-gray-700 mb-1">Origin</h4>
                        <p className="text-xl font-bold text-gray-800">{origin}</p>
                      </div>
                    </div>
                  </div>
                )}
                {/* Destination Card */}
                {destinationSlug && destinationHasPage ? (
                  <Link
                    href={`/${destinationSlug}-movers`}
                    className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between group"
                  >
                    <div className="flex items-center space-x-4">
                      <MapPin className="w-6 h-6 text-orange-500" />
                      <div>
                        <h4 className="font-semibold text-gray-700 mb-1">Destination</h4>
                        <p className="text-xl font-bold text-gray-800">{destination}</p>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-orange-500 group-hover:translate-x-1 transition-all" />
                  </Link>
                ) : (
                  <div className="bg-white rounded-lg p-6 shadow-sm flex items-center">
                    <div className="flex items-center space-x-4">
                      <MapPin className="w-6 h-6 text-orange-500" />
                      <div>
                        <h4 className="font-semibold text-gray-700 mb-1">Destination</h4>
                        <p className="text-xl font-bold text-gray-800">{destination}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
