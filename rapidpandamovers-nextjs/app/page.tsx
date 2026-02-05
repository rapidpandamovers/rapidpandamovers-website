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
      <MediaSection showArrows={false} showDots={false} enableModal={false} description="" />
      <ServiceSection />
      <ReviewSection />
      <WhySection />
      <LocationSection />
      <AboutSection />
      <BlogSection
        showFeatured={true}
        showCategories={false}
        maxPosts={3}
      />
      <FAQSection variant="compact" />
      <QuoteSection />
    </>
  )
}