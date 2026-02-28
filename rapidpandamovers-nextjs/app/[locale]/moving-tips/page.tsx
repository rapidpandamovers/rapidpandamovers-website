import Hero from '@/app/components/Hero';
import TipSection from '@/app/components/TipSection';
import BlogSection from '@/app/components/BlogSection';
import ResourceSection from '@/app/components/ResourceSection';
import { getMessages, getLocale } from 'next-intl/server';
import { generatePageMetadata } from '@/lib/metadata';
import type { Locale } from '@/i18n/config';
import NewsletterSection from '@/app/components/NewsletterSection';

export async function generateMetadata() {
  const locale = await getLocale() as Locale;
  const { meta } = (await getMessages()) as any;
  return generatePageMetadata({
    title: meta.tips.title,
    description: meta.tips.description,
    path: meta.tips.path,
    locale,
  });
}

export default async function MovingTipsPage() {
  const { content } = (await getMessages()) as any;
  const tipsData = content.tips;

  return (
    <div>
      <Hero
        title={tipsData.hero.title}
        description={tipsData.hero.description}
        cta={tipsData.hero.cta}
      />
      <TipSection
        title={tipsData.title}
        description={tipsData.description}
        categories={tipsData.categories}
      />

      {/* Blog Posts */}
      <BlogSection
        variant="compact"
        categoryFilter="Moving Tips"
        title={tipsData.blogSection.title}
        subtitle={tipsData.blogSection.subtitle}
        showFeatured={false}
        showCategories={false}
        viewMoreTitle={tipsData.blogSection.viewMoreTitle}
        viewMoreSubtitle={tipsData.blogSection.viewMoreSubtitle}
        viewMoreButtonText={tipsData.blogSection.viewMoreButtonText}
        viewMoreLink={tipsData.blogSection.viewMoreLink}
      />

      {/* Resources Section */}
      <ResourceSection
        title={tipsData.resourceSection.title}
        subtitle={tipsData.resourceSection.subtitle}
        items={content.defaults.resources.items}
        variant="grid"
      />
      <NewsletterSection />
    </div>
  );
}
