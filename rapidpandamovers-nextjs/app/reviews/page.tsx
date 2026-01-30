import { Star, Users, Award, TrendingUp, Phone, Mail, MapPin, Clock } from 'lucide-react'
import Link from 'next/link'
import content from '../../data/content.json'
import Hero from '../components/Hero'

export default function ReviewsPage() {
  const { reviews } = content

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <Hero
        title={reviews.title}
        description={reviews.description}
        cta="Get Your Free Quote"
      />

      {/* Statistics Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Trusted by Miami Families & Businesses
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our commitment to excellence has earned us the trust of thousands of customers throughout Miami-Dade County.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-orange-600" />
              </div>
              <div className="text-3xl font-bold text-gray-800 mb-2">{reviews.stats.total_moves}</div>
              <div className="text-gray-600">Successful Moves</div>
            </div>
            
            <div className="text-center">
              <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-orange-600" />
              </div>
              <div className="text-3xl font-bold text-gray-800 mb-2">{reviews.stats.customer_satisfaction}</div>
              <div className="text-gray-600">Customer Satisfaction</div>
            </div>
            
            <div className="text-center">
              <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-orange-600" />
              </div>
              <div className="text-3xl font-bold text-gray-800 mb-2">{reviews.stats.years_experience}</div>
              <div className="text-gray-600">Years Experience</div>
            </div>
            
            <div className="text-center">
              <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-orange-600" />
              </div>
              <div className="text-3xl font-bold text-gray-800 mb-2">{reviews.stats.average_rating}</div>
              <div className="text-gray-600">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Reviews Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              What Our Customers Say
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Real reviews from real customers who trusted Rapid Panda Movers with their most important move.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {reviews.featured_reviews.map((review, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="flex">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>
                
                <blockquote className="text-gray-700 mb-6 italic">
                  "{review.review}"
                </blockquote>
                
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-gray-800">{review.name}</div>
                      <div className="text-sm text-gray-600">{review.location}</div>
                    </div>
                    <div className="text-sm text-orange-600 font-medium bg-orange-50 px-3 py-1 rounded-full">
                      {review.service}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-orange-500">
        <div className="container mx-auto px-4">
          <div className="text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Experience Our 5-Star Service?
            </h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Join thousands of satisfied customers who chose Rapid Panda Movers for their relocation needs.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link 
                href="/contact" 
                className="bg-white text-orange-600 hover:bg-gray-100 font-semibold py-4 px-8 rounded-lg transition-colors"
              >
                Get Your Free Quote
              </Link>
              <Link 
                href="/services" 
                className="border-2 border-white text-white hover:bg-white hover:text-orange-600 font-semibold py-4 px-8 rounded-lg transition-colors"
              >
                View Our Services
              </Link>
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="flex items-center justify-center">
                <Phone className="w-6 h-6 mr-3" />
                <div>
                  <div className="font-semibold">Call Us</div>
                  <div className="text-orange-100">{content.site.phone}</div>
                </div>
              </div>
              
              <div className="flex items-center justify-center">
                <Mail className="w-6 h-6 mr-3" />
                <div>
                  <div className="font-semibold">Email Us</div>
                  <div className="text-orange-100">{content.site.email}</div>
                </div>
              </div>
              
              <div className="flex items-center justify-center">
                <MapPin className="w-6 h-6 mr-3" />
                <div>
                  <div className="font-semibold">Visit Us</div>
                  <div className="text-orange-100 text-sm">{content.site.address}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Resources */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              More Moving Resources
            </h2>
            <p className="text-gray-600">
              Explore our comprehensive guides and services for a successful move
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Link href="/moving-tips" className="group">
              <div className="bg-gray-50 hover:bg-gray-100 rounded-lg p-6 transition-colors">
                <div className="text-orange-500 mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-orange-500 transition-colors">
                  Moving Tips
                </h3>
                <p className="text-gray-600">
                  Expert advice to make your move easier and more efficient
                </p>
              </div>
            </Link>

            <Link href="/services" className="group">
              <div className="bg-gray-50 hover:bg-gray-100 rounded-lg p-6 transition-colors">
                <div className="text-orange-500 mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-orange-500 transition-colors">
                  Our Services
                </h3>
                <p className="text-gray-600">
                  Comprehensive moving solutions for every need
                </p>
              </div>
            </Link>

            <Link href="/faq" className="group">
              <div className="bg-gray-50 hover:bg-gray-100 rounded-lg p-6 transition-colors">
                <div className="text-orange-500 mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-orange-500 transition-colors">
                  FAQ
                </h3>
                <p className="text-gray-600">
                  Common questions about our moving services
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
