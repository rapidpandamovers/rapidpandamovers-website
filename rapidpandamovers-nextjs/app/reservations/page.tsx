import React from 'react';
import { Metadata } from 'next';
import content from '../../data/content.json';

export const metadata: Metadata = {
  title: `Reservations - ${content.site.title}`,
  description: 'Book your move with Rapid Panda Movers. Professional moving services in Miami with transparent pricing and flexible scheduling.',
};

export default function ReservationsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Book Your Move Today
            </h1>
            <p className="text-xl md:text-2xl mb-8">
              Professional moving services with transparent pricing and flexible scheduling
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="tel:786-585-4269" 
                className="bg-white text-orange-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Call Now: {content.site.phone}
              </a>
              <a 
                href="#booking-form" 
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-orange-600 transition-colors"
              >
                Get Free Quote
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Overview */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              {content.rates.title}
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {/* Local Moving Rates */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-2xl font-semibold mb-4 text-orange-600">
                  {content.rates.pricing_structure.local_moving.title}
                </h3>
                <p className="text-gray-600 mb-6">
                  {content.rates.pricing_structure.local_moving.description}
                </p>
                <div className="space-y-4">
                  {content.rates.pricing_structure.local_moving.rates.map((rate, index) => (
                    <div key={index} className="flex justify-between items-center p-4 bg-white rounded-lg">
                      <div>
                        <div className="font-semibold">{rate.service}</div>
                        <div className="text-sm text-gray-600">{rate.description}</div>
                      </div>
                      <div className="text-lg font-bold text-orange-600">{rate.rate}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Packing Services */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-2xl font-semibold mb-4 text-orange-600">
                  {content.rates.pricing_structure.packing_services.title}
                </h3>
                <div className="space-y-4">
                  {content.rates.pricing_structure.packing_services.rates.map((rate, index) => (
                    <div key={index} className="flex justify-between items-center p-4 bg-white rounded-lg">
                      <div>
                        <div className="font-semibold">{rate.service}</div>
                        <div className="text-sm text-gray-600">{rate.description}</div>
                      </div>
                      <div className="text-lg font-bold text-orange-600">{rate.rate}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* What's Included */}
            <div className="mt-12">
              <h3 className="text-2xl font-semibold mb-6 text-center">What's Included</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {content.rates.whats_included.map((item, index) => (
                  <div key={index} className="flex items-center p-4 bg-green-50 rounded-lg">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Form */}
      <section id="booking-form" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Get Your Free Quote</h2>
              <p className="text-xl text-gray-600">
                Fill out the form below and we'll contact you within 24 hours with a detailed estimate.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8">
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="move-date" className="block text-sm font-medium text-gray-700 mb-2">
                      Preferred Move Date *
                    </label>
                    <input
                      type="date"
                      id="move-date"
                      name="move-date"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="move-type" className="block text-sm font-medium text-gray-700 mb-2">
                      Type of Move *
                    </label>
                    <select
                      id="move-type"
                      name="move-type"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option value="">Select move type</option>
                      <option value="local">Local Moving</option>
                      <option value="long-distance">Long Distance Moving</option>
                      <option value="commercial">Commercial Moving</option>
                      <option value="apartment">Apartment Moving</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="origin-address" className="block text-sm font-medium text-gray-700 mb-2">
                    Origin Address *
                  </label>
                  <textarea
                    id="origin-address"
                    name="origin-address"
                    required
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Street address, city, state, zip code"
                  />
                </div>

                <div>
                  <label htmlFor="destination-address" className="block text-sm font-medium text-gray-700 mb-2">
                    Destination Address *
                  </label>
                  <textarea
                    id="destination-address"
                    name="destination-address"
                    required
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Street address, city, state, zip code"
                  />
                </div>

                <div>
                  <label htmlFor="additional-services" className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Services Needed
                  </label>
                  <div className="grid md:grid-cols-2 gap-4">
                    <label className="flex items-center">
                      <input type="checkbox" name="packing" className="mr-3" />
                      <span>Packing Services</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" name="unpacking" className="mr-3" />
                      <span>Unpacking Services</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" name="storage" className="mr-3" />
                      <span>Storage Services</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" name="furniture" className="mr-3" />
                      <span>Furniture Assembly</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label htmlFor="special-instructions" className="block text-sm font-medium text-gray-700 mb-2">
                    Special Instructions
                  </label>
                  <textarea
                    id="special-instructions"
                    name="special-instructions"
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Any special requirements, fragile items, or additional information..."
                  />
                </div>

                <div className="text-center">
                  <button
                    type="submit"
                    className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
                  >
                    Get My Free Quote
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              Contact Information
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Phone</h3>
                <p className="text-gray-600">
                  <a href={`tel:${content.site.phone}`} className="hover:text-orange-600">
                    {content.site.phone}
                  </a>
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Email</h3>
                <p className="text-gray-600">
                  <a href={`mailto:${content.site.email}`} className="hover:text-orange-600">
                    {content.site.email}
                  </a>
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Address</h3>
                <p className="text-gray-600">{content.site.address}</p>
              </div>
            </div>
            <div className="text-center mt-8">
              <p className="text-lg text-gray-600">
                <strong>Hours:</strong> {content.contact.contact_info.hours}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Service Areas */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              {content.contact.service_areas.title}
            </h2>
            <p className="text-xl text-gray-600 text-center mb-12">
              {content.contact.service_areas.description}
            </p>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">Primary Service Areas</h3>
                <div className="grid grid-cols-2 gap-2">
                  {content.contact.service_areas.primary_areas.map((area, index) => (
                    <div key={index} className="flex items-center p-3 bg-white rounded-lg">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                      <span>{area}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4">Additional Areas</h3>
                <div className="grid grid-cols-2 gap-2">
                  {content.contact.service_areas.additional_areas.map((area, index) => (
                    <div key={index} className="flex items-center p-3 bg-white rounded-lg">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                      <span>{area}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              {content.faq.questions.slice(0, 6).map((faq, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-3 text-orange-600">
                    {faq.question}
                  </h3>
                  <p className="text-gray-700">{faq.answer}</p>
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <a 
                href="/faq" 
                className="text-orange-600 hover:text-orange-700 font-semibold"
              >
                View All FAQs →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-orange-500 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">
              Ready to Book Your Move?
            </h2>
            <p className="text-xl mb-8">
              Get your free quote today and experience professional moving services
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="tel:786-585-4269" 
                className="bg-white text-orange-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Call Now: {content.site.phone}
              </a>
              <a 
                href="#booking-form" 
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-orange-600 transition-colors"
              >
                Get Free Quote
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
