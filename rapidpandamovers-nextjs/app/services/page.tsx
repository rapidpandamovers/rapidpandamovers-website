import { Truck, Package, Shield, Clock, DollarSign, Users, CheckCircle, ArrowRight, Phone, Mail, Star, Home as HomeIcon, Building, Car, Archive, Briefcase } from 'lucide-react'
import Link from 'next/link'
import Hero from '../components/Hero'
import LocationSection from '../components/LocationSection'

export default function ServicesPage() {
  const mainServices = [
    {
      icon: HomeIcon,
      title: 'Local Moving',
      description: 'Professional local moving services within Miami-Dade County with experienced crews and transparent pricing.',
      features: ['Same-day service', 'Professional equipment', 'Furniture protection', 'Transparent pricing'],
      link: '/local-moving'
    },
    {
      icon: Building,
      title: 'Apartment Moving',
      description: 'Specialized apartment moving services designed for efficiency and affordability in Miami.',
      features: ['Budget-friendly rates', 'Quick turnaround', 'Stair navigation', 'Compact space expertise'],
      link: '/apartment-moving'
    },
    {
      icon: Package,
      title: 'Packing Services',
      description: 'Expert packing and unpacking services using professional-grade materials and techniques.',
      features: ['Professional materials', 'Fragile item care', 'Custom crating', 'Full/partial service'],
      link: '/packing-services'
    },
    {
      icon: Car,
      title: 'Long Distance Moving',
      description: 'Reliable interstate moving services across Florida and beyond with full tracking and insurance.',
      features: ['All 50 states', 'Real-time tracking', 'Licensed & insured', 'Storage solutions'],
      link: '/long-distance'
    },
    {
      icon: Briefcase,
      title: 'Commercial Moving',
      description: 'Professional business relocations with minimal downtime and maximum efficiency.',
      features: ['Minimal downtime', 'After-hours service', 'IT equipment handling', 'Project management'],
      link: '/commercial-moving'
    },
    {
      icon: Archive,
      title: 'Storage Solutions',
      description: 'Secure storage facilities with climate control and professional handling services.',
      features: ['Climate controlled', '24/7 security', 'Flexible terms', 'Pick-up/delivery'],
      link: '/storage-solutions'
    }
  ]

  const additionalServices = [
    'Piano Moving',
    'Artwork & Antiques',
    'Pool Table Moving',
    'Hot Tub Relocation',
    'Furniture Assembly',
    'Cleaning Services',
    'Handyman Services',
    'Moving Supplies'
  ]

  const whyChooseUs = [
    {
      icon: Shield,
      title: 'Licensed & Insured',
      description: 'Fully licensed and comprehensively insured for your complete peace of mind.'
    },
    {
      icon: Users,
      title: 'Experienced Team',
      description: 'Professional movers with years of experience in all types of relocations.'
    },
    {
      icon: DollarSign,
      title: 'Transparent Pricing',
      description: 'No hidden fees or surprise charges. Honest, upfront pricing every time.'
    },
    {
      icon: Clock,
      title: 'Reliable Service',
      description: 'On-time service with flexible scheduling to accommodate your needs.'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <Hero
        title="Complete Moving Services in Miami"
        description="From local moves to long-distance relocations, packing to storage - we provide comprehensive moving services designed to make your relocation stress-free and affordable."
        cta="Get Your Free Quote"
      />

      {/* Main Services */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Our Moving Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Professional moving services tailored to meet your specific needs, timeline, and budget.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mainServices.map((service, index) => {
              const IconComponent = service.icon
              return (
                <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow group">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-500 transition-colors">
                    <IconComponent className="w-8 h-8 text-orange-500 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3 text-center">{service.title}</h3>
                  <p className="text-gray-600 mb-4 text-center">{service.description}</p>
                  
                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-orange-500 mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <div className="text-center">
                    <Link 
                      href={service.link}
                      className="inline-flex items-center text-orange-600 hover:text-orange-700 font-semibold group"
                    >
                      Learn More
                      <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Additional Services */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Additional <span className="text-orange-500">Services</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Specialized services to handle all aspects of your move, from delicate items to final touches.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {additionalServices.map((service, index) => (
              <div key={index} className="bg-white rounded-lg p-4 text-center hover:shadow-md transition-shadow">
                <Star className="w-6 h-6 text-orange-500 mx-auto mb-2" />
                <h4 className="font-medium text-gray-800 text-sm">{service}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Why Choose Rapid Panda Movers?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're committed to providing exceptional moving services that exceed your expectations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyChooseUs.map((reason, index) => {
              const IconComponent = reason.icon
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="w-8 h-8 text-orange-500" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">{reason.title}</h3>
                  <p className="text-gray-600">{reason.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Service Locations */}
      <LocationSection />
    </div>
  )
}