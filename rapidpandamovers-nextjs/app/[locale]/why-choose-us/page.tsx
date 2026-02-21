import { Link } from '@/i18n/routing'
import Hero from '@/app/components/Hero'
import IncludedSection from '@/app/components/IncludedSection'
import PromiseSection from '@/app/components/PromiseSection'
import WhySection from '@/app/components/WhySection'
import CompareTable from '@/app/components/CompareTable'
import ReviewSection from '@/app/components/ReviewSection'
import QuoteSection from '@/app/components/QuoteSection'
import { getMessages, getLocale } from 'next-intl/server'
import { generatePageMetadata } from '@/lib/metadata'
import type { Locale } from '@/i18n/config'

export async function generateMetadata() {
  const locale = await getLocale() as Locale
  const { meta } = (await getMessages()) as any
  return generatePageMetadata({
    title: meta.whyChooseUs.title,
    description: meta.whyChooseUs.description,
    path: meta.whyChooseUs.path,
    locale,
  })
}

export default async function WhyChooseUsPage() {
  const { content } = (await getMessages()) as any
  const pageData = content.why_choose_us

  return (
    <div className="min-h-screen">
      <Hero
        title={pageData.hero.title}
        description={pageData.hero.description}
        cta={pageData.hero.cta}
      />

      {/* Main Benefits */}
      <WhySection
        variant="detail"
        title={pageData.whySection.title}
        subtitle={pageData.whySection.subtitle}
        benefits={pageData.main_benefits}
      />

      {/* Our Promise */}
      <PromiseSection cards={pageData.promise_cards} />

      {/* Reviews */}
      <ReviewSection
        variant="compact"
        title={pageData.reviewSection.title}
        subtitle={pageData.reviewSection.subtitle}
      />

      {/* Additional Reasons */}
      <IncludedSection
        title={pageData.includedSection.title}
        items={pageData.additional_reasons}
        background="gray"
      />

      {/* Comparison */}
      <CompareTable
        title={pageData.comparison.title}
        columns={pageData.comparison.columns}
        rows={pageData.comparison.rows}
      />

      {/* Compare Link */}
      <div className="text-center -mt-10 pt-20">
        <Link
          href="/compare"
          className="text-orange-700 hover:text-orange-800 font-medium inline-flex items-center"
        >
          {pageData.compareLink}
        </Link>
      </div>

      

      {/* CTA */}
      <QuoteSection
        title={pageData.quote.title}
        subtitle={pageData.quote.subtitle}
      />
      
    </div>
  )
}
