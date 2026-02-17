import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'
import { BreadcrumbSchema } from './Schema'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  includeHome?: boolean
  includeSchema?: boolean
  variant?: 'default' | 'compact' | 'centered'
  showBackground?: boolean
}

/**
 * Breadcrumbs component with visual display and JSON-LD schema
 */
export default function Breadcrumbs({
  items,
  includeHome = true,
  includeSchema = true,
  variant = 'default',
  showBackground = false,
}: BreadcrumbsProps) {
  if (!items || items.length === 0) {
    return null
  }

  // Build full breadcrumb list
  const breadcrumbItems = includeHome
    ? [{ label: 'Home', href: '/' }, ...items]
    : items

  const containerClasses = {
    default: 'py-3',
    compact: 'py-2',
    centered: 'py-3 text-center',
  }

  const content = (
    <nav aria-label="Breadcrumb" className={showBackground ? '' : containerClasses[variant]}>
      <ol className={`flex flex-wrap items-center gap-1 text-sm ${variant === 'centered' ? 'justify-center' : ''}`}>
          {breadcrumbItems.map((item, index) => {
            const isLast = index === breadcrumbItems.length - 1
            const isHome = index === 0 && includeHome

            return (
              <li key={index} className="flex items-center">
                {/* Separator (not for first item) */}
                {index > 0 && (
                  <ChevronRight className="w-4 h-4 text-gray-400 mx-1 flex-shrink-0" />
                )}

                {/* Breadcrumb item */}
                {isLast ? (
                  // Current page (no link)
                  <span className="text-gray-600 font-medium truncate max-w-[200px]" aria-current="page">
                    {item.label}
                  </span>
                ) : item.href ? (
                  // Linked item
                  <Link
                    href={item.href}
                    className="text-orange-600 hover:text-orange-700 hover:underline flex items-center gap-1 truncate max-w-[200px]"
                  >
                    {isHome && <Home className="w-4 h-4 flex-shrink-0" />}
                    {!isHome && item.label}
                  </Link>
                ) : (
                  // Non-linked item (for display-only breadcrumbs)
                  <span className="text-gray-500 truncate max-w-[200px]">
                    {item.label}
                  </span>
                )}
              </li>
            )
          })}
        </ol>
      </nav>
  )

  return (
    <>
      {/* JSON-LD Schema */}
      {includeSchema && <BreadcrumbSchema items={items} includeHome={includeHome} />}

      {/* Visual Breadcrumbs */}
      {showBackground ? (
        <section className="-mt-8">
          <div className="container mx-auto">
            <div className="bg-gray-100 rounded-b-4xl px-6 pt-14 pb-6 md:px-8">
              {content}
            </div>
          </div>
        </section>
      ) : (
        content
      )}
    </>
  )
}
