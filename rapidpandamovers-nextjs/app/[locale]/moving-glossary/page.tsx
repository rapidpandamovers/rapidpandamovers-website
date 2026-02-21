import Hero from '@/app/components/Hero';
import GlossarySection from '@/app/components/GlossarySection';
import ResourceSection from '@/app/components/ResourceSection';
import QuoteSection from '@/app/components/QuoteSection';
import { getMessages, getLocale } from 'next-intl/server';
import { generatePageMetadata } from '@/lib/metadata';
import type { Locale } from '@/i18n/config';
import NewsletterSection from '@/app/components/NewsletterSection';

export async function generateMetadata() {
  const locale = await getLocale() as Locale;
  const { meta } = (await getMessages()) as any;
  return generatePageMetadata({
    title: meta.glossary.title,
    description: meta.glossary.description,
    path: meta.glossary.path,
    locale,
  });
}

export default async function MovingGlossaryPage() {
  const { content } = (await getMessages()) as any;
  const glossaryData = content.glossary;

  return (
    <div>
      <Hero
        title={glossaryData.title}
        description={glossaryData.description}
        cta={glossaryData.hero.cta}
      />

      <GlossarySection variant="full" />

      {/* Resources Section */}
      <ResourceSection
        title={glossaryData.resourceSection.title}
        subtitle={glossaryData.resourceSection.subtitle}
        variant="grid"
      />

      <NewsletterSection />

      <QuoteSection
        title={glossaryData.quote.title}
        subtitle={glossaryData.quote.subtitle}
      />
    </div>
  );
}
