import { generateBreadcrumbSchema } from '@/lib/schema'
import SchemaScript from './SchemaScript'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbSchemaProps {
  items: BreadcrumbItem[]
  includeHome?: boolean
}

/**
 * BreadcrumbList schema component
 */
export default function BreadcrumbSchema({
  items,
  includeHome = true,
}: BreadcrumbSchemaProps) {
  if (!items || items.length === 0) {
    return null
  }

  const schema = generateBreadcrumbSchema(items, includeHome)

  return <SchemaScript schema={schema} id="breadcrumb-schema" />
}
