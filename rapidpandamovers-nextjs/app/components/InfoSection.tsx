import { MapPin } from 'lucide-react'
import Link from 'next/link'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface InfoSectionProps {
  title: string
  titleHighlight?: string
  titleSuffix?: string
  subtitle?: string
  description?: string
  locationDescription?: string
  info?: string
  breadcrumbs?: BreadcrumbItem[]
  className?: string
}

export default function InfoSection({
  title,
  titleHighlight,
  titleSuffix = '',
  subtitle,
  description,
  locationDescription,
  info,
  breadcrumbs,
  className = '',
}: InfoSectionProps) {
  return (
    <section className={`py-20 bg-white ${className}`}>
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              {title}
              {titleHighlight && (
                <>
                  {' '}<span className="text-orange-500">{titleHighlight}</span>
                </>
              )}
              {titleSuffix}
            </h2>
            {subtitle && (
              <p className="text-xl text-gray-600 mb-4">
                {subtitle}
              </p>
            )}
            {description && (
              <p className="text-xl text-gray-600 mb-8">
                {description}
              </p>
            )}
            {info && (
              <div className="text-gray-600 text-lg">
                {info}
              </div>
            )}
          </div>

          {/* Location Description */}
          {locationDescription && (
            <div className="bg-gray-50 rounded-lg p-8 mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                About {titleHighlight || 'This Location'}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {locationDescription}
              </p>
            </div>
          )}

          {/* Breadcrumb Links */}
          {breadcrumbs && breadcrumbs.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-6 mb-12">
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
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
