import { generateArticleSchema } from '@/lib/schema'
import SchemaScript from './SchemaScript'

interface ArticleSchemaProps {
  title: string
  description: string
  url: string
  image?: string
  datePublished: string
  dateModified?: string
  author?: string
  locale?: string
}

/**
 * Article schema component for blog posts
 */
export default function ArticleSchema({
  title,
  description,
  url,
  image,
  datePublished,
  dateModified,
  author,
  locale,
}: ArticleSchemaProps) {
  const schema = generateArticleSchema({
    title,
    description,
    url,
    image,
    datePublished,
    dateModified,
    author,
    locale,
  })

  return <SchemaScript schema={schema} id="article-schema" />
}
