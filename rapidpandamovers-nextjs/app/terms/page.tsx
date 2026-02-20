import { allContent } from '@/lib/data';
import content from '@/data/content.json';
import Hero from '../components/Hero';

const terms = content.terms;

export const metadata = {
  title: terms.meta.title,
  description: terms.meta.description,
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Hero
        title={terms.title}
        description="Welcome to Rapid Panda Movers. By accessing our website or using our services, you agree to be bound by these Terms & Conditions. Please read them carefully before using our services."
        cta="Get Your Free Quote"
      />

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto prose prose-lg">
            {terms.sections.map((section, index) => (
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
