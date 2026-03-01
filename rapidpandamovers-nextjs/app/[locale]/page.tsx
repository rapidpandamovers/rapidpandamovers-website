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
import WebSiteSchema from '@/app/components/Schema/WebSiteSchema'
import FAQSchema from '@/app/components/Schema/FAQSchema'
import VideoSchema from '@/app/components/Schema/VideoSchema'
import { getMessages, getLocale } from 'next-intl/server'
import { generatePageMetadata } from '@/lib/metadata'
import type { Locale } from '@/i18n/config'
import reviewsData from '@/data/reviews.json'

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
  return generatePageMetadata({
    title: meta.home.title,
    description: interpolateReviewStats(meta.home.description),
    path: meta.home.path,
    locale,
  })
}

export default async function Home() {
  const locale = await getLocale() as Locale
  const { content, ui } = (await getMessages()) as any

  return (
    <>
      <WebSiteSchema locale={locale} />
      <FAQSchema faqs={content.faq.questions} locale={locale} />
      <VideoSchema videos={[
        { name: 'Professional movers wrapping furniture', description: 'Rapid Panda Movers team carefully wrapping and protecting furniture before a local move in Miami.', contentUrl: '/videos/1.mp4', thumbnailUrl: '/images/video-thumb-1.webp', uploadDate: '2026-02-15', duration: 'PT10S' },
        { name: 'Rapid Panda Movers truck in Miami', description: 'Rapid Panda Movers branded truck ready for a residential move in the Miami area.', contentUrl: '/videos/2.mp4', thumbnailUrl: '/images/video-thumb-2.webp', uploadDate: '2026-02-15', duration: 'PT10S' },
        { name: 'Moving team carrying items into new home', description: 'Professional moving crew transporting belongings into a customer\'s new home in South Florida.', contentUrl: '/videos/3.mp4', thumbnailUrl: '/images/video-thumb-3.webp', uploadDate: '2026-02-15', duration: 'PT5S' },
        { name: 'Movers organizing boxes in home', description: 'Rapid Panda Movers team organizing and placing boxes in a customer\'s home during a local move.', contentUrl: '/videos/4.mp4', thumbnailUrl: '/images/video-thumb-4.webp', uploadDate: '2026-02-15', duration: 'PT5S' },
      ]} />
      <Hero
        title={content.home.hero.title}
        description={content.home.hero.description}
        cta={content.home.hero.cta}
      />
      <RatingSection />
      <div className="cv-auto">
        <MediaSection
          showArrows={false}
          showDots={false}
          enableModal={false}
          description=""
          items={[
            { type: 'video', src: '/videos/1.mp4', poster: '/images/video-thumb-1.webp', title: ui.media?.videoTitles?.[0] ?? 'Professional movers wrapping furniture' },
            { type: 'video', src: '/videos/2.mp4', poster: '/images/video-thumb-2.webp', title: ui.media?.videoTitles?.[1] ?? 'Rapid Panda Movers truck in Miami' },
            { type: 'video', src: '/videos/3.mp4', poster: '/images/video-thumb-3.webp', title: ui.media?.videoTitles?.[2] ?? 'Moving team carrying items into new home' },
            { type: 'video', src: '/videos/4.mp4', poster: '/images/video-thumb-4.webp', title: ui.media?.videoTitles?.[3] ?? 'Movers organizing boxes in customer\'s home' },
          ]}
        />
      </div>
      <div className="cv-auto">
        <ReviewSection
          variant="left"
          title={content.home.reviewSection.title}
          showPagination={false}
          showPlatformFilter={false}
          limit={3}
          reviews={reviewsData.reviews.slice(0, 3)}
        />
      </div>
      <Suspense fallback={<div className="h-96" />}>
        <ServiceSection variant="left" />
      </Suspense>
      <Suspense fallback={<div className="h-96" />}>
        <LocationSection variant="left" />
      </Suspense>
      <div className="cv-auto">
        <FAQSection variant="compact" faqs={content.faq.questions} />
      </div>
      <Suspense fallback={<div className="h-96" />}>
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
      </Suspense>
      <Suspense fallback={<div className="h-96" />}>
        <WhySection variant="left" />
      </Suspense>
      <Suspense fallback={<div className="h-96" />}>
        <AboutSection />
      </Suspense>
      <QuoteSection />
    </>
  )
}