import Link from 'next/link'
import content from '@/data/content.json'
import ui from '@/data/ui.json'

interface QuoteSectionProps {
  title?: string
  subtitle?: string
  buttonText?: string
  buttonHref?: string
  phone?: string
  phoneDisplay?: string
}

const sitePhone = content.site.phone
const defaultPhone = sitePhone.replace(/-/g, '')
const defaultPhoneDisplay = `(${sitePhone.slice(0,3)}) ${sitePhone.slice(4,7)}-${sitePhone.slice(8)}`

export default function QuoteSection({
  title = ui.quote.defaultTitle,
  subtitle = ui.quote.defaultSubtitle,
  buttonText = ui.buttons.getQuote,
  buttonHref = '/quote',
  phone = defaultPhone,
  phoneDisplay = defaultPhoneDisplay
}: QuoteSectionProps) {
  return (
    <section className="pt-20">
      <div className="container mx-auto rounded-4xl bg-orange-500 p-8 md:p-16 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          {title}
        </h2>
        <p className="text-xl text-orange-100 mb-8 max-w-4xl mx-auto">
          {subtitle}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a
            href={`tel:${phone}`}
            className="bg-white text-orange-500 font-bold py-4 px-8 rounded-lg hover:bg-orange-50 transition-colors text-center border-2 border-transparent"
          >
            {ui.buttons.callPrefix} {phoneDisplay}
          </a>
          <Link
            href={buttonHref}
            className="border-2 border-white text-white font-bold py-4 px-8 rounded-lg hover:bg-orange-600 transition-colors text-center"
          >
            {buttonText}
          </Link>
        </div>
      </div>
    </section>
  )
}
