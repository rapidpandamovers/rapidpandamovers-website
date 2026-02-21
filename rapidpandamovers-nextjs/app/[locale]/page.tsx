import Hero from '@/app/components/Hero'
import RatingSection from '@/app/components/RatingSection'
import MediaSection from '@/app/components/MediaSection'
import ServiceSection from '@/app/components/ServiceSection'
import ReviewSection from '@/app/components/ReviewSection'
import WhySection from '@/app/components/WhySection'
import LocationSection from '@/app/components/LocationSection'
import AboutSection from '@/app/components/AboutSection'
import BlogSection from '@/app/components/BlogSection'
import FAQSection from '@/app/components/FAQSection'
import QuoteSection from '@/app/components/QuoteSection'
import { WebSiteSchema } from '@/app/components/Schema'
import { getMessages, getLocale } from 'next-intl/server'
import { generatePageMetadata } from '@/lib/metadata'
import type { Locale } from '@/i18n/config'

export async function generateMetadata() {
  const locale = await getLocale() as Locale
  const { meta } = (await getMessages()) as any
  return generatePageMetadata({
    title: meta.home.title,
    description: meta.home.description,
    path: meta.home.path,
    locale,
  })
}

export default async function Home() {
  const locale = await getLocale() as Locale
  const { content } = (await getMessages()) as any

  return (
    <>
      <WebSiteSchema locale={locale} />
      <Hero
        title={content.home.hero.title}
        description={content.home.hero.description}
        cta={content.home.hero.cta}
      />
      <RatingSection />
      <MediaSection
        showArrows={false}
        showDots={false}
        enableModal={false}
        description=""
        items={[
          { type: 'video', src: '/videos/1.mp4' },
          { type: 'video', src: '/videos/2.mp4' },
          { type: 'video', src: '/videos/3.mp4' },
          { type: 'video', src: '/videos/4.mp4' },
        ]}
      />
      {/* Reviews Section */}
      <ReviewSection
        variant="left"
        title={content.home.reviewSection.title}
        showPagination={false}
        showPlatformFilter={false}
        limit={3}
      />
      <ServiceSection variant="left" />
      <LocationSection variant="left" />
      <FAQSection variant="compact" />
      <BlogSection
        variant="left"
        title={content.home.blogSection.title}
        showFeatured={false}
        showCategories={false}
        showExcerpts={false}
        showCategoryPill={false}
        showViewMore
        viewMoreButtonText={content.home.blogSection.viewMoreButtonText}
        viewMoreLink="/blog"
        maxPosts={3}
      />
      <WhySection variant="left" />
      <AboutSection />
      <QuoteSection />
    </>
  )
}