'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import content from '@/data/content.json'

interface FAQ {
  question: string
  answer: string
  link?: string
}

interface FAQSectionProps {
  title?: string
  subtitle?: string
  faqs?: FAQ[]
  showViewAllLink?: boolean
  variant?: 'default' | 'compact'
  compactCount?: number
}

// Pick evenly spaced items for a deterministic subset
function pickSpread<T>(array: T[], count: number): T[] {
  if (array.length <= count) return array
  const step = array.length / count
  return Array.from({ length: count }, (_, i) => array[Math.floor(i * step)])
}

export default function FAQSection({
  title = 'Frequently Asked Questions',
  subtitle = 'Common questions about our moving services',
  faqs = content.faq.questions,
  showViewAllLink = true,
  variant = 'default',
  compactCount = 3,
}: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const displayFaqs = useMemo(() => {
    if (variant === 'compact') {
      return pickSpread(faqs, compactCount)
    }
    return faqs
  }, [faqs, variant, compactCount])

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  const FAQAccordion = () => (
    <div className="space-y-4">
      {displayFaqs.map((faq, index) => (
        <div key={index} className="bg-white border border-gray-200 rounded-xl">
          <button
            className="w-full p-6 text-left flex justify-between items-center hover:bg-gray-50 rounded-xl transition-colors"
            onClick={() => toggleFAQ(index)}
          >
            <h3 className="text-lg font-semibold text-gray-800 pr-4">
              {faq.question}
            </h3>
            <div className="flex-shrink-0">
              <svg
                className={`w-6 h-6 text-orange-500 transition-transform ${
                  openIndex === index ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </button>

          {openIndex === index && (
            <div className="px-6 pb-6">
              <div className="border-t border-gray-200 pt-4">
                <p className="text-gray-600 leading-relaxed">
                  {faq.answer}
                </p>
                {faq.link && (
                  <Link href={faq.link} className="inline-flex items-center text-orange-500 hover:text-orange-600 font-medium mt-3">
                    Learn more
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )

  // Compact 2-column layout
  if (variant === 'compact') {
    return (
      <section className="pt-20">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Title & CTA */}
            <div className="bg-orange-50 rounded-4xl p-8 flex flex-col">
              <div className="flex-1">
                {title && (
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                    {title}
                  </h2>
                )}
              </div>

              <div className="bg-white rounded-2xl p-6 mt-2">
                <h3 className="font-semibold text-gray-800 mb-2">
                  Have more questions?
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Our team is ready to help with your move.
                </p>
                <a
                  href={`tel:${content.site.phone.replace(/[^0-9]/g, '')}`}
                  className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Call ({content.site.phone.slice(0,3)}) {content.site.phone.slice(4,7)}-{content.site.phone.slice(8)}
                </a>
              </div>
            </div>

            {/* Right Column - FAQ Accordion */}
            <div className="bg-gray-50 rounded-4xl p-8">
              <FAQAccordion />
            </div>
          </div>
        </div>
      </section>
    )
  }

  // Default full-width layout
  return (
    <section className="pt-20">
      <div className="container mx-auto">
        {title && (
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              {title}
            </h2>
            {subtitle && (
              <p className="text-xl text-gray-600">
                {subtitle}
              </p>
            )}
          </div>
        )}

        <div className="bg-gray-50 rounded-4xl p-8">
          <FAQAccordion />
        </div>

        {showViewAllLink && (
          <div className="text-center mt-8">
            <Link
              href="/faq"
              className="inline-flex items-center text-orange-500 hover:text-orange-600 font-medium"
            >
              View All FAQs
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
