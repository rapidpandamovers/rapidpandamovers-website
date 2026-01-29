import { Package, CheckCircle, Clock, Shield, Users, Phone, Mail, MapPin, ArrowRight, Box, Truck, Star } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function PackingServicesPage() {
  const services = [
    'Professional packing materials',
    'Fragile item special handling',
    'Furniture wrapping and protection',
    'Custom crating for valuables',
    'Unpacking at your new home',
    'Box labeling and inventory',
    'Partial and full-service packing',
    'Same-day packing available'
  ]

  const packingMaterials = [
    { name: 'Moving Boxes', desc: 'Various sizes for all your items' },
    { name: 'Bubble Wrap', desc: 'Protection for fragile items' },
    { name: 'Packing Paper', desc: 'Acid-free newsprint wrapping' },
    { name: 'Tape & Labels', desc: 'Heavy-duty sealing supplies' },
    { name: 'Furniture Pads', desc: 'Protection for large items' },
    { name: 'Specialty Boxes', desc: 'Wardrobes, dishes, electronics' }
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
              <h4 className="text-lg font-medium mb-2">Professional Packing Services</h4>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="block">Expert </span>
                <span className="text-orange-400">
                  Packing & Unpacking 
                </span>
                <span className="block">Services in Miami</span>
              </h1>
              <p className="text-xl mb-8 leading-relaxed">
                Let our professional packing team handle the careful wrapping and packing of all your belongings. We use high-quality materials and proven techniques to ensure your items arrive safely at your new home. From fragile antiques to everyday household goods, we pack it all with care.
              </p>
              
              {/* Quick Benefits */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-orange-400" />
                  <span className="text-sm">Professional Materials</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-orange-400" />
                  <span className="text-sm">Fragile Item Care</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-orange-400" />
                  <span className="text-sm">Time-Saving Service</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-orange-400" />
                  <span className="text-sm">Full Insurance Coverage</span>
                </div>
              </div>
            </div>
            
            {/* Quote Form */}
            <div className="bg-white rounded-lg shadow-xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Get Your Free Packing Quote</h3>
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
                <textarea 
                  placeholder="Tell us about your packing needs..." 
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                ></textarea>
                <button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-4 px-6 rounded-lg transition-colors">
                  Get Free Packing Quote
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Our Packing Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Professional packing services designed to protect your belongings and save you time during your move.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
                <Package className="w-8 h-8 text-orange-500 mx-auto mb-3" />
                <p className="text-gray-800 font-medium">{service}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Packing Materials */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Professional Packing <span className="text-orange-500">Materials</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We use only the highest quality packing materials to ensure your belongings are protected during transport.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {packingMaterials.map((material, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                <Box className="w-12 h-12 text-orange-500 mb-4" />
                <h3 className="text-xl font-bold text-gray-800 mb-2">{material.name}</h3>
                <p className="text-gray-600">{material.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Our Packing Services */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Why Choose Our Packing Services?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Expert Handling</h3>
              <p className="text-gray-600">Our trained professionals know how to pack every type of item safely and efficiently.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Time-Saving</h3>
              <p className="text-gray-600">Focus on other aspects of your move while we handle all the packing for you.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Quality Materials</h3>
              <p className="text-gray-600">We use premium packing materials to ensure maximum protection for your belongings.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-orange-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready for Professional Packing Services?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Let our expert team handle your packing needs. Contact us today for a free quote and discover the difference professional packing makes.
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