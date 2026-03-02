import { Link } from '@/i18n/routing';
import { ArrowRight } from 'lucide-react';
import { getMessages } from 'next-intl/server';
import { H2 } from '@/app/components/Heading';

interface CompareListProps<T> {
  title: React.ReactNode;
  subtitle: string;
  items: T[];
  basePath: string;
  getSlug: (item: T) => string;
  ctaText?: string;
  renderCard: (item: T) => React.ReactNode;
}

export default async function CompareList<T>({
  title,
  subtitle,
  items,
  basePath,
  getSlug,
  ctaText: ctaTextProp,
  renderCard,
}: CompareListProps<T>) {
  const { ui } = (await getMessages()) as any;
  const ctaText = ctaTextProp ?? ui.buttons.viewComparison;
  return (
    <section className="pt-20">
      <div className="container mx-auto">
        <div className="text-center mb-10 px-6 md:px-0">
          <H2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            {title}
          </H2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {subtitle}
          </p>
        </div>

        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <Link
                key={getSlug(item)}
                href={`${basePath}/${getSlug(item)}`}
                className="bg-gray-50 rounded-2xl p-6 hover:shadow-md transition-all group"
              >
                {renderCard(item)}
                <div className="flex items-center text-orange-700 font-medium">
                  {ctaText}
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
