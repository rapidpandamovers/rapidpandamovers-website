import Hero from '../components/Hero';
import TipSection from '../components/TipSection';
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
    </div>
  );
}
