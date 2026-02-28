import { Link } from '@/i18n/routing'
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
      <div className="container mx-auto rounded-4xl bg-orange-600 p-8 md:p-16 text-center">
        <H2 className="text-3xl md:text-4xl font-bold text-white text-shadow-sm mb-4">
          {title}
        </H2>
        <p className="text-xl text-white text-shadow-sm mb-8 max-w-4xl mx-auto">
          {subtitle}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a
            href={`tel:${phone}`}
            aria-label={ui.buttons.callAriaLabel}
            className="bg-white text-orange-600 font-bold py-4 px-8 rounded-lg hover:bg-orange-50 transition-colors text-center border-2 border-transparent"
          >
            {ui.buttons.callPrefix} {phoneDisplay}
          </a>
          <Link
            href={buttonHref}
            className="border-2 border-white text-white text-shadow-sm font-bold py-4 px-8 rounded-lg hover:bg-orange-700 transition-colors text-center"
          >
            {buttonText}
          </Link>
        </div>
      </div>
    </section>
  )
}
