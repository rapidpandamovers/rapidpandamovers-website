import Hero from '@/app/components/Hero';
import ChecklistSection from '@/app/components/ChecklistSection';
import ResourceSection from '@/app/components/ResourceSection';
import QuoteSection from '@/app/components/QuoteSection';
import { getMessages, getLocale } from 'next-intl/server';
import { generatePageMetadata } from '@/lib/metadata';
import type { Locale } from '@/i18n/config';

export async function generateMetadata() {
  const locale = await getLocale() as Locale;
  const { meta } = (await getMessages()) as any;
  return generatePageMetadata({
    title: meta.checklist.title,
    description: meta.checklist.description,
    path: meta.checklist.path,
    locale,
  });
}

export default async function MovingChecklistPage() {
  const { content } = (await getMessages()) as any;
  const checklistData = content.checklist;

  return (
    <div>
      <div className="no-print">
        <Hero
          title={checklistData.hero.title}
          description={checklistData.hero.description}
          cta={checklistData.hero.cta}
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
          title={checklistData.resourceSection.title}
          subtitle={checklistData.resourceSection.subtitle}
          items={content.defaults.resources.items}
          variant="grid"
          pathname="/moving-checklist"
        />
      </div>

      <div className="no-print">
        <QuoteSection
          title={checklistData.quote.title}
          subtitle={checklistData.quote.subtitle}
        />
      </div>
    </div>
  );
}
