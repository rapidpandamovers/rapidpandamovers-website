import { Truck, Package, Shield, Home as HomeIcon, Building, Car, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { allServices } from '@/lib/data'

interface ServiceSectionProps {
  // When location is provided, show services for that location
  location?: {
    name: string;
    slug: string;
    // If parentCity is present, this is a neighborhood
    parentCity?: {
      name: string;
      slug: string;
    };
  };
}

export default function ServiceSection({ location }: ServiceSectionProps = {}) {
  // If location is provided, show location-specific services
  if (location) {
    const isNeighborhood = !!location.parentCity;
    const activeServices = allServices.filter(service => service.is_active !== false).slice(0, 6);

    return (
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              {isNeighborhood ? 'Our' : 'Moving'} <span className="text-orange-500">Services</span> in {location.name}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {isNeighborhood
                ? 'Professional moving services tailored to your needs'
                : 'We offer a complete range of moving services to meet all your relocation needs'
              }
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {activeServices.map((service, index) => (
              <Link
                key={index}
                href={`/${location.slug}-${service.slug}`}
                className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow group"
              >
                <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-orange-500 transition-colors">
                  {service.name}
                </h3>
                <p className="text-gray-600 mb-4 text-sm">{service.description}</p>
                <div className="text-orange-600 group-hover:text-orange-700 font-medium flex items-center text-sm">
                  Learn More
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Default: show hardcoded services with icons
  const services = [
    { icon: HomeIcon, title: 'Local Moving', desc: 'Professional local moving services within Miami-Dade County with experienced crews.' },
    { icon: Building, title: 'Commercial Moving', desc: 'Expert office and business relocations with minimal downtime and maximum efficiency.' },
    { icon: Package, title: 'Packing Services', desc: 'Complete packing and unpacking services using professional-grade materials and techniques.' },
    { icon: Car, title: 'Long Distance Moving', desc: 'Reliable interstate moving services across Florida and beyond with full tracking.' },
    { icon: Shield, title: 'Specialized Moving', desc: 'Piano, artwork, and fragile item moving with specialized equipment and expertise.' },
    { icon: Truck, title: 'Same Day Service', desc: 'Emergency and last-minute moving services available 7 days a week for urgent moves.' }
  ]

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Experience The Best In <span className="text-orange-500">Miami</span>
          </h2>
          <h3 className="text-2xl md:text-3xl font-bold text-gray-800">
            Moving Services
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const IconComponent = service.icon
            return (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <IconComponent className="w-8 h-8 text-orange-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{service.title}</h3>
                <p className="text-gray-600">{service.desc}</p>
              </div>
            )
          })}
        </div>

        <div className="text-center mt-12">
          <Link href="/services" className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-8 rounded-lg transition-colors">
            View All Services
          </Link>
        </div>
      </div>
    </section>
  )
}
