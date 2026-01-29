import { CheckCircle, Heart, Shield, Users } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function AboutUsFull() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-cover bg-center py-20" style={{
        backgroundImage: "url('https://www.rapidpandamovers.com/wp-content/uploads/2024/10/Rectangle-39-scaled.jpg')"
      }}>
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                  About Rapid Panda Moving
                </span>
              </h1>
              <p className="text-xl mb-8 leading-relaxed">
                Welcome to Rapid Panda Movers, where every move we make is guided by a commitment to excellence and a dedication to serving our community.
              </p>
              
              {/* Quote Form */}
              <div className="bg-white rounded-lg shadow-xl p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Get Your Free Quote</h3>
                <form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input 
                      type="text" 
                      placeholder="First Name" 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
                    />
                    <input 
                      type="text" 
                      placeholder="Last Name" 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
                    />
                  </div>
                  <input 
                    type="email" 
                    placeholder="Email Address" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
                  />
                  <input 
                    type="tel" 
                    placeholder="Phone Number" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
                  />
                  <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
                    Get Free Quote
                  </button>
                </form>
              </div>
            </div>
            
            <div className="flex justify-center">
              <Image 
                src="https://www.rapidpandamovers.com/wp-content/uploads/2024/11/about-us-rapid-panda.png" 
                alt="About Us - Rapid Panda Movers" 
                width={500} 
                height={400}
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>
      
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
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Why Choose Us?</h3>
                <p className="text-gray-600 mb-6">
                  With years of experience serving the Miami-Dade community, we've built our reputation on reliability, professionalism, and exceptional customer service.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Heart className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Customer-Focused</h4>
                      <p className="text-sm text-gray-600">Your satisfaction is our priority</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Shield className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Fully Insured</h4>
                      <p className="text-sm text-gray-600">Licensed and bonded for your protection</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Experienced Team</h4>
                      <p className="text-sm text-gray-600">Professional, trained, and background-checked staff</p>
                    </div>
                  </div>
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
            <Link href="/contact" className="border border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
