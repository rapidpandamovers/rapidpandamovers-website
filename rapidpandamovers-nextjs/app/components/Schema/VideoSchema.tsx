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
}

/**
 * VideoObject schema component for video rich results
 */
export default function VideoSchema({ videos }: VideoSchemaProps) {
  if (!videos || videos.length === 0) {
    return null
  }

  const schemas = generateVideoSchema(videos)

  return (
    <>
      {schemas.map((schema, i) => (
        <SchemaScript key={i} schema={schema} id={`video-schema-${i}`} />
      ))}
    </>
  )
}
