import Hero from '../components/Hero';
import TipSection from '../components/TipSection';
import BlogSection from '../components/BlogSection';
import ResourceSection from '../components/ResourceSection';
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
      <TipSection
        title={tipsData.title}
        description={tipsData.description}
        categories={tipsData.categories}
      />

      {/* Blog Posts */}
      <BlogSection
        variant="compact"
        categoryFilter="Moving Tips"
        title="Moving Tips Blog Posts"
        subtitle="Read our latest moving tips and advice from the experts"
        showFeatured={false}
        showCategories={false}
        viewMoreTitle="More Moving Tips"
        viewMoreSubtitle="Browse our full collection of moving tips and advice"
        viewMoreButtonText="View All Moving Tips Posts"
        viewMoreLink="/blog/category/moving-tips"
      />

      {/* Resources Section */}
      <ResourceSection
        title="More Moving Resources"
        subtitle="Explore our comprehensive guides and services for a successful move"
        variant="grid"
      />
    </div>
  );
}
