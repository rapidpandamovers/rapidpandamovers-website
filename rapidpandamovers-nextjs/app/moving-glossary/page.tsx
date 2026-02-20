import Hero from '../components/Hero';
import GlossarySection from '../components/GlossarySection';
import ResourceSection from '../components/ResourceSection';
import QuoteSection from '../components/QuoteSection';
import content from '../../data/content.json';
import NewsletterSection from '../components/NewsletterSection';

export const metadata = {
  title: content.glossary.title,
  description: content.glossary.description,
};

export default function MovingGlossaryPage() {
  const glossaryData = content.glossary;

  return (
    <div>
      <Hero
        title={glossaryData.title}
        description={glossaryData.description}
        cta="Get Your Free Quote"
        image_url="https://www.rapidpandamovers.com/wp-content/uploads/2024/11/about-us-rapid-panda.png"
      />

      <GlossarySection variant="full" />

      {/* Resources Section */}
      <ResourceSection
        title="More Moving Resources"
        subtitle="Explore our comprehensive guides and services for a successful move"
        variant="grid"
      />

      <NewsletterSection />

      <QuoteSection
        title="Need Help With Your Move?"
        subtitle="Now that you know the terminology, let us handle the logistics. Get a free quote today."
      />
    </div>
  );
}
