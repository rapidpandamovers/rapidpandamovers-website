import Hero from './components/Hero'
import RatingSection from './components/RatingSection'
import MediaSection from './components/MediaSection'
import ServiceSection from './components/ServiceSection'
import ReviewSection from './components/ReviewSection'
import WhySection from './components/WhySection'
import LocationSection from './components/LocationSection'
import AboutSection from './components/AboutSection'
import BlogSection from './components/BlogSection'
import FAQSection from './components/FAQSection'
import QuoteSection from './components/QuoteSection'
import content from '../data/content.json'

export default function Home() {
  return (
    <>
      <Hero 
        title={content.home.hero.title}
        description={content.home.hero.description}
        cta={content.home.hero.cta}
        image_url={content.home.hero.image_url}
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
        title="What Our Customers Say"
        showPagination={false}
        showPlatformFilter={false}
        limit={3}
      />
      <ServiceSection variant="left" />
      <LocationSection variant="left" />
      <FAQSection variant="compact" />
      <BlogSection
        variant="left"
        title="Moving Tips & Insights"
        showFeatured={false}
        showCategories={false}
        showExcerpts={false}
        showCategoryPill={false}
        showViewMore
        viewMoreButtonText="View All Articles"
        viewMoreLink="/blog"
        maxPosts={3}
      />
      <WhySection variant="left" />
      <AboutSection />
      <QuoteSection />
    </>
  )
}