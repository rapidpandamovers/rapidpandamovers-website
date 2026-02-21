import Hero from '@/app/components/Hero'
import ContactSection from '@/app/components/ContactSection'
import MapSection from '@/app/components/MapSection'
import NewsletterSection from '@/app/components/NewsletterSection'
import QuoteSection from '@/app/components/QuoteSection'
import { getMessages, getLocale } from 'next-intl/server'
import { generatePageMetadata } from '@/lib/metadata'
import type { Locale } from '@/i18n/config'

export async function generateMetadata() {
  const locale = await getLocale() as Locale
  const { meta } = (await getMessages()) as any
  return generatePageMetadata({
    title: meta.contact.title,
    description: meta.contact.description,
    path: meta.contact.path,
    locale,
  })
}

export default async function ContactPage() {
  const { content } = (await getMessages()) as any

  return (
    <div className="min-h-screen">
      <Hero
        title={content.contact.hero.title}
        description={content.contact.hero.description}
        cta={content.contact.hero.cta}
      />

      <ContactSection />

      <MapSection
        location={{
          name: 'Rapid Panda Movers',
          address: '7001 North Waterway Dr #107',
          city: 'Miami',
          state: 'FL',
          zip: '33155'
        }}
        title={content.contact.mapSection.title}
        height="450px"
      />

      <NewsletterSection />

      <QuoteSection />
    </div>
  )
}
