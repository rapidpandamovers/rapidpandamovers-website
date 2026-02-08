'use client'

import { useState } from 'react'
import Link from 'next/link'
import content from '@/data/content.json'

interface FAQ {
  question: string
  answer: string
}

interface FAQSectionProps {
  title?: string
  subtitle?: string
  faqs?: FAQ[]
  showViewAllLink?: boolean
  showContactCTA?: boolean
  variant?: 'default' | 'compact'
  phone?: string
  phoneDisplay?: string
}

const sitePhone = content.site.phone
const defaultPhone = sitePhone.replace(/-/g, '')
const defaultPhoneDisplay = `(${sitePhone.slice(0,3)}) ${sitePhone.slice(4,7)}-${sitePhone.slice(8)}`

const defaultFaqs: FAQ[] = [
  { question: 'How much will my move cost?', answer: 'Moving costs depend on several factors including distance, size of move, and services needed. Contact us for a free, accurate quote.' },
  { question: 'What happens if something gets damaged?', answer: 'We are fully licensed and insured. All moves are covered by our comprehensive insurance policy for your peace of mind.' },
  { question: 'How can I prepare for my move?', answer: 'Start by decluttering, gather packing supplies, and confirm your moving date. We provide a complete moving checklist to help you prepare.' },
  { question: 'Do you offer same-day moving services?', answer: 'Yes! We offer same-day and emergency moving services throughout Miami-Dade County, subject to availability.' }
]

export default function FAQSection({
  title = 'Have a Question?',
  subtitle = 'Frequently Asked Questions',
  faqs = defaultFaqs,
  showViewAllLink = true,
  showContactCTA = false,
  variant = 'default',
  phone = defaultPhone,
  phoneDisplay = defaultPhoneDisplay
}: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  // FAQ accordion component (reused in both layouts)
  const FAQAccordion = () => (
    <div className="space-y-4">
      {faqs.map((faq, index) => (
        <div key={index} className="bg-white border border-gray-200 rounded-lg shadow-sm">
          <button
            className="w-full p-6 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
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
      <section className="py-20">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Left Column - Title, Description, CTA */}
            <div className="lg:sticky lg:top-8">
              {title && (
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                  {title.includes(' ') ? (
                    <>
                      {title.split(' ').slice(0, -1).join(' ')}{' '}
                      <span className="text-orange-500">{title.split(' ').slice(-1)}</span>
                    </>
                  ) : (
                    <span className="text-orange-500">{title}</span>
                  )}
                </h2>
              )}
              {subtitle && (
                <p className="text-xl text-gray-600 mb-8">
                  {subtitle}
                </p>
              )}

              {/* Have more questions CTA */}
              <div className="bg-gray-100 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Have more questions?
                </h3>
                <p className="text-gray-600 mb-6">
                  Our team is ready to help with your move.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    href="/contact-us"
                    className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors text-center"
                  >
                    Contact Us
                  </Link>
                  <a
                    href={`tel:${phone}`}
                    className="border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white font-semibold py-3 px-6 rounded-lg transition-colors text-center"
                  >
                    Call {phoneDisplay}
                  </a>
                </div>
              </div>
            </div>

            {/* Right Column - FAQ Accordion */}
            <div>
              <FAQAccordion />
            </div>
          </div>
        </div>
      </section>
    )
  }

  // Default full-width layout
  return (
    <section className="py-20">
      <div className="container mx-auto">
        {title && (
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              {title.includes(' ') ? (
                <>
                  {title.split(' ').slice(0, -1).join(' ')}{' '}
                  <span className="text-orange-500">{title.split(' ').slice(-1)}</span>
                </>
              ) : (
                <span className="text-orange-500">{title}</span>
              )}
            </h2>
            {subtitle && (
              <p className="text-xl text-gray-600">
                {subtitle}
              </p>
            )}
          </div>
        )}

        <div className="mx-auto">
          <FAQAccordion />

          {/* Contact CTA Card */}
          {showContactCTA && (
            <div className="text-center mt-16">
              <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  Still Have Questions?
                </h3>
                <p className="text-gray-600 mb-6">
                  Our team is here to help! Contact us for personalized assistance with your move.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/contact-us"
                    className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
                  >
                    Contact Us
                  </Link>
                  <Link
                    href="/quote"
                    className="border border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white font-semibold py-3 px-8 rounded-lg transition-colors"
                  >
                    Get Free Quote
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Simple CTA Buttons */}
          {!showContactCTA && (
            <div className="text-center mt-12 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact-us"
                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
              >
                Contact Us
              </Link>
              {showViewAllLink && (
                <Link
                  href="/faq"
                  className="border border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white font-semibold py-3 px-8 rounded-lg transition-colors"
                >
                  View All FAQs
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
