import { generateReviewSchema } from '@/lib/schema'
import SchemaScript from './SchemaScript'

interface ReviewSchemaProps {
  ratingValue: string
  reviewCount: string
  locale?: string
}

export default function ReviewSchema({
  ratingValue,
  reviewCount,
  locale,
}: ReviewSchemaProps) {
  const schema = generateReviewSchema({ ratingValue, reviewCount, locale })
  return <SchemaScript schema={schema} id="review-schema" />
}
