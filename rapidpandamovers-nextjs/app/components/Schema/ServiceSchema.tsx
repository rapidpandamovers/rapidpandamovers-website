import { generateServiceSchema } from '@/lib/schema'
import SchemaScript from './SchemaScript'

interface ServiceSchemaProps {
  name: string
  description: string
  url: string
  areaServed?: string
}

/**
 * Service schema component for service pages
 */
export default function ServiceSchema({
  name,
  description,
  url,
  areaServed,
}: ServiceSchemaProps) {
  const schema = generateServiceSchema({
    name,
    description,
    url,
    areaServed,
  })

  return <SchemaScript schema={schema} id="service-schema" />
}
