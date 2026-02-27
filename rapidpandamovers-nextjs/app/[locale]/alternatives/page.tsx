import { Truck, Package, Users, HelpCircle } from 'lucide-react';
import { getLocalizedAlternatives } from '@/lib/data';
import { getMessages, getLocale } from 'next-intl/server';
import { generatePageMetadata } from '@/lib/metadata';
import { getTranslatedSlug } from '@/i18n/slug-map';
import type { Locale } from '@/i18n/config';
import Hero from '@/app/components/Hero';
import QuoteSection from '@/app/components/QuoteSection';
import CompareTable from '@/app/components/CompareTable';
import CompareList from '@/app/components/CompareList';
import OverviewSection from '@/app/components/OverviewSection';
import { H3 } from '@/app/components/Heading';

export async function generateMetadata() {
  const locale = await getLocale() as Locale;
  const { meta } = (await getMessages()) as any;
  return generatePageMetadata({
    title: meta.alternatives.title,
    description: meta.alternatives.description,
    path: meta.alternatives.path,
    locale,
  });
}

const typeIcons: Record<string, React.ReactNode> = {
  'Container/Pod Service': <Package className="w-8 h-8 text-orange-500" />,
  'Servicio de Contenedores/Pods': <Package className="w-8 h-8 text-orange-500" />,
  'Truck Rental Service': <Truck className="w-8 h-8 text-orange-500" />,
  'Servicio de Alquiler de Camiones': <Truck className="w-8 h-8 text-orange-500" />,
  'Labor-Only Service': <Users className="w-8 h-8 text-orange-500" />,
  'Servicio de Solo Mano de Obra': <Users className="w-8 h-8 text-orange-500" />,
  'Freight/Container Service': <Package className="w-8 h-8 text-orange-500" />,
  'Servicio de Carga/Contenedores': <Package className="w-8 h-8 text-orange-500" />,
};

export default async function AlternativesPage() {
  const { content } = (await getMessages()) as any;
  const locale = await getLocale() as Locale;
  const alternativesSlug = getTranslatedSlug('alternatives', locale);
  const alternativesData = getLocalizedAlternatives(locale);

  return (
    <div className="min-h-screen">
      <Hero
        title={content.alternatives.hero.title}
        description={content.alternatives.hero.description}
        cta={content.alternatives.hero.cta}
      />

      {/* Introduction */}
      <OverviewSection title={<>{content.alternatives.overview.titleBefore}<span className="text-orange-600">{content.alternatives.overview.titleHighlight}</span></>}>
        <p className="text-xl text-gray-600 mb-8">
          {content.alternatives.overview.description}
        </p>
        <div className="bg-orange-50 rounded-xl p-6 text-left">
          <H3 className="font-bold text-gray-800 mb-3 flex items-center">
            <HelpCircle className="w-5 h-5 text-orange-500 mr-2" />
            {content.alternatives.overview.tipTitle}
          </H3>
          <p className="text-gray-700" dangerouslySetInnerHTML={{ __html: content.alternatives.overview.tipContent }} />
        </div>
      </OverviewSection>

      {/* Alternatives Grid */}
      <CompareList
        title={<>{content.alternatives.compareList.titleBefore}<span className="text-orange-600">{content.alternatives.compareList.titleHighlight}</span></>}
        subtitle={content.alternatives.compareList.subtitle}
        items={alternativesData}
        basePath={`/${alternativesSlug}`}
        getSlug={(alt: any) => alt.slug}
        ctaText={content.alternatives.compareList.ctaText}
        renderCard={(alt: any) => (
          <>
            <div className="flex items-center justify-between mb-4">
              {typeIcons[alt.alternative.type] || <Package className="w-8 h-8 text-orange-500" />}
              <span className="text-xs bg-gray-100 px-3 py-1 rounded-full text-gray-600">
                {alt.alternative.type}
              </span>
            </div>
            <H3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-orange-600 transition-colors">
              {alt.alternative.name}
            </H3>
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
              {alt.summary}
            </p>
            <div className="text-sm text-gray-500 mb-4">
              <span className="font-medium">{content.alternatives.compareList.startingAt}</span>{' '}
              {alt.pricing.local !== 'Not available (100+ miles only)'
                ? alt.pricing.local
                : alt.pricing.long_distance}
            </div>
          </>
        )}
      />

      {/* Quick Comparison Table */}
      <CompareTable
        title={content.alternatives.compareTable.title}
        columns={content.alternatives.compareTable.columns.map((h: string) => ({ header: h }))}
        rows={content.alternatives.compareTable.rows.map((row: any) => ({
          option: row.option,
          cells: row.cells,
          highlight: row.highlight || false,
        }))}
      />

      {/* CTA Section */}
      <QuoteSection />
    </div>
  );
}
