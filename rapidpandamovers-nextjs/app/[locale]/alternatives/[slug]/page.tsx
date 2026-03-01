import { notFound } from 'next/navigation';
import { DollarSign, Clock, Truck } from 'lucide-react';
import { getLocalizedAlternatives } from '@/lib/data';
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
import alternatives from '@/data/alternatives.json';
import { generatePageMetadata } from '@/lib/metadata';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = alternatives.alternatives.map((alt) => ({
    slug: alt.slug,
  }));
  return locales.flatMap(locale => slugs.map(s => ({ locale, ...s })));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const locale = await getLocale() as Locale;
  const localizedAlts = getLocalizedAlternatives(locale);
  const alternative = localizedAlts.find((a: any) => a.slug === slug);

  if (!alternative) {
    return { title: 'Alternative Not Found' };
  }

  return generatePageMetadata({
    title: `${alternative.title} | Rapid Panda Movers`,
    description: alternative.meta_description,
    path: `/alternatives/${alternative.slug}`,
    locale,
  });
}

export default async function AlternativePage({ params }: PageProps) {
  const { slug } = await params;
  const { content, ui } = (await getMessages()) as any;
  const locale = await getLocale() as Locale;
  const alternativesSlug = getTranslatedSlug('alternatives', locale);
  const localizedAlts = getLocalizedAlternatives(locale);
  const alternative = localizedAlts.find((a: any) => a.slug === slug);

  if (!alternative) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      <Hero
        title={alternative.title}
        description={alternative.summary}
        cta={content.alternatives.hero.cta}
      />

      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: ui.alternatives.breadcrumb, href: `/${alternativesSlug}` },
          { label: alternative.alternative.name },
        ]}
        showBackground={true}
      />

      {/* How It Works */}
      <OverviewSection
        title={ui.alternatives.howItWorks.replace('{name}', alternative.alternative.name)}
        name={alternative.alternative.name}
        website={alternative.alternative.website}
      >
        <p className="text-gray-700 mb-6">{alternative.how_it_works}</p>

        {/* Pricing */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center mb-2">
              <DollarSign className="w-5 h-5 text-orange-700 mr-2" />
              <span className="text-gray-500 text-sm">{ui.alternatives.localMoves}</span>
            </div>
            <p className="font-bold text-gray-800">{alternative.pricing.local}</p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center mb-2">
              <Truck className="w-5 h-5 text-orange-700 mr-2" />
              <span className="text-gray-500 text-sm">{ui.alternatives.longDistance}</span>
            </div>
            <p className="font-bold text-gray-800">{alternative.pricing.long_distance}</p>
          </div>
          {'monthly_storage' in alternative.pricing && (
            <div className="bg-white rounded-lg p-4">
              <div className="flex items-center mb-2">
                <Clock className="w-5 h-5 text-orange-700 mr-2" />
                <span className="text-gray-500 text-sm">{ui.alternatives.monthlyStorage}</span>
              </div>
              <p className="font-bold text-gray-800">{alternative.pricing.monthly_storage}</p>
            </div>
          )}
          {'hourly_rate' in alternative.pricing && (
            <div className="bg-white rounded-lg p-4">
              <div className="flex items-center mb-2">
                <Clock className="w-5 h-5 text-orange-700 mr-2" />
                <span className="text-gray-500 text-sm">{ui.alternatives.hourlyRate}</span>
              </div>
              <p className="font-bold text-gray-800">{alternative.pricing.hourly_rate}</p>
            </div>
          )}
        </div>
      </OverviewSection>

      {/* Pros and Cons */}
      <CompareSection
        name={alternative.alternative.name}
        pros={alternative.pros}
        cons={alternative.cons}
        proTitle={ui.compare.prosOf.replace('{name}', alternative.alternative.name)}
        conTitle={ui.compare.consOf.replace('{name}', alternative.alternative.name)}
        bestFor={alternative.best_for}
        costComparison={alternative.cost_comparison}
        className="!pt-8"
      />

      {/* Why Full-Service is Better */}
      <WhySection
        title={<>{ui.alternatives.whyFullServiceBefore}<span className="text-orange-700">{ui.alternatives.whyFullServiceHighlight}</span>{ui.alternatives.whyFullServiceAfter}</>}
        benefits={alternative.why_full_service_better}
        ctaText={ui.alternatives.seeWhyDifferent}
      />

      {/* Verdict */}
      <QuoteSection
        title={content.alternatives.verdict.title}
        subtitle={alternative.verdict}
      />

      {/* Other Alternatives */}
      <RelatedSection
        title={content.alternatives.relatedSection.title}
        items={localizedAlts}
        currentSlug={slug}
        basePath={`/${alternativesSlug}`}
        getSlug={(a: any) => a.slug}
        renderItem={(a: any) => (
          <>
            <span className="text-xs text-gray-500">{a.alternative.type}</span>
            <h4 className="font-semibold text-gray-800 group-hover:text-orange-700 transition-colors mt-1">
              {a.alternative.name}
            </h4>
          </>
        )}
      />

    </div>
  );
}
