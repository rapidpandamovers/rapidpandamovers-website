import { Navigation, MapPin, Clock, DollarSign, ArrowRight } from 'lucide-react'
import { Link } from '@/i18n/routing'
import { getMessages } from 'next-intl/server'
import { H2, H3 } from '@/app/components/Heading'

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
  children?: React.ReactNode
}

export default async function TravelSection({
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
  children,
}: TravelSectionProps) {
  const { ui } = (await getMessages()) as any

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
          <div className="text-center mb-12 px-6 md:px-0">
            <H2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              {ui.travel.movingFrom.split('{origin}')[0]}<span className="text-orange-700">{origin}</span>{ui.travel.movingFrom.split('{origin}')[1].split('{destination}')[0]}<span className="text-orange-700">{destination}</span>{ui.travel.movingFrom.split('{destination}')[1] || ''}
            </H2>
            <p className="text-xl text-gray-600 mb-8">
              {ui.travel.movingFromDesc.replace('{origin}', origin).replace('{destination}', destination)}
            </p>
          </div>

          {/* Origin & Destination Cards */}
          {showLocationLinks && (originSlug || destinationSlug) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {/* Origin Card */}
              {originSlug && originHasPage ? (
                <Link
                  href={`/${originSlug}-movers`}
                  className="bg-orange-50 rounded-lg p-6 hover:bg-orange-100 transition-colors flex items-center justify-between group"
                >
                  <div className="flex items-center space-x-4">
                    <MapPin className="w-6 h-6 text-orange-700" />
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-1">{ui.travel.origin}</h4>
                      <p className="text-xl font-display font-bold text-gray-800">{origin}</p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-800 group-hover:text-orange-700 group-hover:translate-x-1 transition-all" />
                </Link>
              ) : (
                <div className="bg-orange-50 rounded-lg p-6 flex items-center">
                  <div className="flex items-center space-x-4">
                    <MapPin className="w-6 h-6 text-orange-700" />
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-1">{ui.travel.origin}</h4>
                      <p className="text-xl font-display font-bold text-gray-800">{origin}</p>
                    </div>
                  </div>
                </div>
              )}
              {/* Destination Card */}
              {destinationSlug && destinationHasPage ? (
                <Link
                  href={`/${destinationSlug}-movers`}
                  className="bg-orange-50 rounded-lg p-6 hover:bg-orange-100 transition-colors flex items-center justify-between group"
                >
                  <div className="flex items-center space-x-4">
                    <MapPin className="w-6 h-6 text-orange-700" />
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-1">{ui.travel.destination}</h4>
                      <p className="text-xl font-display font-bold text-gray-800">{destination}</p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-800 group-hover:text-orange-700 group-hover:translate-x-1 transition-all" />
                </Link>
              ) : (
                <div className="bg-orange-50 rounded-lg p-6 flex items-center">
                  <div className="flex items-center space-x-4">
                    <MapPin className="w-6 h-6 text-orange-700" />
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-1">{ui.travel.destination}</h4>
                      <p className="text-xl font-display font-bold text-gray-800">{destination}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Slot for map or other content between origin/destination and route stats */}
          {children}

          {/* Route Info Cards */}
          <div className={`grid grid-cols-1 ${startingCost ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-6`}>
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <Navigation className="w-8 h-8 text-orange-700 mx-auto mb-4" />
              <H3 className="text-lg font-semibold text-gray-700 mb-2">{ui.travel.distance}</H3>
              <p className="text-2xl font-bold text-gray-800">{ui.travel.miles.replace('{count}', String(distanceMiles))}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <Clock className="w-8 h-8 text-orange-700 mx-auto mb-4" />
              <H3 className="text-lg font-semibold text-gray-700 mb-2">{ui.travel.driveTime}</H3>
              <p className="text-2xl font-bold text-gray-800">{timeDisplay}</p>
            </div>
            {startingCost && (
              <div className="bg-gray-50 rounded-lg p-6 text-center">
                <DollarSign className="w-8 h-8 text-orange-700 mx-auto mb-4" />
                <H3 className="text-lg font-semibold text-gray-700 mb-2">{ui.travel.startingCost}</H3>
                <p className="text-2xl font-bold text-gray-800">${startingCost.toLocaleString()}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
