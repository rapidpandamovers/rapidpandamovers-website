import type { Metadata } from 'next'
import { getMessages, getLocale } from 'next-intl/server'
import Hero from '@/app/components/Hero'
import FAQSection from '@/app/components/FAQSection'
import ResourceSection from '@/app/components/ResourceSection'
import QuoteSection from '@/app/components/QuoteSection'
import { FAQSchema } from '@/app/components/Schema'
import { generatePageMetadata } from '@/lib/metadata'
import type { Locale } from '@/i18n/config'

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale() as Locale
  const { meta } = (await getMessages()) as any
  return generatePageMetadata({
    title: meta.faq.title,
    description: meta.faq.description,
    path: meta.faq.path,
    locale,
  })
}

export default async function FAQPage() {
  const locale = await getLocale() as Locale
  const { content } = (await getMessages()) as any
  return (
    <div className="min-h-screen">
      {/* Schema Markup */}
      <FAQSchema faqs={content.faq.questions} locale={locale} />

      {/* Hero Section */}
      <Hero
        title={content.faq.title}
        description={content.faq.description}
        cta={content.faq.hero.cta}
      />

      {/* FAQ Section */}
      <FAQSection
        title=""
        faqs={content.faq.questions}
        showViewAllLink={false}
      />

      {/* Additional Resources */}
      <ResourceSection
        title={content.faq.resourceSection.title}
        subtitle={content.faq.resourceSection.subtitle}
        variant="grid"
      />

      {/* CTA Section */}
      <QuoteSection
        title={content.faq.quote.title}
        subtitle={content.faq.quote.subtitle}
      />
    </div>
  )
}
