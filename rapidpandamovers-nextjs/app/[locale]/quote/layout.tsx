import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getLocale } from 'next-intl/server'
import { generatePageMetadata } from '@/lib/metadata'
import type { Locale } from '@/i18n/config'

export async function generateMetadata() {
  const locale = await getLocale() as Locale
  const { meta } = (await getMessages()) as any
  return generatePageMetadata({
    title: meta.quote.title,
    description: meta.quote.description,
    path: meta.quote.path,
    locale,
  })
}

export default async function QuoteLayout({ children }: { children: React.ReactNode }) {
  const { meta, ...messages } = (await getMessages()) as Record<string, any>
  // Quote page is a client component that accesses content.quote, content.contact, content.site.
  // Provide only the content keys it needs (not the full 67KB content.json).
  const { content, ...rest } = messages
  const quoteMessages = { ...rest, content: { site: content.site, quote: content.quote, contact: content.contact } }
  return (
    <NextIntlClientProvider messages={quoteMessages}>
      {children}
    </NextIntlClientProvider>
  )
}
