import { MapPin } from 'lucide-react'
import Link from 'next/link'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface ContentSectionProps {
  // Simple content mode (for basic usage)
  content?: string | string[];
  // Full mode options
  title?: string;
  titleHighlight?: string;
  titleSuffix?: string;
  subtitle?: string;
  description?: string;
  locationDescription?: string;
  info?: string;
  breadcrumbs?: BreadcrumbItem[];
  className?: string;
}

export default function ContentSection({
  content,
  title,
  titleHighlight,
  titleSuffix = '',
  subtitle,
  description,
  locationDescription,
  info,
  breadcrumbs,
  className = '',
}: ContentSectionProps) {
  // Simple content mode - just show paragraphs
  if (content && !title && !titleHighlight && !subtitle && !description && !locationDescription && !info && !breadcrumbs) {
    const paragraphs = Array.isArray(content) ? content : [content];
    return (
      <section className={`py-16 ${className}`}>
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-lg text-gray-600 leading-relaxed space-y-4">
              {paragraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Full mode with title, descriptions, breadcrumbs etc.
  const hasContent = subtitle || description || content || locationDescription || info;

  return (
    <section className={`py-20 ${className}`}>
      <div className="container mx-auto">
        <div className="mx-auto">
          {/* Title */}
          {(title || titleHighlight) && (
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8 text-center">
              {title}
              {titleHighlight && (
                <>
                  {' '}<span className="text-orange-500">{titleHighlight}</span>
                </>
              )}
              {titleSuffix}
            </h2>
          )}

          {/* Content Box */}
          {hasContent && (
            <div className="bg-gray-50 rounded-xl p-8 mb-8">
              {/* Subtitle */}
              {subtitle && (
                <p className="text-lg text-gray-700 font-medium mb-4">
                  {subtitle}
                </p>
              )}

              {/* Description */}
              {description && (
                <p className="text-gray-600 leading-relaxed mb-4">
                  {description}
                </p>
              )}

              {/* Location Description */}
              {locationDescription && (
                <p className="text-gray-600 leading-relaxed mb-4">
                  {locationDescription}
                </p>
              )}

              {/* Simple content */}
              {content && (
                <div className="text-gray-600 leading-relaxed space-y-4">
                  {(Array.isArray(content) ? content : [content]).map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              )}

              {/* Info (zip codes, population, etc.) */}
              {info && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-500 font-medium">
                    {info}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Breadcrumb Links */}
          {breadcrumbs && breadcrumbs.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
              {breadcrumbs.map((crumb, index) => (
                <span key={index} className="flex items-center">
                  {index > 0 && <span className="text-gray-400 mr-4">•</span>}
                  {crumb.href ? (
                    <Link
                      href={crumb.href}
                      className="flex items-center text-gray-600 hover:text-orange-500 transition-colors"
                    >
                      <MapPin className="w-4 h-4 mr-1" />
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="text-gray-600">{crumb.label}</span>
                  )}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
