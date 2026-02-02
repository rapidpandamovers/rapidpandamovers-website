'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  HelpCircle,
  BookOpen,
  Lightbulb,
  CheckSquare,
  BookMarked,
  DollarSign,
  Star,
  ArrowRight
} from 'lucide-react'

interface Resource {
  title: string
  description: string
  href: string
  icon: React.ReactNode
}

const resources: Resource[] = [
  {
    title: 'FAQ',
    description: 'Answers to common questions about our moving services',
    href: '/faq',
    icon: <HelpCircle className="w-6 h-6" />,
  },
  {
    title: 'Blog',
    description: 'Moving tips, guides, and industry insights',
    href: '/blog',
    icon: <BookOpen className="w-6 h-6" />,
  },
  {
    title: 'Moving Tips',
    description: 'Expert advice for a smooth moving experience',
    href: '/moving-tips',
    icon: <Lightbulb className="w-6 h-6" />,
  },
  {
    title: 'Moving Checklist',
    description: 'Step-by-step guide to organize your move',
    href: '/moving-checklist',
    icon: <CheckSquare className="w-6 h-6" />,
  },
  {
    title: 'Moving Glossary',
    description: 'Definitions of moving industry terms',
    href: '/moving-glossary',
    icon: <BookMarked className="w-6 h-6" />,
  },
  {
    title: 'Moving Rates',
    description: 'Transparent pricing for all our services',
    href: '/moving-rates',
    icon: <DollarSign className="w-6 h-6" />,
  },
  {
    title: 'Customer Reviews',
    description: 'See what our customers say about us',
    href: '/reviews',
    icon: <Star className="w-6 h-6" />,
  },
]

interface ResourceSectionProps {
  title?: string
  subtitle?: string
  className?: string
  maxItems?: number
  variant?: 'default' | 'compact' | 'grid'
}

export default function ResourceSection({
  title = 'Helpful Resources',
  subtitle = 'Everything you need to plan your move',
  className = '',
  maxItems,
  variant = 'default',
}: ResourceSectionProps) {
  const pathname = usePathname()

  // Filter out the current page from the resources list
  const filteredResources = resources.filter(
    (resource) => resource.href !== pathname
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
      <section className={`py-12 ${className}`}>
        <div className="container mx-auto">
          <h3 className="text-xl font-bold text-gray-900 mb-6">{title}</h3>
          <div className="flex flex-wrap gap-3">
            {displayResources.map((resource) => (
              <Link
                key={resource.href}
                href={resource.href}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:border-orange-500 hover:text-orange-600 transition-colors"
              >
                <span className="text-orange-500">{resource.icon}</span>
                <span className="font-medium">{resource.title}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (variant === 'grid') {
    return (
      <section className={`py-16 ${className}`}>
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{title}</h2>
            <p className="text-lg text-gray-600">{subtitle}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayResources.map((resource) => (
              <Link
                key={resource.href}
                href={resource.href}
                className="group bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
              >
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center text-orange-500 mb-4 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                  {resource.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                  {resource.title}
                </h3>
                <p className="text-sm text-gray-600">{resource.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    )
  }

  // Default variant - horizontal cards with arrows
  return (
    <section className={`py-16 ${className}`}>
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{title}</h2>
          <p className="text-lg text-gray-600">{subtitle}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayResources.map((resource) => (
            <Link
              key={resource.href}
              href={resource.href}
              className="group flex items-center gap-4 bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-all border border-gray-100 hover:border-orange-200"
            >
              <div className="flex-shrink-0 w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                {resource.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
                  {resource.title}
                </h3>
                <p className="text-sm text-gray-500 truncate">{resource.description}</p>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-orange-500 group-hover:translate-x-1 transition-all flex-shrink-0" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
