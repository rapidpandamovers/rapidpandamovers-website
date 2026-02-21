import { generateWebSiteSchema } from '@/lib/schema'
import SchemaScript from './SchemaScript'

interface WebSiteSchemaProps {
  locale?: string
}

export default function WebSiteSchema({ locale }: WebSiteSchemaProps) {
  const schema = generateWebSiteSchema(locale)
  return <SchemaScript schema={schema} id="website-schema" />
}
