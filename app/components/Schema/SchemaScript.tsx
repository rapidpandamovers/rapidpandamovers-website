interface SchemaScriptProps {
  schema: object
  id?: string
}

/**
 * Base component for rendering JSON-LD structured data
 */
export default function SchemaScript({ schema, id }: SchemaScriptProps) {
  return (
    <script
      type="application/ld+json"
      id={id}
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
