import { Building, CheckCircle, Clock, Shield, Users, Phone, Mail, MapPin, ArrowRight, Package, Star, Briefcase } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function CommercialMovingPage() {
  const services = [
    'Office relocations',
    'IT equipment moving',
    'Furniture disassembly/assembly',
    'Document and file moving',
    'Equipment and machinery transport',
    'Weekend and after-hours moves',
    'Minimal downtime planning',
    'Storage solutions'
  ]

  const businessTypes = [
    { name: 'Law Firms', desc: 'Confidential document handling' },
    { name: 'Medical Offices', desc: 'Sensitive equipment transport' },
    { name: 'Tech Companies', desc: 'Server and IT equipment moves' },
    { name: 'Retail Stores', desc: 'Inventory and fixture relocation' },
    { name: 'Restaurants', desc: 'Kitchen equipment and furniture' },
    { name: 'Manufacturing', desc: 'Heavy machinery transport' }
  ]

  const processSteps = [
    {
      step: '1',
      title: 'Site Survey',
      desc: 'We assess your business needs and create a detailed moving plan'
    },
    {
      step: '2', 
      title: 'Strategic Planning',
      desc: 'Minimize downtime with careful scheduling and logistics'
    },
    {
      step: '3',
      title: 'Professional Execution',
      desc: 'Experienced team handles all aspects of your business move'
    },
    {
      step: '4',
      title: 'Setup & Testing',
      desc: 'Get your business up and running quickly at the new location'
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
              <h4 className="text-lg font-medium mb-2">Commercial Moving Services</h4>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="block">Professional </span>
                <span className="text-orange-400">
                  Business & Office 
                </span>
                <span className="block">Relocations</span>
              </h1>
              <p className="text-xl mb-8 leading-relaxed">
                Relocating your business? Our commercial moving services are designed to minimize downtime and get your business operational quickly. From small offices to large corporations, we handle every detail of your business move with professionalism and efficiency.
              </p>
              
              {/* Quick Benefits */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-orange-400" />
                  <span className="text-sm">Minimal Downtime</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-orange-400" />
                  <span className="text-sm">Professional Team</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-orange-400" />
                  <span className="text-sm">After-Hours Service</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-orange-400" />
                  <span className="text-sm">Fully Insured</span>
                </div>
              </div>
            </div>
            
            {/* Quote Form */}
            <div className="bg-white rounded-lg shadow-xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Get Your Free Commercial Quote</h3>
              <form className="space-y-4">
                <input 
                  type="text" 
                  placeholder="Business Name" 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input 
                    type="text" 
                    placeholder="Contact Name" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                  <input 
                    type="text" 
                    placeholder="Job Title" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <input 
                  type="email" 
                  placeholder="Business Email" 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <input 
                  type="tel" 
                  placeholder="Phone Number" 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <textarea 
                  placeholder="Describe your business moving needs..." 
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                ></textarea>
                <button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-4 px-6 rounded-lg transition-colors">
                  Get Free Business Quote
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
              Our Commercial Moving Process
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We follow a proven process to ensure your business relocation is completed efficiently with minimal disruption.
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
              Commercial Moving Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive business relocation services tailored to your specific industry needs.
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

      {/* Business Types We Serve */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Industries We <span className="text-orange-500">Serve</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our commercial moving expertise spans across various industries, each with unique requirements.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {businessTypes.map((business, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow">
                <Briefcase className="w-12 h-12 text-orange-500 mb-4" />
                <h3 className="text-xl font-bold text-gray-800 mb-2">{business.name}</h3>
                <p className="text-gray-600">{business.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Our Commercial Services */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Why Choose Our Commercial Moving Services?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Minimize Downtime</h3>
              <p className="text-gray-600">Strategic planning and efficient execution to keep your business disruption to a minimum.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Professional Handling</h3>
              <p className="text-gray-600">Experienced team trained in handling sensitive business equipment and documents.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Flexible Scheduling</h3>
              <p className="text-gray-600">After-hours and weekend moves available to accommodate your business schedule.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-orange-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Relocate Your Business?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Let our commercial moving experts handle your business relocation. Contact us today for a customized moving solution.
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