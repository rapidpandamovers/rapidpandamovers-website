import Link from 'next/link';
import SearchSection from './components/SearchSection';
import BlogSection from './components/BlogSection';

export default function NotFound() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-6xl md:text-8xl font-bold text-orange-500 mb-4">404</h1>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
            Page Not Found
          </h2>
          <p className="text-lg text-gray-600 max-w-xl mx-auto mb-8">
            Sorry, we couldn't find the page you're looking for. It may have been moved or no longer exists.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors"
            >
              Go Home
            </Link>
            <Link
              href="/contact-us"
              className="inline-flex items-center justify-center px-6 py-3 border border-orange-500 text-orange-500 font-semibold rounded-lg hover:bg-orange-50 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <SearchSection placeholder="Search for locations, services, or routes..." />

      {/* Blog Section */}
      <BlogSection />
    </div>
  );
}
