import { Mail } from 'lucide-react';

interface NewsletterSectionProps {
  title?: string;
  description?: string;
  className?: string;
}

export default function NewsletterSection({
  title = "Stay Updated with Moving Tips",
  description = "Subscribe to our newsletter for the latest moving tips, guides, and special offers from Rapid Panda Movers.",
  className = ""
}: NewsletterSectionProps) {
  return (
    <section className={`py-16 ${className}`}>
      <div className="container mx-auto">
        <div className="bg-gray-50 rounded-4xl p-8 text-center mx-auto">
          <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-6 h-6 text-orange-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            {title}
          </h3>
          <p className="text-gray-600 mb-6">
            {description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
