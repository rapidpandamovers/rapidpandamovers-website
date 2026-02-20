import Link from 'next/link'
import { CheckCircle } from 'lucide-react'
import { ImageCollage } from './ImageCollage'
import content from '@/data/content.json'

const about = content.about

interface AboutSectionProps {
  className?: string
  variant?: 'default' | 'detail'
  showLink?: boolean
}

export default function AboutSection({ className = "", variant = "default", showLink = true }: AboutSectionProps) {
  if (variant === 'detail') {
    return (
      <section className={`pt-20 ${className}`}>
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Mission & Values */}
            <div className="bg-orange-50 rounded-4xl p-8">
              <h3 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">{about.mission.title}</h3>
              <p className="text-gray-700 mb-6">
                {about.mission.content}
              </p>

              <h3 className="text-xl font-bold text-gray-800 mb-4">Our Values</h3>
              <ul className="space-y-3">
                {about.values.map((value, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{value.description}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Our Story */}
            <div className="bg-gray-50 rounded-4xl p-8">
              <h3 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">{about.story.title}</h3>
              {about.story.paragraphs.map((paragraph, index) => (
                <p key={index} className="text-gray-700 mb-6">
                  {paragraph}
                </p>
              ))}

              {showLink && (
                <div className="bg-white rounded-2xl p-6">
                  <h4 className="font-semibold text-gray-800 mb-2">Want to know what makes us different?</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Learn about our commitment to excellence, transparent pricing, and satisfaction guarantee.
                  </p>
                  <Link href="/why-choose-us" className="inline-flex items-center text-orange-500 hover:text-orange-600 font-medium">
                    Why Choose Rapid Panda
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className={`pt-20 px-4 md:px-6 lg:px-8 ${className}`}>
      <div className="container mx-auto rounded-4xl bg-black p-6 md:p-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                {about.title}
              </h2>
              {about.summary.map((paragraph, index) => (
                <p key={index} className={`text-lg text-orange-100 ${index < about.summary.length - 1 ? 'mb-6' : 'mb-8'} leading-relaxed`}>
                  {paragraph}
                </p>
              ))}
              <Link
                href="/about-us"
                className="inline-flex items-center bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
              >
                Learn More About Us
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            <div className="flex justify-center relative">
                <ImageCollage
                  slot1Src="/images/hero/1.jpg"
                  slot2Src="/images/hero/2.jpg"
                  slot3Src="/images/hero/3.jpg"
                />
              </div>
            </div>
          </div>
        </div>

    </section>
  )
}
