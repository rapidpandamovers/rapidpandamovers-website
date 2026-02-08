import Hero from '../components/Hero';
import TipSection from '../components/TipSection';
import ResourceSection from '../components/ResourceSection';
import content from '../../data/content.json';

export default function MovingTipsPage() {
  const tipsData = content.tips;

  return (
    <div>
      <Hero 
        title={tipsData.hero.title}
        description={tipsData.hero.description}
        cta={tipsData.hero.cta}
        image_url={tipsData.hero.image_url}
      />
      <TipSection
        title={tipsData.title}
        description={tipsData.description}
        categories={tipsData.categories}
      />

      {/* Resources Section */}
      <ResourceSection
        title="More Moving Resources"
        subtitle="Explore our comprehensive guides and services for a successful move"
        variant="grid"
      />
    </div>
  );
}
