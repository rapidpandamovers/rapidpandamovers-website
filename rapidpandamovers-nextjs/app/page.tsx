import Hero from './components/Hero'
import PlatformRatings from './components/PlatformRatings'
import OrangeCTASection from './components/OrangeCTASection'
import ServicesGrid from './components/ServicesGrid'
import TestimonialsSection from './components/TestimonialsSection'
import MovingCategories from './components/MovingCategories'
import WhatsIncluded from './components/WhatsIncluded'
import WhyChoose from './components/WhyChoose'
import ServiceLocations from './components/ServiceLocations'
import AboutUs from './components/AboutUs'
import RecentPosts from './components/RecentPosts'
import FinalCTASection from './components/FinalCTASection'
import FAQSection from './components/FAQSection'
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
      <PlatformRatings />
      <OrangeCTASection />
      <ServicesGrid />
      <TestimonialsSection />
      <MovingCategories />
      <WhatsIncluded />
      <WhyChoose />
      <ServiceLocations />
      <AboutUs />
      <RecentPosts 
        showFeatured={true}
        showCategories={false}
        showNewsletter={false}
        maxPosts={3}
        className="bg-gray-50"
      />
      <FinalCTASection />
      <FAQSection />
    </>
  )
}