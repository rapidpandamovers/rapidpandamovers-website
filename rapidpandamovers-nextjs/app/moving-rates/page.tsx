import React from 'react';
import { Metadata } from 'next';
import content from '../../data/content.json';
import Hero from '../components/Hero';

export const metadata: Metadata = {
  title: content.rates.title,
  description: content.rates.description,
};

export default function RatesPage() {
  const { rates } = content;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <Hero
        title={rates.hero.title}
        description={rates.hero.description}
        cta={rates.hero.cta}
      />

      {/* Pricing Structure */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Local Moving Rates */}
            <div className="bg-gray-50 p-8 rounded-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                {rates.pricing_structure.local_moving.title}
              </h2>
              <p className="text-gray-600 mb-8">
                {rates.pricing_structure.local_moving.description}
              </p>
              <div className="space-y-6">
                {rates.pricing_structure.local_moving.rates.map((rate, index) => (
                  <div key={index} className="border-l-4 border-orange-500 pl-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {rate.service}
                      </h3>
                      <span className="text-2xl font-bold text-orange-600">
                        {rate.rate}
                      </span>
                    </div>
                    <p className="text-gray-600">{rate.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Packing Services */}
            <div className="bg-gray-50 p-8 rounded-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                {rates.pricing_structure.packing_services.title}
              </h2>
              <div className="space-y-6">
                {rates.pricing_structure.packing_services.rates.map((rate, index) => (
                  <div key={index} className="border-l-4 border-orange-500 pl-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {rate.service}
                      </h3>
                      <span className="text-2xl font-bold text-orange-600">
                        {rate.rate}
                      </span>
                    </div>
                    <p className="text-gray-600">{rate.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              What's Included in Your Move
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need for a successful move, included in our transparent pricing
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rates.whats_included.map((item, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-800 font-medium">{item}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Services */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Additional Services
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Optional services available for your specific moving needs
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {rates.additional_services.map((service, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg text-center">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {service.service}
                </h3>
                <div className="text-3xl font-bold text-orange-600 mb-4">
                  {service.rate}
                </div>
                <p className="text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote CTA Section */}
      <section className="py-16 bg-orange-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Get Your Free Quote?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Contact us today for a detailed, no-obligation estimate for your move
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-orange-600 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors">
              Get Free Quote
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-white hover:text-orange-600 transition-colors">
              Call (786) 585-4269
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
