import Link from 'next/link'

interface QuoteSectionProps {
  title?: string
  subtitle?: string
  buttonText?: string
  buttonHref?: string
  phone?: string
  phoneDisplay?: string
}

export default function QuoteSection({
  title = 'Let Us Handle the Heavy Lifting',
  subtitle = "Skip the DIY stress. Get a free quote from Rapid Panda Movers and discover how affordable full-service moving can be.",
  buttonText = 'Get Your Free Quote',
  buttonHref = '/quote',
  phone = '7865854269',
  phoneDisplay = '(786) 585-4269'
}: QuoteSectionProps) {
  return (
    <section className="py-5">
      <div className="container mx-auto rounded-4xl bg-orange-500 p-8 md:p-16 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          {title}
        </h2>
        <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
          {subtitle}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href={buttonHref}
            className="inline-block bg-white text-orange-500 font-bold py-4 px-8 rounded-lg hover:bg-orange-50 transition-colors"
          >
            {buttonText}
          </Link>
          <a
            href={`tel:${phone}`}
            className="inline-block border-2 border-white text-white font-bold py-4 px-8 rounded-lg hover:bg-orange-600 transition-colors"
          >
            Call {phoneDisplay}
          </a>
        </div>
      </div>
    </section>
  )
}
