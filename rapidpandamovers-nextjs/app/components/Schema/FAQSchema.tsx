import { generateFAQSchema } from '@/lib/schema'
import SchemaScript from './SchemaScript'

interface FAQ {
  question: string
  answer: string
}

interface FAQSchemaProps {
  faqs: FAQ[]
}

/**
 * FAQ Page schema component
 */
export default function FAQSchema({ faqs }: FAQSchemaProps) {
  if (!faqs || faqs.length === 0) {
    return null
  }

  const schema = generateFAQSchema(faqs)

  return <SchemaScript schema={schema} id="faq-schema" />
}
