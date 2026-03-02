import { Link } from '@/i18n/routing'
import { ArrowRight, Phone } from 'lucide-react'
import { getMessages, getLocale } from 'next-intl/server'
import { getTranslatedSlug } from '@/i18n/slug-map'
import type { Locale } from '@/i18n/config'
import { H2 } from '@/app/components/Heading'

interface QuoteSectionProps {
  title?: string
  subtitle?: string
  buttonText?: string
  buttonHref?: string
  phone?: string
  phoneDisplay?: string
}

export default async function QuoteSection({
  title,
  subtitle,
  buttonText,
  buttonHref = '/quote',
  phone,
  phoneDisplay
}: QuoteSectionProps) {
  const { content, ui } = (await getMessages()) as any
  const locale = await getLocale() as Locale
  buttonHref = buttonHref === '/quote' ? `/${getTranslatedSlug('quote', locale)}` : buttonHref
  const sitePhone = content.site.phone
  const defaultPhone = sitePhone.replace(/-/g, '')
  const defaultPhoneDisplay = `(${sitePhone.slice(0,3)}) ${sitePhone.slice(4,7)}-${sitePhone.slice(8)}`
  title = title ?? ui.quote.defaultTitle
  subtitle = subtitle ?? ui.quote.defaultSubtitle
  buttonText = buttonText ?? ui.buttons.getQuote
  phone = phone ?? defaultPhone
  phoneDisplay = phoneDisplay ?? defaultPhoneDisplay
  return (
    <section className="pt-20">
      <div className="container mx-auto rounded-4xl bg-orange-700 p-8 md:p-16 text-center">
        <H2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          {title}
        </H2>
        <p className="text-xl text-white mb-8 max-w-4xl mx-auto">
          {subtitle}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-stretch">
          <a
            href={`tel:${phone}`}
            className="flex items-center justify-center gap-2 bg-white text-orange-700 font-bold py-3 px-8 rounded-lg hover:bg-orange-50 transition-colors border-2 border-transparent sm:flex-1 sm:max-w-xs"
          >
            <Phone className="w-4 h-4" />
            {ui.buttons.callPrefix} {phoneDisplay}
          </a>
          <Link
            href={buttonHref}
            className="flex items-center justify-center gap-2 border-2 border-white text-white font-bold py-3 px-8 rounded-lg hover:bg-orange-800 transition-colors sm:flex-1 sm:max-w-xs"
          >
            {buttonText}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
