'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'

function categoryToSlug(category: string): string {
  return category
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

// Non-service/general topic categories shown as top-level pills
const TOPIC_CATEGORIES = [
  'Fun Facts',
  'Home & Living',
  'Lifestyle',
  'Location Guide',
  'Moving Tips',
]

interface BlogCategoryFilterProps {
  categories: string[]
  activeCategory: string | null
  locations?: Array<{ slug: string; name: string }>
  activeLocation?: string | null
  activeService?: string | null
}

export default function BlogCategoryFilter({ categories, activeCategory, locations, activeLocation, activeService }: BlogCategoryFilterProps) {
  const [servicesOpen, setServicesOpen] = useState(false)
  const [locationsOpen, setLocationsOpen] = useState(false)
  const servicesRef = useRef<HTMLDivElement>(null)
  const locationsRef = useRef<HTMLDivElement>(null)

  // Split categories into topics (shown as pills) and services (grouped in dropdown)
  const topicCategories = categories.filter(c => TOPIC_CATEGORIES.includes(c))
  const serviceCategories = categories.filter(c => !TOPIC_CATEGORIES.includes(c)).sort((a, b) => a.localeCompare(b))

  const isServiceActive = !!activeService || (activeCategory ? serviceCategories.includes(activeCategory) : false)
  const isLocationActive = !!activeLocation

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (servicesRef.current && !servicesRef.current.contains(e.target as Node)) {
        setServicesOpen(false)
      }
      if (locationsRef.current && !locationsRef.current.contains(e.target as Node)) {
        setLocationsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const pillClass = (isActive: boolean) =>
    `px-4 py-2 rounded-full text-sm font-medium transition-colors ${
      isActive
        ? 'bg-orange-500 text-white'
        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
    }`

  return (
    <div className="flex flex-wrap justify-center gap-3 mb-12">
      {/* All Posts */}
      <Link href="/blog" className={pillClass(!activeCategory && !activeLocation && !activeService)}>
        All Posts
      </Link>

      {/* Topic categories as individual pills */}
      {topicCategories.map((cat) => (
        <Link
          key={cat}
          href={`/blog/category/${encodeURIComponent(categoryToSlug(cat))}`}
          className={pillClass(activeCategory === cat)}
        >
          {cat}
        </Link>
      ))}

      {/* Services dropdown */}
      <div className="relative" ref={servicesRef}>
        <button
          onClick={() => { setServicesOpen(!servicesOpen); setLocationsOpen(false) }}
          className={`${pillClass(isServiceActive)} inline-flex items-center gap-1.5`}
        >
          {isServiceActive && activeService ? serviceCategories.find(c => categoryToSlug(c) === activeService) || 'Services' : isServiceActive && activeCategory ? activeCategory : 'Services'}
          <ChevronDown className={`w-4 h-4 transition-transform ${servicesOpen ? 'rotate-180' : ''}`} />
        </button>

        {servicesOpen && (
          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white rounded-2xl shadow-lg border border-gray-200 py-3 z-50 w-64 max-h-80 overflow-y-auto">
            {serviceCategories.map((cat) => {
              const slug = categoryToSlug(cat)
              return (
                <Link
                  key={cat}
                  href={`/blog/service/${encodeURIComponent(slug)}`}
                  onClick={() => setServicesOpen(false)}
                  className={`block px-4 py-2 text-sm transition-colors ${
                    activeService === slug
                      ? 'bg-orange-50 text-orange-600 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {cat}
                </Link>
              )
            })}
          </div>
        )}
      </div>

      {/* Locations dropdown */}
      {locations && locations.length > 0 && (
        <div className="relative" ref={locationsRef}>
          <button
            onClick={() => { setLocationsOpen(!locationsOpen); setServicesOpen(false) }}
            className={`${pillClass(isLocationActive)} inline-flex items-center gap-1.5`}
          >
            {isLocationActive && activeLocation ? locations.find(l => l.slug === activeLocation)?.name || 'Locations' : 'Locations'}
            <ChevronDown className={`w-4 h-4 transition-transform ${locationsOpen ? 'rotate-180' : ''}`} />
          </button>

          {locationsOpen && (
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white rounded-2xl shadow-lg border border-gray-200 py-3 z-50 w-64 max-h-80 overflow-y-auto">
              {locations.map((loc) => (
                <Link
                  key={loc.slug}
                  href={`/blog/location/${encodeURIComponent(loc.slug)}`}
                  onClick={() => setLocationsOpen(false)}
                  className={`block px-4 py-2 text-sm transition-colors ${
                    activeLocation === loc.slug
                      ? 'bg-orange-50 text-orange-600 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {loc.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
