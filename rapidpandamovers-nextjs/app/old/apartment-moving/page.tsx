import { Building, CheckCircle, Clock, Shield, Users, Phone, Mail, MapPin, ArrowRight, Package, Star, DollarSign, Home as HomeIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function ApartmentMovingPage() {
  const services = [
    'Studio and 1-bedroom moves',
    'Multi-bedroom apartment moves',
    'High-rise apartment expertise',
    'Elevator and stair navigation',
    'Packing and unpacking services',
    'Furniture disassembly/reassembly',
    'Same-day service available',
    'Weekend moves available'
  ]

  const apartmentTypes = [
    { name: 'Studio Apartments', desc: 'Efficient moves for studio spaces', time: '2-4 hours' },
    { name: '1-Bedroom', desc: 'Perfect for single professionals', time: '3-5 hours' },
    { name: '2-Bedroom', desc: 'Ideal for couples and roommates', time: '4-6 hours' },
    { name: '3+ Bedrooms', desc: 'Family-sized apartment moves', time: '6-8 hours' }
  ]

  const processSteps = [
    {
      step: '1',
      title: 'Free Assessment',
      desc: 'We evaluate your apartment and provide an accurate quote'
    },
    {
      step: '2', 
      title: 'Packing & Prep',
      desc: 'Professional packing with apartment-optimized techniques'
    },
    {
      step: '3',
      title: 'Efficient Moving',
      desc: 'Quick loading and transport with minimal building disruption'
    },
    {
      step: '4',
      title: 'Setup & Settling',
      desc: 'Unloading and placement to get you settled quickly'
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
              <h4 className="text-lg font-medium mb-2">Apartment Moving Specialists</h4>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="block">Budget-Friendly </span>
                <span className="text-orange-400">
                  Apartment Moving 
                </span>
                <span className="block">in Miami</span>
              </h1>
              <p className="text-xl mb-8 leading-relaxed">
                Specializing in apartment moves of all sizes - from cozy studios to spacious multi-bedroom units. Our experienced team understands the unique challenges of apartment moving and provides efficient, affordable solutions tailored to your space and budget.
              </p>
              
              {/* Quick Benefits */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-orange-400" />
                  <span className="text-sm">Budget-Friendly Rates</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-orange-400" />
                  <span className="text-sm">High-Rise Expertise</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-orange-400" />
                  <span className="text-sm">Same-Day Service</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-orange-400" />
                  <span className="text-sm">No Hidden Fees</span>
                </div>
              </div>
            </div>
            
            {/* Quote Form */}
            <div className="bg-white rounded-lg shadow-xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Get Your Free Apartment Moving Quote</h3>
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
                <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                  <option value="">Select Apartment Size</option>
                  <option value="studio">Studio Apartment</option>
                  <option value="1br">1 Bedroom</option>
                  <option value="2br">2 Bedroom</option>
                  <option value="3br">3+ Bedroom</option>
                </select>
                <input 
                  type="date" 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-4 px-6 rounded-lg transition-colors">
                  Get Free Apartment Quote
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
              Our Apartment Moving Process
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Streamlined process designed specifically for apartment moves, ensuring efficiency and minimal disruption.
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
              Apartment Moving Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Specialized services designed to handle the unique challenges of apartment moving.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <div key={index} className="bg-white rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
                <Building className="w-8 h-8 text-orange-500 mx-auto mb-3" />
                <p className="text-gray-800 font-medium">{service}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Apartment Types */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Apartment Types We <span className="text-orange-500">Specialize</span> In
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From cozy studios to spacious multi-bedroom units, we handle all apartment types with expertise.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {apartmentTypes.map((apartment, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6 text-center hover:shadow-md transition-shadow">
                <HomeIcon className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-800 mb-2">{apartment.name}</h3>
                <p className="text-gray-600 mb-3">{apartment.desc}</p>
                <div className="bg-orange-100 text-orange-800 text-sm font-medium px-3 py-1 rounded-full">
                  {apartment.time}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Our Apartment Services */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Why Choose Our Apartment Moving Services?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-8 h-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Budget-Friendly Pricing</h3>
              <p className="text-gray-600">Transparent, affordable rates designed for apartment moves with no hidden fees.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building className="w-8 h-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">High-Rise Expertise</h3>
              <p className="text-gray-600">Experienced in navigating elevators, stairs, and building regulations efficiently.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Quick Turnaround</h3>
              <p className="text-gray-600">Efficient apartment moves designed to minimize disruption to your schedule.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-orange-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready for Your Apartment Move?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Get started with your budget-friendly apartment move today. Our team specializes in making apartment relocations quick and affordable.
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