import { generateRouteSchema } from '@/lib/schema'
import SchemaScript from './SchemaScript'

interface RouteSchemaProps {
  originCity: string
  destinationCity: string
  distance: number
  url: string
  locale?: string
}

/**
 * Route/Moving Service schema component for route pages
 */
export default function RouteSchema({
  originCity,
  destinationCity,
  distance,
  url,
  locale,
}: RouteSchemaProps) {
  const schema = generateRouteSchema({
    originCity,
    destinationCity,
    distance,
    url,
    locale,
  })

  return <SchemaScript schema={schema} id="route-schema" />
}
