import { CheckCircle } from 'lucide-react'
import Link from 'next/link'
import content from '../../data/content.json'
import Hero from '../components/Hero'
import StatisticSection from '../components/StatisticSection'

export default function AboutPage() {
  const { reviews } = content

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <Hero
        title="About Rapid Panda Moving"
        description="Welcome to Rapid Panda Movers, where every move we make is guided by a commitment to excellence and a dedication to serving our community."
        cta="Get Your Free Quote"
      />

      <StatisticSection stats={reviews.stats} />

      {/* About Content Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                About Rapid Panda Moving
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                At Rapid Panda Movers, we understand that moving is more than just transporting belongings from one place to another. It's about helping families and businesses transition to new chapters in their lives with confidence and peace of mind.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Our Mission</h3>
                <p className="text-gray-600 mb-6">
                  To provide exceptional moving services that exceed our customers' expectations while maintaining the highest standards of professionalism, reliability, and care.
                </p>

                <h3 className="text-2xl font-bold text-gray-800 mb-4">Our Values</h3>
                <ul className="space-y-3">
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
                    <span className="text-gray-600">Integrity in every interaction</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
                    <span className="text-gray-600">Commitment to excellence</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
                    <span className="text-gray-600">Respect for your belongings</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
                    <span className="text-gray-600">Transparency in pricing</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Our Story</h3>
                <p className="text-gray-600 mb-6">
                  Rapid Panda Movers started as a family dream to create a moving company that truly puts customers first. What began as a small operation has grown into one of Miami's most trusted moving services.
                </p>
                <p className="text-gray-600 mb-6">
                  Today, we're proud to have helped thousands of families and businesses make their moves with ease. Our team has grown, but our commitment to personalized service remains the same.
                </p>

                <div className="bg-orange-50 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-800 mb-2">Want to know what makes us different?</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Learn about our commitment to excellence, transparent pricing, and satisfaction guarantee.
                  </p>
                  <Link href="/why-choose-us" className="inline-flex items-center text-orange-500 hover:text-orange-600 font-medium">
                    Why Choose Rapid Panda
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Areas Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              Serving All of Miami-Dade County
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're proud to serve communities throughout Miami-Dade County with professional moving services.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              'Miami', 'Coral Gables', 'Hialeah', 'Fort Lauderdale',
              'Doral', 'Sunrise', 'Medley', 'Miami Beach',
              'Kendall', 'Homestead', 'Aventura', 'Palmetto Bay'
            ].map((city, index) => (
              <div key={index} className="bg-white rounded-lg p-4 text-center shadow-sm hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-gray-800">{city}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Experience the Rapid Panda Difference?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Contact us today to learn more about how we can make your next move smooth and stress-free.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/quote" className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
              Get Free Quote
            </Link>
            <Link href="/contact-us" className="border border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
