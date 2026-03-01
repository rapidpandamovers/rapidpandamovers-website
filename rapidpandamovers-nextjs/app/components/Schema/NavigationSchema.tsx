import { generateNavigationSchema } from '@/lib/schema'
import SchemaScript from './SchemaScript'
import navEn from '@/data/navigation.json'
import navEs from '@/data/es/navigation.json'

interface NavigationSchemaProps {
  locale?: string
}

export default function NavigationSchema({ locale }: NavigationSchemaProps) {
  const nav = locale === 'es' ? navEs : navEn
  const schema = generateNavigationSchema(nav as any, locale)
  return <SchemaScript schema={schema} id="navigation-schema" />
}
