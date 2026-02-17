import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface CompareListProps<T> {
  title: React.ReactNode;
  subtitle: string;
  items: T[];
  basePath: string;
  getSlug: (item: T) => string;
  ctaText?: string;
  renderCard: (item: T) => React.ReactNode;
}

export default function CompareList<T>({
  title,
  subtitle,
  items,
  basePath,
  getSlug,
  ctaText = 'View Comparison',
  renderCard,
}: CompareListProps<T>) {
  return (
    <section className="pt-20">
      <div className="container mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            {title}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {subtitle}
          </p>
        </div>

        <div className="bg-gray-50 rounded-4xl p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <Link
                key={getSlug(item)}
                href={`${basePath}/${getSlug(item)}`}
                className="bg-white rounded-2xl p-6 hover:shadow-md transition-all group"
              >
                {renderCard(item)}
                <div className="flex items-center text-orange-500 font-medium">
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
