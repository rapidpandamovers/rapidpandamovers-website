'use client'

import { useState, useMemo } from 'react'
import { Link } from '@/i18n/routing'
import { useMessages, useLocale } from 'next-intl'
import { getTranslatedSlug } from '@/i18n/slug-map'
import type { Locale } from '@/i18n/config'
import { H2, H3 } from '@/app/components/Heading'

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
  title: titleProp,
  subtitle: subtitleProp,
  faqs,
  showViewAllLink = true,
  variant = 'default',
  compactCount = 3,
}: FAQSectionProps) {
  const { content, ui } = useMessages() as any
  const locale = useLocale() as Locale
  const title = titleProp ?? ui.faq.defaultTitle
  const subtitle = subtitleProp ?? ui.faq.defaultSubtitle
  const resolvedFaqs = faqs ?? content.faq.questions
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const displayFaqs = useMemo(() => {
    if (variant === 'compact') {
      return pickSpread(resolvedFaqs, compactCount)
    }
    return resolvedFaqs
  }, [resolvedFaqs, variant, compactCount])

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  const FAQAccordion = () => (
    <div className="space-y-4">
      {displayFaqs.map((faq: FAQ, index: number) => (
        <div key={index} className="bg-white border border-gray-200 rounded-xl">
          <button
            className="w-full p-6 text-left flex justify-between items-center hover:bg-gray-50 rounded-xl transition-colors"
            onClick={() => toggleFAQ(index)}
          >
            <H3 className="text-lg font-semibold text-gray-800 pr-4">
              {faq.question}
            </H3>
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
                  <Link href={`/${getTranslatedSlug(faq.link.replace(/^\//, ''), locale)}`} className="inline-flex items-center text-orange-700 hover:text-orange-800 font-medium mt-3">
                    {ui.faq.learnMore}
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
                  <H2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                    {title}
                  </H2>
                )}
              </div>

              <div className="bg-white rounded-2xl p-6 mt-2">
                <H3 className="font-semibold text-gray-800 mb-2">
                  {ui.faq.haveMoreQuestions}
                </H3>
                <p className="text-sm text-gray-600 mb-4">
                  {ui.faq.haveMoreQuestionsDesc}
                </p>
                <a
                  href={`tel:${content.site.phone.replace(/[^0-9]/g, '')}`}
                  className="flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors text-shadow-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  {ui.buttons.callPrefix} ({content.site.phone.slice(0,3)}) {content.site.phone.slice(4,7)}-{content.site.phone.slice(8)}
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
            <H2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              {title}
            </H2>
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
              href={`/${getTranslatedSlug('faq', locale)}`}
              className="inline-flex items-center text-orange-700 hover:text-orange-800 font-medium"
            >
              {ui.faq.viewAllFaqs}
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
