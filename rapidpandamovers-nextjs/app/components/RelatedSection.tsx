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
    <section className="py-16">
      <div className="container mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
          {title}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mx-auto">
          {filteredItems.map((item) => {
            const slug = getSlug(item);
            return (
              <Link
                key={slug}
                href={`${basePath}/${slug}`}
                className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-all group"
              >
                {renderItem(item)}
                <span className="text-orange-500 text-sm flex items-center mt-2">
                  Compare
                  <ArrowRight className="w-3 h-3 ml-1" />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
