import { Link } from '@/i18n/routing'
import { CheckCircle } from 'lucide-react'
import { ImageCollage } from './ImageCollage'
import { getMessages, getLocale } from 'next-intl/server'
import { getTranslatedSlug } from '@/i18n/slug-map'
import type { Locale } from '@/i18n/config'
import { H2, H3 } from '@/app/components/Heading'

interface AboutSectionProps {
  className?: string
  variant?: 'default' | 'detail'
  showLink?: boolean
}

export default async function AboutSection({ className = "", variant = "default", showLink = true }: AboutSectionProps) {
  const { content, ui } = (await getMessages()) as any
  const locale = await getLocale() as Locale
  const about = content.about
  if (variant === 'detail') {
    return (
      <section className={`pt-20 ${className}`}>
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Mission & Values */}
            <div className="bg-orange-50 rounded-4xl p-8">
              <H3 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">{about.mission.title}</H3>
              <p className="text-gray-700 mb-6">
                {about.mission.content}
              </p>

              <H3 className="text-xl font-bold text-gray-800 mb-4">{ui.about.ourValues}</H3>
              <ul className="space-y-3">
                {about.values.map((value: any, index: number) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{value.description}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Our Story */}
            <div className="bg-gray-50 rounded-4xl p-8">
              <H3 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">{about.story.title}</H3>
              {about.story.paragraphs.map((paragraph: string, index: number) => (
                <p key={index} className="text-gray-700 mb-6">
                  {paragraph}
                </p>
              ))}

              {showLink && (
                <div className="bg-white rounded-2xl p-6">
                  <h4 className="font-semibold text-gray-800 mb-2">{ui.about.knowDifferent}</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    {ui.about.knowDifferentDesc}
                  </p>
                  <Link href={`/${getTranslatedSlug('why-choose-us', locale)}`} className="inline-flex items-center text-orange-700 hover:text-orange-800 font-medium">
                    {ui.about.whyChoose}
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
              <H2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                {about.title}
              </H2>
              {about.summary.map((paragraph: string, index: number) => (
                <p key={index} className={`text-lg text-white/90 ${index < about.summary.length - 1 ? 'mb-6' : 'mb-8'} leading-relaxed`}>
                  {paragraph}
                </p>
              ))}
              <Link
                href={`/${getTranslatedSlug('about-us', locale)}`}
                className="inline-flex items-center bg-orange-600 hover:bg-orange-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
              >
                {ui.about.learnMoreAboutUs}
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
