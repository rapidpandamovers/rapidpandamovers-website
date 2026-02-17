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
}

export default function BlogCategoryFilter({ categories, activeCategory }: BlogCategoryFilterProps) {
  const [servicesOpen, setServicesOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Split categories into topics (shown as pills) and services (grouped in dropdown)
  const topicCategories = categories.filter(c => TOPIC_CATEGORIES.includes(c))
  const serviceCategories = categories.filter(c => !TOPIC_CATEGORIES.includes(c))

  const isServiceActive = activeCategory ? serviceCategories.includes(activeCategory) : false

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setServicesOpen(false)
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
      <Link href="/blog" className={pillClass(!activeCategory)}>
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
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setServicesOpen(!servicesOpen)}
          className={`${pillClass(isServiceActive)} inline-flex items-center gap-1.5`}
        >
          {isServiceActive ? activeCategory : 'Services'}
          <ChevronDown className={`w-4 h-4 transition-transform ${servicesOpen ? 'rotate-180' : ''}`} />
        </button>

        {servicesOpen && (
          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white rounded-2xl shadow-lg border border-gray-200 py-3 z-50 w-64 max-h-80 overflow-y-auto">
            {serviceCategories.map((cat) => (
              <Link
                key={cat}
                href={`/blog/category/${encodeURIComponent(categoryToSlug(cat))}`}
                onClick={() => setServicesOpen(false)}
                className={`block px-4 py-2 text-sm transition-colors ${
                  activeCategory === cat
                    ? 'bg-orange-50 text-orange-600 font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {cat}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
