import Hero from '../components/Hero';
import MovingChecklist from '../components/MovingChecklist';
import OrangeCTASection from '../components/OrangeCTASection';
import content from '../../data/content.json';

export default function MovingChecklistPage() {
  const checklistData = content.checklist;

  return (
    <div>
      <Hero 
        title={checklistData.hero.title}
        description={checklistData.hero.description}
        cta={checklistData.hero.cta}
        image_url={checklistData.hero.image_url}
      />
      <MovingChecklist
        title={checklistData.title}
        description={checklistData.description}
        categories={checklistData.categories}
        tips={checklistData.tips}
      />
      <OrangeCTASection />
    </div>
  );
}
