import { getMessages, getLocale } from 'next-intl/server';
import { generatePageMetadata } from '@/lib/metadata';
import type { Locale } from '@/i18n/config';
import Hero from '@/app/components/Hero';
import { H2 } from '@/app/components/Heading';

export async function generateMetadata() {
  const locale = await getLocale() as Locale;
  const { meta } = (await getMessages()) as any;
  return generatePageMetadata({
    title: meta.privacy.title,
    description: meta.privacy.description,
    path: meta.privacy.path,
    locale,
  });
}

export default async function PrivacyPage() {
  const { content } = (await getMessages()) as any;
  const privacy = content.privacy;

  return (
    <div className="min-h-screen">
      <Hero
        title={privacy.title}
        description={privacy.hero.description}
        cta={privacy.hero.cta}
      />

      <section className="pt-10">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto prose prose-lg">
            {privacy.sections.map((section: any, index: number) => (
              <div key={index} className="mb-8">
                <H2 className="text-2xl font-bold text-gray-800 mb-4">{section.title}</H2>
                {'hasContactLinks' in section && section.hasContactLinks ? (
                  (() => {
                    const phoneFormatted = `(${content.site.phone.slice(0,3)}) ${content.site.phone.slice(4,7)}-${content.site.phone.slice(8)}`
                    const [beforeEmail, afterEmail = ''] = section.content.split(content.site.email)
                    const [connectingText, trailingText = ''] = afterEmail.split(phoneFormatted)
                    return (
                      <p className="text-gray-600">
                        {beforeEmail}
                        <a href={`mailto:${content.site.email}`} className="text-orange-600 hover:text-orange-800">
                          {content.site.email}
                        </a>
                        {connectingText}
                        <a href={`tel:${content.site.phone.replace(/-/g, '')}`} className="text-orange-600 hover:text-orange-800">
                          {phoneFormatted}
                        </a>
                        {trailingText}
                      </p>
                    )
                  })()
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
