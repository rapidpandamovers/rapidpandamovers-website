import { generateVideoSchema } from '@/lib/schema'
import SchemaScript from './SchemaScript'

interface Video {
  name: string
  description: string
  contentUrl: string
  thumbnailUrl: string
  uploadDate: string
  duration?: string
}

interface VideoSchemaProps {
  videos: Video[]
  locale?: string
}

/**
 * VideoObject schema component for video rich results
 */
export default function VideoSchema({ videos, locale }: VideoSchemaProps) {
  if (!videos || videos.length === 0) {
    return null
  }

  const schemas = generateVideoSchema(videos, locale)

  return (
    <>
      {schemas.map((schema, i) => (
        <SchemaScript key={i} schema={schema} id={`video-schema-${i}`} />
      ))}
    </>
  )
}
