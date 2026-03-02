import { Metadata } from 'next'
import { getMessages } from 'next-intl/server'

export const metadata: Metadata = {
  title: 'Frequently Asked Questions',
  description: 'Find answers to common questions about our Miami moving services, pricing, scheduling, and what to expect on moving day.',
}

export default async function FAQLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { content } = (await getMessages()) as any

  // Generate FAQ structured data for rich snippets
  const faqStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: content.faq.questions.map((faq: { question: string; answer: string }) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqStructuredData),
        }}
      />
      {children}
    </>
  )
}
