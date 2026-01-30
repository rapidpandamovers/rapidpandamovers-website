'use client'

import { useState } from 'react'
import Link from 'next/link'
import content from '../../data/content.json'
import Hero from '../components/Hero'

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <Hero
        title={content.faq.title}
        description={content.faq.description}
        cta="Get Your Free Quote"
      />

      {/* FAQ Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-4">
              {content.faq.questions.map((faq, index) => (
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

            {/* Contact CTA */}
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
                    href="/contact" 
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
          </div>
        </div>
      </section>

      {/* Additional Resources */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              More Moving Resources
            </h2>
            <p className="text-gray-600">
              Explore our comprehensive guides and tips for a successful move
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Link href="/moving-tips" className="group">
              <div className="bg-gray-50 hover:bg-gray-100 rounded-lg p-6 transition-colors">
                <div className="text-orange-500 mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-orange-500 transition-colors">
                  Moving Tips
                </h3>
                <p className="text-gray-600">
                  Expert advice to make your move easier and more efficient
                </p>
              </div>
            </Link>

            <Link href="/moving-checklist" className="group">
              <div className="bg-gray-50 hover:bg-gray-100 rounded-lg p-6 transition-colors">
                <div className="text-orange-500 mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-orange-500 transition-colors">
                  Moving Checklist
                </h3>
                <p className="text-gray-600">
                  Complete checklist to ensure nothing is forgotten during your move
                </p>
              </div>
            </Link>

            <Link href="/moving-glossary" className="group">
              <div className="bg-gray-50 hover:bg-gray-100 rounded-lg p-6 transition-colors">
                <div className="text-orange-500 mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-orange-500 transition-colors">
                  Moving Glossary
                </h3>
                <p className="text-gray-600">
                  Learn common moving terms and definitions
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
