import { Mail } from 'lucide-react';
import ui from '@/data/ui.json';

interface NewsletterSectionProps {
  title?: string;
  description?: string;
  className?: string;
}

export default function NewsletterSection({
  title = ui.newsletter.defaultTitle,
  description = ui.newsletter.defaultDescription,
  className = ""
}: NewsletterSectionProps) {
  return (
    <section className={`pt-20 ${className}`}>
      <div className="container mx-auto">
        <div className="bg-gray-50 rounded-4xl p-8 md:p-16 text-center mx-auto">
          <h3 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            {title}
          </h3>
          <p className="text-gray-600 mb-6">
            {description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-stretch max-w-md mx-auto">
            <div className="bg-orange-100 border border-orange-100 rounded-lg flex items-center justify-center flex-shrink-0 px-3">
              <Mail className="w-6 h-6 text-orange-500" />
            </div>
            <input
              id="newsletter-email"
              name="email"
              type="email"
              placeholder={ui.forms.newsletter.placeholder}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors">
              {ui.buttons.subscribe}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
