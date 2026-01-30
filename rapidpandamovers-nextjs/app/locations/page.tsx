import { MapPin, Phone, Mail, Clock, Navigation } from 'lucide-react'
import { allContent, allCities } from '@/lib/data'
import Hero from '@/app/components/Hero'

export default function LocationsPage() {
  const content = allContent
  const contactInfo = content.contact.contact_info
  const serviceAreas = content.contact.service_areas

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <Hero
        title={serviceAreas.title}
        description={serviceAreas.description}
        cta="Get Your Free Quote"
      />

      {/* Primary Service Areas */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Primary Service Areas
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We provide comprehensive moving services to these key areas throughout Miami-Dade County
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6">
            {serviceAreas.primary_areas.map((area, index) => (
              <div key={index} className="bg-white rounded-lg p-6 text-center shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
                <MapPin className="w-8 h-8 text-orange-500 mx-auto mb-4" />
                <h3 className="font-bold text-gray-800 text-lg mb-2">{area}</h3>
                <p className="text-gray-600 text-sm">
                  Professional moving services
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Service Areas */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Additional Service Areas
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We also serve these additional neighborhoods and communities throughout Miami-Dade County
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
            {serviceAreas.additional_areas.map((area, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4 text-center hover:bg-orange-50 transition-colors border border-gray-200">
                <Navigation className="w-6 h-6 text-orange-500 mx-auto mb-3" />
                <h4 className="font-semibold text-gray-800 text-sm">{area}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Coverage Map Section */}
      <section className="py-20 bg-gradient-to-br from-orange-50 to-orange-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              Complete Miami-Dade Coverage
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              From the beaches of Miami Beach to the suburbs of Homestead, we provide reliable moving services 
              throughout the entire Miami-Dade County area. Our local expertise ensures your move is handled 
              with care and efficiency.
            </p>
            
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <div className="bg-white rounded-lg p-6 shadow-lg">
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Local Expertise</h3>
                <p className="text-gray-600">
                  We know Miami-Dade County inside and out, ensuring efficient routes and local knowledge.
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-lg">
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Flexible Scheduling</h3>
                <p className="text-gray-600">
                  Same-day service available throughout our service area with flexible scheduling options.
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-lg">
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Navigation className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Reliable Service</h3>
                <p className="text-gray-600">
                  Licensed, insured, and committed to providing exceptional moving services in every area we serve.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-20 bg-gray-800 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Move in Miami-Dade?
            </h2>
            <p className="text-xl text-gray-300 mb-12">
              Contact us today for your free moving quote. We serve all areas of Miami-Dade County.
            </p>
            
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <Phone className="w-8 h-8 text-orange-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Call Us</h3>
                <p className="text-gray-300">
                  <a href={`tel:${contactInfo.phone}`} className="text-orange-400 hover:text-orange-300">
                    {contactInfo.phone}
                  </a>
                </p>
              </div>
              
              <div className="text-center">
                <Mail className="w-8 h-8 text-orange-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Email Us</h3>
                <p className="text-gray-300">
                  <a href={`mailto:${contactInfo.email}`} className="text-orange-400 hover:text-orange-300">
                    {contactInfo.email}
                  </a>
                </p>
              </div>
              
              <div className="text-center">
                <Clock className="w-8 h-8 text-orange-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Hours</h3>
                <p className="text-gray-300">{contactInfo.hours}</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="bg-orange-500 text-white px-8 py-4 rounded-lg font-semibold hover:bg-orange-600 transition-colors inline-flex items-center justify-center gap-2"
              >
                Get Free Quote
              </a>
              <a
                href={`tel:${contactInfo.phone}`}
                className="bg-orange-500 text-white px-8 py-4 rounded-lg font-semibold hover:bg-orange-600 transition-colors inline-flex items-center justify-center gap-2"
              >
                <Phone className="w-5 h-5" />
                Call Now
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
