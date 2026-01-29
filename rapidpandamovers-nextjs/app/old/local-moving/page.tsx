import { Truck, CheckCircle, Clock, Shield, Users, Phone, Mail, MapPin, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function LocalMovingPage() {
  const services = [
    'Full-service packing and unpacking',
    'Loading and unloading',
    'Furniture disassembly and reassembly',
    'Safe transportation',
    'Professional moving equipment',
    'Same-day service available',
    'Weekend and evening moves',
    'Storage solutions'
  ]

  const serviceAreas = [
    'Miami', 'Coral Gables', 'Miami Beach', 'Hialeah',
    'Doral', 'Aventura', 'Kendall', 'Homestead',
    'Palmetto Bay', 'Pinecrest', 'South Beach', 'Little Havana'
  ]

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
              <h4 className="text-lg font-medium mb-2">Rapid Panda Local Moving</h4>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="block">Experience </span>
                <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                  Stress-Free Local Moving 
                </span>
                <span className="block">in Miami</span>
              </h1>
              <p className="text-xl mb-8 leading-relaxed">
                Experience a hassle-free move in Miami with our expert local moving services! We handle everything, from packing to transport, ensuring your belongings are safe and secure. Our team is dedicated to making your move seamless, so you can settle in comfortably. Trust us for a smooth, stress-free moving experience in Miami!
              </p>
              
              {/* Quote Form */}
              <div className="bg-white rounded-lg shadow-xl p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Get Your Free Local Moving Quote</h3>
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input 
                      type="text" 
                      placeholder="Moving From" 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
                    />
                    <input 
                      type="text" 
                      placeholder="Moving To" 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
                    />
                  </div>
                  <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
                    Get Free Quote
                  </button>
                </form>
              </div>
            </div>
            
            <div className="flex justify-center">
              <Image 
                src="https://www.rapidpandamovers.com/wp-content/uploads/2024/11/local-panda-miami-mover.png" 
                alt="Local Miami Movers" 
                width={500} 
                height={400}
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              Local Moving Services in Miami
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive moving solutions for your local Miami move
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-6">What's Included in Our Local Moving Service</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {services.map((service, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{service}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Why Choose Our Local Moving Service?</h3>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Truck className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">Experienced Local Movers</h4>
                    <p className="text-gray-600">Our team knows Miami inside and out, ensuring efficient routes and timing.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">Flexible Scheduling</h4>
                    <p className="text-gray-600">Same-day, weekend, and evening moves available to fit your schedule.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Shield className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">Fully Licensed & Insured</h4>
                    <p className="text-gray-600">Your belongings are protected with full insurance coverage.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">Professional Team</h4>
                    <p className="text-gray-600">Background-checked, trained professionals handle your move with care.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Service Areas */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              Service Areas Throughout Miami-Dade
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We provide local moving services throughout Miami-Dade County
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 max-w-6xl mx-auto">
            {serviceAreas.map((area, index) => (
              <div key={index} className="bg-white rounded-lg p-4 text-center shadow-sm hover:shadow-md transition-shadow">
                <MapPin className="w-5 h-5 text-blue-600 mx-auto mb-2" />
                <h3 className="font-medium text-gray-800 text-sm">{area}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Process Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              Our Simple Local Moving Process
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">1</span>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Get Quote</h3>
              <p className="text-gray-600 text-sm">Contact us for a free, accurate estimate</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">2</span>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Schedule Move</h3>
              <p className="text-gray-600 text-sm">Choose your preferred date and time</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">3</span>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">We Move You</h3>
              <p className="text-gray-600 text-sm">Our team handles everything professionally</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">4</span>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Settle In</h3>
              <p className="text-gray-600 text-sm">Relax in your new home</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Contact CTA */}
      <section className="py-20 bg-blue-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready for Your Local Miami Move?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Get your free quote today and experience stress-free local moving in Miami!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link href="/quote" className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors inline-flex items-center justify-center">
              Get Free Quote
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <a href="tel:(305)555-0123" className="border border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center justify-center">
              <Phone className="mr-2 w-5 h-5" />
              Call (305) 555-0123
            </a>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center text-blue-100">
            <div className="flex items-center space-x-2">
              <Mail className="w-5 h-5" />
              <span>info@rapidpandamovers.com</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5" />
              <span>Available 7 Days a Week</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}