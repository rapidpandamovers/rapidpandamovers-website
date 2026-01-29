import Hero from '../components/Hero';
import MovingGlossary from '../components/MovingGlossary';
import OrangeCTASection from '../components/OrangeCTASection';
import content from '../../data/content.json';

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
      <MovingGlossary
        title={glossaryData.title}
        description={glossaryData.description}
        terms={glossaryData.terms}
      />
      <OrangeCTASection />
    </div>
  );
}
