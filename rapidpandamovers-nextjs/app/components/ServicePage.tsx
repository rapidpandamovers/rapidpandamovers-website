import Hero from './Hero';
import WhyChoose from './WhyChoose';
import FinalCTASection from './FinalCTASection';
import AutoLinks from '@/components/AutoLinks';
import { buildLinkBlocks } from '@/components/buildLinkBlocks';
import { CheckCircle, MapPin } from 'lucide-react';

interface ServicePageProps {
  service: {
    name: string;
    slug: string;
    title: string;
    description: string;
    hero?: {
      title: string;
      description: string;
      cta: string;
      image_url: string;
    };
    process?: Array<{
      step: string;
      title: string;
      description: string;
    }>;
    benefits?: string[];
    extras?: string[];
    areas?: string[];
  };
}

export default function ServicePage({ service }: ServicePageProps) {
  const blocks = buildLinkBlocks(service.slug);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero
        title={service.hero?.title || service.title}
        description={service.hero?.description || service.description}
        cta={service.hero?.cta || 'Get Your Free Quote'}
        image_url={service.hero?.image_url}
      />

      {/* Process Steps */}
      {service.process && service.process.length > 0 && (
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                Our <span className="text-orange-500">Moving Process</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                A simple, stress-free process designed to make your move as smooth as possible
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {service.process.map((step, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-orange-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Benefits Section */}
      {service.benefits && service.benefits.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                Why Choose Our <span className="text-orange-500">{service.name}</span>?
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {service.benefits.map((benefit, index) => (
                <div key={index} className="bg-white rounded-lg p-6 shadow-md flex items-start space-x-4">
                  <CheckCircle className="w-6 h-6 text-orange-500 flex-shrink-0 mt-1" />
                  <p className="text-gray-700 font-medium">{benefit}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Extras/Included Items */}
      {service.extras && service.extras.length > 0 && (
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                What's <span className="text-orange-500">Included</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Everything you need for a complete moving experience
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
              {service.extras.map((extra, index) => (
                <div key={index} className="flex items-center space-x-3 bg-gray-50 rounded-lg p-4">
                  <CheckCircle className="w-5 h-5 text-orange-500 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">{extra}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Service Areas */}
      {service.areas && service.areas.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                Service <span className="text-orange-500">Areas</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                We provide {service.name.toLowerCase()} services in these areas
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 max-w-6xl mx-auto">
              {service.areas.map((area, index) => (
                <div key={index} className="bg-white rounded-lg p-4 text-center shadow-sm hover:shadow-md transition-shadow">
                  <MapPin className="w-5 h-5 text-orange-500 mx-auto mb-2" />
                  <h4 className="font-medium text-gray-800 text-sm">{area}</h4>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Why Choose Us */}
      <WhyChoose />

      {/* Auto Links */}
      {blocks.length > 0 && (
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 max-w-4xl">
            <AutoLinks blocks={blocks} />
          </div>
        </section>
      )}

      {/* Final CTA */}
      <FinalCTASection />
    </div>
  );
}




