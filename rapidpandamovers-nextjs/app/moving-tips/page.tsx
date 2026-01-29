import Hero from '../components/Hero';
import MovingTips from '../components/MovingTips';
import OrangeCTASection from '../components/OrangeCTASection';
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
      <MovingTips
        title={tipsData.title}
        description={tipsData.description}
        categories={tipsData.categories}
      />
      <OrangeCTASection />
    </div>
  );
}
