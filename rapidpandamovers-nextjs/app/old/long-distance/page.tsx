import { Truck, CheckCircle, Clock, Shield, Users, Phone, Mail, MapPin, ArrowRight, Package, Star, Navigation } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function LongDistancePage() {
  const services = [
    'Interstate moving services',
    'Professional packing and crating',
    'Secure transportation',
    'Real-time tracking',
    'Temporary storage solutions',
    'Full-service moves',
    'Partial service options',
    'Flexible scheduling'
  ]

  const destinations = [
    'Orlando', 'Tampa', 'Jacksonville', 'Fort Lauderdale',
    'Atlanta, GA', 'Charlotte, NC', 'Nashville, TN', 'New York, NY',
    'Chicago, IL', 'Dallas, TX', 'Los Angeles, CA', 'All 50 States'
  ]

  const processSteps = [
    {
      step: '1',
      title: 'Free Consultation',
      desc: 'We assess your moving needs and provide a detailed quote'
    },
    {
      step: '2', 
      title: 'Packing & Loading',
      desc: 'Professional packing and careful loading of your belongings'
    },
    {
      step: '3',
      title: 'Secure Transport',
      desc: 'Safe transportation with real-time tracking updates'
    },
    {
      step: '4',
      title: 'Delivery & Setup',
      desc: 'Careful unloading and placement at your new home'
    }
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
              <h4 className="text-lg font-medium mb-2">Long Distance Moving</h4>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="block">Reliable </span>
                <span className="text-orange-400">
                  Interstate Moving 
                </span>
                <span className="block">Services</span>
              </h1>
              <p className="text-xl mb-8 leading-relaxed">
                Planning a move across state lines? Our professional long-distance moving services make interstate relocation stress-free. With experienced crews, secure transportation, and real-time tracking, we ensure your belongings arrive safely at your new destination, no matter the distance.
              </p>
              
              {/* Quick Benefits */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-orange-400" />
                  <span className="text-sm">All 50 States Coverage</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-orange-400" />
                  <span className="text-sm">Real-Time Tracking</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-orange-400" />
                  <span className="text-sm">Licensed & Insured</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-orange-400" />
                  <span className="text-sm">Storage Solutions</span>
                </div>
              </div>
            </div>
            
            {/* Quote Form */}
            <div className="bg-white rounded-lg shadow-xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Get Your Free Long Distance Quote</h3>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input 
                    type="text" 
                    placeholder="First Name" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                  <input 
                    type="text" 
                    placeholder="Last Name" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <input 
                  type="email" 
                  placeholder="Email Address" 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <input 
                  type="tel" 
                  placeholder="Phone Number" 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input 
                    type="text" 
                    placeholder="Moving From (City, State)" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                  <input 
                    type="text" 
                    placeholder="Moving To (City, State)" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-4 px-6 rounded-lg transition-colors">
                  Get Free Interstate Quote
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Moving Process */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Our Long Distance Moving Process
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We've streamlined our interstate moving process to make your long-distance relocation as smooth as possible.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-orange-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  {step.step}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Long Distance Moving Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive interstate moving services designed to handle every aspect of your long-distance relocation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <div key={index} className="bg-white rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
                <Truck className="w-8 h-8 text-orange-500 mx-auto mb-3" />
                <p className="text-gray-800 font-medium">{service}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Popular Moving <span className="text-orange-500">Destinations</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We provide long-distance moving services to destinations across the United States.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {destinations.map((destination, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4 text-center hover:shadow-md transition-shadow">
                <Navigation className="w-5 h-5 text-orange-500 mx-auto mb-2" />
                <h4 className="font-medium text-gray-800 text-sm">{destination}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Why Choose Us for Long Distance Moves?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Licensed & Insured</h3>
              <p className="text-gray-600">Fully licensed for interstate moves with comprehensive insurance coverage for your peace of mind.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Navigation className="w-8 h-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Real-Time Tracking</h3>
              <p className="text-gray-600">Track your belongings throughout the journey with our advanced GPS tracking system.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Experienced Team</h3>
              <p className="text-gray-600">Professional movers with extensive experience in long-distance relocations.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-orange-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready for Your Interstate Move?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Get started with your long-distance move today. Our team is ready to handle every detail of your interstate relocation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/quote" className="bg-white text-orange-500 font-bold py-4 px-8 rounded-lg hover:bg-gray-100 transition-colors">
              Get Free Quote
            </Link>
            <a href="tel:(305)555-0123" className="border border-white text-white font-bold py-4 px-8 rounded-lg hover:bg-white hover:text-orange-500 transition-colors">
              Call (305) 555-0123
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}