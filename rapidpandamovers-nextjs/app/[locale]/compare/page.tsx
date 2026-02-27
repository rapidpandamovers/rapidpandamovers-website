import { Scale, Star, Shield } from 'lucide-react';
import { getLocalizedComparisons } from '@/lib/data';
import { getMessages, getLocale } from 'next-intl/server';
import { generatePageMetadata } from '@/lib/metadata';
import { getTranslatedSlug } from '@/i18n/slug-map';
import type { Locale } from '@/i18n/config';
import Hero from '@/app/components/Hero';
import QuoteSection from '@/app/components/QuoteSection';
import CompareList from '@/app/components/CompareList';
import CompareTable from '@/app/components/CompareTable';
import OverviewSection from '@/app/components/OverviewSection';
import { H3 } from '@/app/components/Heading';

export async function generateMetadata() {
  const locale = await getLocale() as Locale;
  const { meta } = (await getMessages()) as any;
  return generatePageMetadata({
    title: meta.compare.title,
    description: meta.compare.description,
    path: meta.compare.path,
    locale,
  });
}

export default async function ComparePage() {
  const { content } = (await getMessages()) as any;
  const locale = await getLocale() as Locale;
  const compareSlug = getTranslatedSlug('compare', locale);
  const comparisonsData = getLocalizedComparisons(locale);

  return (
    <div className="min-h-screen">
      <Hero
        title={content.compare.hero.title}
        description={content.compare.hero.description}
        cta={content.compare.hero.cta}
      />

      {/* Introduction */}
      <OverviewSection title={<>{content.compare.overview.titleBefore}<span className="text-orange-600">{content.compare.overview.titleHighlight}</span>{content.compare.overview.titleAfter || ''}</>}>
        <p className="text-xl text-gray-600 mb-8">
          {content.compare.overview.description}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[Scale, Star, Shield].map((Icon, i) => (
            <div key={i} className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon className="w-8 h-8 text-orange-500" />
              </div>
              <H3 className="font-bold text-gray-800 mb-2">{content.compare.overview.features[i].title}</H3>
              <p className="text-gray-600">{content.compare.overview.features[i].description}</p>
            </div>
          ))}
        </div>
      </OverviewSection>

      {/* Comparisons Grid */}
      <CompareList
        title={<>{content.compare.compareList.titleBefore}<span className="text-orange-600">{content.compare.compareList.titleHighlight}</span></>}
        subtitle={content.compare.compareList.subtitle}
        items={comparisonsData}
        basePath={`/${compareSlug}`}
        getSlug={(c: any) => c.slug}
        ctaText={content.compare.compareList.ctaText}
        renderCard={(comparison: any) => (
          <>
            <div className="flex items-center justify-between mb-4">
              <Scale className="w-8 h-8 text-orange-500" />
              {comparison.competitor.rating !== 'N/A' && comparison.competitor.rating !== 'Mixed' && (
                <span className="text-sm bg-gray-100 px-3 py-1 rounded-full text-gray-600">
                  {comparison.competitor.rating}
                </span>
              )}
            </div>
            <H3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-orange-600 transition-colors">
              vs {comparison.competitor.name}
            </H3>
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
              {comparison.summary}
            </p>
          </>
        )}
      />

      {/* Quick Comparison Table */}
      <CompareTable
        title={content.compare.compareTable.title}
        columns={content.compare.compareTable.columns.map((h: string) => ({ header: h }))}
        rows={[
          {
            option: 'Rapid Panda Movers',
            cells: content.compare.compareTable.rapidPandaRow,
            highlight: true,
          },
          ...comparisonsData.map((c: any) => ({
            option: c.competitor.name,
            cells: [
              c.competitor.rating,
              c.competitor_cons.find((con: string) => con.toLowerCase().includes('price') || con.toLowerCase().includes('fee') || con.toLowerCase().includes('cost') || con.toLowerCase().includes('cargo') || con.toLowerCase().includes('precio'))
                ? content.compare.compareTable.reportsOfHiddenFees
                : content.compare.compareTable.varies,
              c.competitor_cons.find((con: string) => con.toLowerCase().includes('licen') || con.toLowerCase().includes('insur') || con.toLowerCase().includes('seguro'))
                ? content.compare.compareTable.checkCredentials
                : content.compare.compareTable.yes,
            ],
          })),
        ]}
      />

      {/* CTA Section */}
      <QuoteSection
        title={content.compare.quote.title}
        subtitle={content.compare.quote.subtitle}
      />
    </div>
  );
}
