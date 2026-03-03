import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import Hero from '@/app/components/Hero'
import RatingSection from '@/app/components/RatingSection'
import ServiceSection from '@/app/components/ServiceSection'
import WhySection from '@/app/components/WhySection'
import LocationSection from '@/app/components/LocationSection'
import AboutSection from '@/app/components/AboutSection'
import BlogSection from '@/app/components/BlogSection'
import QuoteSection from '@/app/components/QuoteSection'
import { getMessages, getLocale } from 'next-intl/server'
import { generatePageMetadata, getSiteUrl, SITE_CONFIG } from '@/lib/metadata'
import type { Locale } from '@/i18n/config'
import { latestReviews } from '@/lib/utils'
import { generateWebSiteSchema, generateWebPageSchema, generateNavigationSchema, generateFAQSchema, generateVideoSchema, generateIndividualReviewsSchema, generateHowToSchema } from '@/lib/schema'
import reviewsData from '@/data/reviews.json'
import navEn from '@/data/navigation.json'
import navEs from '@/data/es/navigation.json'

// Below-fold client components — lazy loaded
const MediaSection = dynamic(() => import('@/app/components/MediaSection'))
const ReviewSection = dynamic(() => import('@/app/components/ReviewSection'))
const FAQSection = dynamic(() => import('@/app/components/FAQSection'))

function interpolateReviewStats(text: string): string {
  return text
    .replace(/\{rating\}/g, String(reviewsData.stats.averageRating))
    .replace(/\{reviewCount\}/g, String(reviewsData.stats.totalReviews))
}

export async function generateMetadata() {
  const locale = await getLocale() as Locale
  const { meta } = (await getMessages()) as any
  const ogSubtitle = `Rated ${reviewsData.stats.averageRating}/5 by ${reviewsData.stats.totalReviews}+ customers`
  const siteUrl = getSiteUrl()
  return generatePageMetadata({
    title: `${meta.home.title} | ${SITE_CONFIG.name}`,
    description: interpolateReviewStats(meta.home.description),
    path: meta.home.path,
    locale,
    image: `${siteUrl}/api/og?title=${encodeURIComponent(meta.home.title)}&subtitle=${encodeURIComponent(ogSubtitle)}`,
  })
}

export default async function Home() {
  const locale = await getLocale() as Locale
  const { content, meta, ui } = (await getMessages()) as any

  // Use same first 5 FAQs for both schema and display so Google rich snippets match the page
  const faqs = (content.faq.questions as any[]).slice(0, 5)

  // Build single @graph JSON-LD combining all page-level schemas
  const nav = locale === 'es' ? navEs : navEn
  const videos = content.home.mediaSection.videos

  const homeReviews = latestReviews(reviewsData.reviews, 3)

  const webSite = generateWebSiteSchema(locale)
  const webPage = generateWebPageSchema({
    name: meta.home.title,
    description: interpolateReviewStats(meta.home.description),
    path: locale === 'es' ? '/es' : '/',
    locale,
    datePublished: '2021-08-01',
    dateModified: process.env.BUILD_DATE || '2026-03-01',
  })
  const navigation = generateNavigationSchema(nav as any, locale)
  const faq = generateFAQSchema(faqs, locale, '2026-02-15')
  const videoSchemas = generateVideoSchema(videos, locale)
  const individualReviews = generateIndividualReviewsSchema(homeReviews)
  const howTo = generateHowToSchema(
    content.defaults.process.title,
    content.defaults.process.subtitle,
    content.defaults.process.steps,
    locale,
  )

  // Strip individual @context keys and merge into a single @graph
  const stripContext = (obj: any) => {
    const { '@context': _, ...rest } = obj
    return rest
  }
  const graphItems = [
    stripContext(webSite),
    stripContext(webPage),
    // Navigation schema already has its own @graph array of SiteNavigationElement items
    ...((navigation as any)['@graph'] || []),
    stripContext(faq),
    stripContext(howTo),
    ...videoSchemas.map(stripContext),
    ...individualReviews,
  ]
  const combinedSchema = {
    '@context': 'https://schema.org',
    '@graph': graphItems,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(combinedSchema) }}
      />
      <Hero
        title={content.home.hero.title}
        description={content.home.hero.description}
        cta={content.home.hero.cta}
      />
      <RatingSection />
      <div className="cv-auto" id="videos">
        <MediaSection
          showArrows={false}
          showDots={false}
          enableModal={false}
          description={content.home.mediaSection.description}
          items={[
            { type: 'video', src: '/videos/1.mp4', poster: '/images/video-thumb-1.webp', title: ui.media?.videoTitles?.[0] ?? 'Professional movers wrapping furniture' },
            { type: 'video', src: '/videos/2.mp4', poster: '/images/video-thumb-2.webp', title: ui.media?.videoTitles?.[1] ?? 'Rapid Panda Movers truck in Miami' },
            { type: 'video', src: '/videos/3.mp4', poster: '/images/video-thumb-3.webp', title: ui.media?.videoTitles?.[2] ?? 'Moving team carrying items into new home' },
            { type: 'video', src: '/videos/4.mp4', poster: '/images/video-thumb-4.webp', title: ui.media?.videoTitles?.[3] ?? 'Movers organizing boxes in customer\'s home' },
          ]}
        />
      </div>
      <div className="cv-auto" id="reviews">
        <ReviewSection
          variant="left"
          title={content.home.reviewSection.title}
          showPagination={false}
          showPlatformFilter={false}
          limit={3}
          reviews={homeReviews}
        />
      </div>
      <div className="cv-auto" id="services">
        <Suspense fallback={null}>
          <ServiceSection variant="left" />
        </Suspense>
      </div>
      <div className="cv-auto" id="locations">
        <Suspense fallback={null}>
          <LocationSection variant="left" />
        </Suspense>
      </div>
      <div className="cv-auto" id="faq">
        <FAQSection variant="compact" faqs={faqs} compactCount={5} />
      </div>
      <div className="cv-auto" id="blog">
        <Suspense fallback={null}>
          <BlogSection
            variant="left"
            title={content.home.blogSection.title}
            showFeatured={false}
            showCategories={false}
            showExcerpts={true}
            showCategoryPill={false}
            showViewMore
            viewMoreButtonText={content.home.blogSection.viewMoreButtonText}
            viewMoreLink="/blog"
            maxPosts={3}
          />
        </Suspense>
      </div>
      <div className="cv-auto" id="why-choose-us">
        <Suspense fallback={null}>
          <WhySection variant="left" />
        </Suspense>
      </div>
      <div className="cv-auto" id="about">
        <Suspense fallback={null}>
          <AboutSection />
        </Suspense>
      </div>
      <div id="quote">
        <QuoteSection />
      </div>
    </>
  )
}