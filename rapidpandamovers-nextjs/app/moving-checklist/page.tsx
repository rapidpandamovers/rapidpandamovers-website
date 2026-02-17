import Hero from '../components/Hero';
import ChecklistSection from '../components/ChecklistSection';
import ResourceSection from '../components/ResourceSection';
import QuoteSection from '../components/QuoteSection';
import content from '../../data/content.json';

export const metadata = {
  title: content.checklist.title,
  description: content.checklist.description,
};

export default function MovingChecklistPage() {
  const checklistData = content.checklist;

  return (
    <div>
      <div className="no-print">
        <Hero
          title={checklistData.hero.title}
          description={checklistData.hero.description}
          cta={checklistData.hero.cta}
          image_url={checklistData.hero.image_url}
        />
      </div>

      <ChecklistSection
        title={checklistData.title}
        subtitle={checklistData.description}
        categories={checklistData.categories}
        showPrintButton
        variant="full"
      />

      {/* Resources Section */}
      <div className="no-print">
        <ResourceSection
          title="More Moving Resources"
          subtitle="Explore our comprehensive guides and services for a successful move"
          variant="grid"
        />
      </div>

      <div className="no-print">
        <QuoteSection
          title="Ready to Check 'Hire Movers' Off Your List?"
          subtitle="Let Rapid Panda Movers handle the heavy lifting while you focus on everything else."
        />
      </div>
    </div>
  );
}
