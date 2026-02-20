import { allContent } from '@/lib/data';
import content from '@/data/content.json';
import Hero from '../components/Hero';

const privacy = content.privacy;

export const metadata = {
  title: privacy.meta.title,
  description: privacy.meta.description,
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Hero
        title={privacy.title}
        description="At Rapid Panda Movers, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services."
        cta="Get Your Free Quote"
      />

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto prose prose-lg">
            {privacy.sections.map((section, index) => (
              <div key={index} className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">{section.title}</h2>
                {'hasContactLinks' in section && section.hasContactLinks ? (
                  <p className="text-gray-600">
                    {section.content.split('info@rapidpandamovers.com')[0]}
                    <a href={`mailto:${content.site.email}`} className="text-orange-500 hover:text-orange-600">
                      {content.site.email}
                    </a>
                    {' '}or call us at{' '}
                    <a href={`tel:${content.site.phone.replace(/-/g, '')}`} className="text-orange-500 hover:text-orange-600">
                      ({content.site.phone.slice(0,3)}) {content.site.phone.slice(4,7)}-{content.site.phone.slice(8)}
                    </a>.
                  </p>
                ) : (
                  <p className="text-gray-600">{section.content}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
