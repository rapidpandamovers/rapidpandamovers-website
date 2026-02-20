'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { resolveIcon } from '@/lib/icons'
import contentData from '@/data/content.json'

const defaults = contentData.defaults.resources

interface Resource {
  title: string
  description: string
  href: string
  icon: string
}

const resources: Resource[] = defaults.items

function ResourceIcon({ name }: { name: string }) {
  const Icon = resolveIcon(name)
  return <Icon className="w-6 h-6" />
}

interface ResourceSectionProps {
  title?: string
  subtitle?: string
  className?: string
  maxItems?: number
  variant?: 'default' | 'compact' | 'grid'
}

export default function ResourceSection({
  title = defaults.title,
  subtitle = defaults.subtitle,
  className = '',
  maxItems,
  variant = 'default',
}: ResourceSectionProps) {
  const pathname = usePathname()

  // Filter out the current page and its sub-pages from the resources list
  const filteredResources = resources.filter(
    (resource) => resource.href !== pathname && !pathname.startsWith(resource.href + '/')
  )

  // Apply maxItems limit if specified
  const displayResources = maxItems
    ? filteredResources.slice(0, maxItems)
    : filteredResources

  if (displayResources.length === 0) {
    return null
  }

  if (variant === 'compact') {
    return (
      <section className={`pt-20 ${className}`}>
        <div className="container mx-auto">
          <h3 className="text-xl font-bold text-gray-800 mb-6">{title}</h3>
          <div className="flex flex-wrap gap-3">
            {displayResources.map((resource) => (
              <Link
                key={resource.href}
                href={resource.href}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-xl hover:bg-orange-50 transition-colors"
              >
                <span className="text-orange-500"><ResourceIcon name={resource.icon} /></span>
                <span className="font-medium text-gray-800">{resource.title}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (variant === 'grid') {
    return (
      <section className={`pt-20 ${className}`}>
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">{title}</h2>
            <p className="text-lg text-gray-600">{subtitle}</p>
          </div>
          <div className="bg-gray-50 rounded-4xl p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayResources.map((resource) => (
                <Link
                  key={resource.href}
                  href={resource.href}
                  className="group flex items-center gap-4 bg-white rounded-2xl p-5 hover:bg-orange-50 transition-colors"
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                    <ResourceIcon name={resource.icon} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-800 group-hover:text-orange-600 transition-colors">
                      {resource.title}
                    </h3>
                    <p className="text-sm text-gray-600 truncate">{resource.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }

  // Default variant - horizontal cards with arrows
  return (
    <section className={`pt-20 ${className}`}>
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">{title}</h2>
          <p className="text-lg text-gray-600">{subtitle}</p>
        </div>
        <div className="bg-gray-50 rounded-4xl p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayResources.map((resource) => (
              <Link
                key={resource.href}
                href={resource.href}
                className="group flex items-center gap-4 bg-white rounded-2xl p-5 hover:bg-orange-50 transition-colors"
              >
                <div className="flex-shrink-0 w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                  <ResourceIcon name={resource.icon} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-800 group-hover:text-orange-600 transition-colors">
                    {resource.title}
                  </h3>
                  <p className="text-sm text-gray-500 truncate">{resource.description}</p>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-orange-500 group-hover:translate-x-1 transition-all flex-shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
