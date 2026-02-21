import { notFound } from 'next/navigation';
import { getLocalizedComparisons } from '@/lib/data';
import Hero from '@/app/components/Hero';
import QuoteSection from '@/app/components/QuoteSection';
import Breadcrumbs from '@/app/components/Breadcrumbs';
import RelatedSection from '@/app/components/RelatedSection';
import OverviewSection from '@/app/components/OverviewSection';
import CompareSection from '@/app/components/CompareSection';
import WhySection from '@/app/components/WhySection';
import { locales } from '@/i18n/config';
import type { Locale } from '@/i18n/config';
import { getMessages, getLocale } from 'next-intl/server';
import { getTranslatedSlug } from '@/i18n/slug-map';
import comparisons from '@/data/comparisons.json';
import { H3 } from '@/app/components/Heading';
import { generatePageMetadata } from '@/lib/metadata';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = comparisons.comparisons.map((comparison) => ({
    slug: comparison.slug,
  }));
  return locales.flatMap(locale => slugs.map(s => ({ locale, ...s })));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const locale = await getLocale() as Locale;
  const localizedComparisons = getLocalizedComparisons(locale);
  const comparison = localizedComparisons.find((c: any) => c.slug === slug);

  if (!comparison) {
    return { title: 'Comparison Not Found' };
  }

  return generatePageMetadata({
    title: `${comparison.title} | Miami Moving Company Comparison`,
    description: comparison.meta_description,
    path: `/compare/${comparison.slug}`,
    locale,
  });
}

export default async function ComparisonPage({ params }: PageProps) {
  const { slug } = await params;
  const { content, ui } = (await getMessages()) as any;
  const locale = await getLocale() as Locale;
  const compareSlug = getTranslatedSlug('compare', locale);
  const localizedComparisons = getLocalizedComparisons(locale);
  const comparison = localizedComparisons.find((c: any) => c.slug === slug);

  if (!comparison) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      <Hero
        title={comparison.title}
        description={comparison.summary}
        cta={content.compare.hero.cta}
      />

      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: ui.compare.breadcrumb, href: `/${compareSlug}` },
          { label: `vs ${comparison.competitor.name}` },
        ]}
        showBackground={true}
      />

      {/* Competitor Overview */}
      <OverviewSection
        title={ui.compare.aboutName.replace('{name}', comparison.competitor.name)}
        name={comparison.competitor.name}
        website={comparison.competitor.website}
      >
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <span className="text-gray-500 text-sm">{ui.compare.rating}</span>
            <p className="font-bold text-gray-800">{comparison.competitor.rating}</p>
          </div>
          <div>
            <span className="text-gray-500 text-sm">{ui.compare.reviews}</span>
            <p className="font-bold text-gray-800">{comparison.competitor.reviews}</p>
          </div>
        </div>
        <H3 className="font-semibold text-gray-800 mb-3">{ui.compare.servicesOffered}</H3>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {comparison.competitor_services.map((service: string, index: number) => (
            <li key={index} className="text-gray-600 flex items-center">
              <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
              {service}
            </li>
          ))}
        </ul>
      </OverviewSection>

      {/* Pros and Cons Comparison */}
      <CompareSection
        name={comparison.competitor.name}
        pros={comparison.competitor_pros}
        cons={comparison.competitor_cons}
      />

      {/* Why Choose Us */}
      <WhySection
        title={<>{ui.compare.whyChooseRapidPandaBefore}<span className="text-orange-700">{ui.compare.whyChooseRapidPandaHighlight}</span>{ui.compare.whyChooseRapidPandaAfter}</>}
        benefits={comparison.why_choose_us}
        ctaText={ui.compare.seeWhyDifferent}
      />

      {/* Verdict */}
      <QuoteSection
        title={content.compare.verdict.title}
        subtitle={comparison.verdict}
      />

      {/* Other Comparisons */}
      <RelatedSection
        title={content.compare.relatedSection.title}
        items={localizedComparisons}
        currentSlug={slug}
        basePath={`/${compareSlug}`}
        getSlug={(c: any) => c.slug}
        renderItem={(c: any) => (
          <h4 className="font-semibold text-gray-800 group-hover:text-orange-600 transition-colors">
            vs {c.competitor.name}
          </h4>
        )}
      />

    </div>
  );
}
