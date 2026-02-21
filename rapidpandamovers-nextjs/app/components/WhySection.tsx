import { CheckCircle, LucideIcon, ArrowRight } from 'lucide-react'
import { Link } from '@/i18n/routing'
import { resolveIcon } from '@/lib/icons'
import { getMessages, getLocale } from 'next-intl/server'
import { getTranslatedSlug } from '@/i18n/slug-map'
import type { Locale } from '@/i18n/config'
import { H2, H3 } from '@/app/components/Heading'

interface Benefit {
  icon?: LucideIcon | string;
  title: string;
  desc?: string;
  details?: string[];
}

interface WhySectionProps {
  title?: string | React.ReactNode;
  subtitle?: string;
  benefits?: Benefit[] | string[];
  ctaText?: string;
  ctaLink?: string;
  variant?: 'default' | 'detail' | 'left';
}

const bgColors = ['bg-orange-50', 'bg-gray-50']

export default async function WhySection({
  title,
  subtitle,
  benefits: customBenefits,
  ctaText,
  ctaLink,
  variant = 'default',
}: WhySectionProps = {}) {
  const { content, ui } = (await getMessages()) as any
  const locale = await getLocale() as Locale
  const jsonDefaults = content.home.why_choose_us.benefits
  const defaultBenefits: Benefit[] = jsonDefaults.map((b: any) => ({
    icon: resolveIcon(b.icon),
    title: b.title,
    desc: b.desc,
  }))

  // Convert string array or JSON objects to Benefit objects if needed
  const benefits: Benefit[] = customBenefits
    ? customBenefits.map(b => {
        if (typeof b === 'string') return { icon: CheckCircle, title: b }
        if (typeof b.icon === 'string') return { ...b, icon: resolveIcon(b.icon) }
        return b
      })
    : defaultBenefits;

  const displayCtaText = ctaText || ui.why.defaultCta;
  const displayCtaLink = ctaLink ?? `/${getTranslatedSlug('why-choose-us', locale)}`;

  // Detail variant — colorful cards with icon, description, and checklist
  if (variant === 'detail') {
    return (
      <section className="pt-20">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <H2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              {title ? title : ui.why.differenceTitle}
            </H2>
            {subtitle && (
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {subtitle}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => {
              const IconComponent = benefit.icon || CheckCircle
              return (
                <div key={index} className={`${bgColors[index % bgColors.length]} rounded-4xl p-8`}>
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6">
                    <IconComponent className="w-8 h-8 text-orange-500" />
                  </div>
                  <H3 className="text-xl font-bold text-gray-800 mb-3">{benefit.title}</H3>
                  {benefit.desc && <p className="text-gray-600 mb-4">{benefit.desc}</p>}
                  {benefit.details && benefit.details.length > 0 && (
                    <ul className="space-y-2">
                      {benefit.details.map((detail, i) => (
                        <li key={i} className="flex items-center text-sm text-gray-600">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>
    )
  }

  // Left variant — left-aligned header with inline CTA link
  if (variant === 'left') {
    return (
      <section className="pt-20">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10">
            <div>
              <H2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                {title ? title : ui.why.defaultTitle}
              </H2>
              {subtitle && (
                <p className="text-lg text-gray-600">
                  {subtitle}
                </p>
              )}
            </div>
            {displayCtaLink && (
              <Link
                href={displayCtaLink}
                className="inline-flex items-center text-orange-700 hover:text-orange-800 font-semibold mt-4 md:mt-0"
              >
                {displayCtaText}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => {
              const IconComponent = benefit.icon || CheckCircle
              return (
                <div key={index} className={`${bgColors[index % bgColors.length]} rounded-4xl p-8`}>
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6">
                    <IconComponent className="w-8 h-8 text-orange-500" />
                  </div>
                  <H3 className="text-xl font-bold text-gray-800 mb-3">{benefit.title}</H3>
                  {benefit.desc && <p className="text-gray-600">{benefit.desc}</p>}
                </div>
              )
            })}
          </div>
        </div>
      </section>
    )
  }

  // Default variant — colorful cards without checklist
  return (
    <section className="pt-20">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <H2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            {title ? title : ui.why.defaultTitle}
          </H2>
          {subtitle && (
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => {
            const IconComponent = benefit.icon || CheckCircle
            return (
              <div key={index} className={`${bgColors[index % bgColors.length]} rounded-4xl p-8`}>
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6">
                  <IconComponent className="w-8 h-8 text-orange-500" />
                </div>
                <H3 className="text-xl font-bold text-gray-800 mb-3">{benefit.title}</H3>
                {benefit.desc && <p className="text-gray-600">{benefit.desc}</p>}
              </div>
            )
          })}
        </div>

        {displayCtaLink && (
          <div className="text-center mt-10">
            <Link href={displayCtaLink} className="inline-flex items-center bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors text-shadow-sm">
              {displayCtaText}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
