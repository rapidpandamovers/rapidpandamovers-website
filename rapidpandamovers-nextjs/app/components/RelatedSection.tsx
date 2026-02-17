import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface RelatedSectionProps<T> {
  title: string;
  items: T[];
  currentSlug: string;
  basePath: string;
  getSlug: (item: T) => string;
  renderItem: (item: T) => React.ReactNode;
}

export default function RelatedSection<T>({
  title,
  items,
  currentSlug,
  basePath,
  getSlug,
  renderItem,
}: RelatedSectionProps<T>) {
  const filteredItems = items.filter((item) => getSlug(item) !== currentSlug);

  if (filteredItems.length === 0) {
    return null;
  }

  return (
    <section className="pt-20">
      <div className="container mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-10 text-center">
          {title}
        </h2>
        <div className="bg-gray-50 rounded-4xl p-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredItems.map((item) => {
              const slug = getSlug(item);
              return (
                <Link
                  key={slug}
                  href={`${basePath}/${slug}`}
                  className="bg-white rounded-2xl p-6 text-center hover:shadow-md transition-all group"
                >
                  {renderItem(item)}
                  <span className="text-orange-500 text-sm font-medium flex items-center justify-center mt-3">
                    Compare
                    <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
