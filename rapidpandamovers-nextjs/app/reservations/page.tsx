import React from 'react';
import { Metadata } from 'next';
import content from '../../data/content.json';
import Hero from '../components/Hero';

export const metadata: Metadata = {
  title: `Reservations - ${content.site.title}`,
  description: 'Book your move with Rapid Panda Movers. Professional moving services in Miami with transparent pricing and flexible scheduling.',
};

export default function ReservationsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <Hero
        title="Book Your Move Today"
        description="Professional moving services with transparent pricing and flexible scheduling"
        cta="Get Your Free Quote"
      />

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
              <h2 className="text-3xl font-bold mb-4">Book Your Move</h2>
              <p className="text-xl text-gray-600">
                Fill out the form below to reserve your moving date
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8">
              <form className="space-y-8">
                {/* Section 1: Personal Details */}
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-orange-600 border-b border-gray-200 pb-2">
                    1. Personal Details
                  </h3>
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
                        placeholder="(786) 555-1234"
                      />
                    </div>
                    <div>
                      <label htmlFor="reference" className="block text-sm font-medium text-gray-700 mb-2">
                        Reference Number (if any)
                      </label>
                      <input
                        type="text"
                        id="reference"
                        name="reference"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Quote reference #"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 2: Moving Locations */}
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-orange-600 border-b border-gray-200 pb-2">
                    2. Moving Locations
                  </h3>

                  {/* Pick-up Location */}
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-800 mb-3">Pick-up Location</h4>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="md:col-span-2">
                        <label htmlFor="pickup-address" className="block text-sm font-medium text-gray-700 mb-2">
                          Address *
                        </label>
                        <input
                          type="text"
                          id="pickup-address"
                          name="pickup-address"
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder="Street address"
                        />
                      </div>
                      <div>
                        <label htmlFor="pickup-apt" className="block text-sm font-medium text-gray-700 mb-2">
                          Apt/Unit #
                        </label>
                        <input
                          type="text"
                          id="pickup-apt"
                          name="pickup-apt"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder="Apt #"
                        />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-3 gap-4 mt-4">
                      <div>
                        <label htmlFor="pickup-city" className="block text-sm font-medium text-gray-700 mb-2">
                          City *
                        </label>
                        <input
                          type="text"
                          id="pickup-city"
                          name="pickup-city"
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder="City"
                        />
                      </div>
                      <div>
                        <label htmlFor="pickup-state" className="block text-sm font-medium text-gray-700 mb-2">
                          State *
                        </label>
                        <input
                          type="text"
                          id="pickup-state"
                          name="pickup-state"
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder="FL"
                        />
                      </div>
                      <div>
                        <label htmlFor="pickup-zip" className="block text-sm font-medium text-gray-700 mb-2">
                          Zip Code *
                        </label>
                        <input
                          type="text"
                          id="pickup-zip"
                          name="pickup-zip"
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder="33101"
                        />
                      </div>
                    </div>
                    <label className="flex items-center mt-3">
                      <input type="checkbox" name="pickup-storage" className="mr-3 w-4 h-4 text-orange-500" />
                      <span className="text-sm text-gray-600">Pick-up is from a storage facility</span>
                    </label>
                  </div>

                  {/* Drop-off Location */}
                  <div>
                    <h4 className="font-medium text-gray-800 mb-3">Drop-off Location</h4>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="md:col-span-2">
                        <label htmlFor="dropoff-address" className="block text-sm font-medium text-gray-700 mb-2">
                          Address *
                        </label>
                        <input
                          type="text"
                          id="dropoff-address"
                          name="dropoff-address"
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder="Street address"
                        />
                      </div>
                      <div>
                        <label htmlFor="dropoff-apt" className="block text-sm font-medium text-gray-700 mb-2">
                          Apt/Unit #
                        </label>
                        <input
                          type="text"
                          id="dropoff-apt"
                          name="dropoff-apt"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder="Apt #"
                        />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-3 gap-4 mt-4">
                      <div>
                        <label htmlFor="dropoff-city" className="block text-sm font-medium text-gray-700 mb-2">
                          City *
                        </label>
                        <input
                          type="text"
                          id="dropoff-city"
                          name="dropoff-city"
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder="City"
                        />
                      </div>
                      <div>
                        <label htmlFor="dropoff-state" className="block text-sm font-medium text-gray-700 mb-2">
                          State *
                        </label>
                        <input
                          type="text"
                          id="dropoff-state"
                          name="dropoff-state"
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder="FL"
                        />
                      </div>
                      <div>
                        <label htmlFor="dropoff-zip" className="block text-sm font-medium text-gray-700 mb-2">
                          Zip Code *
                        </label>
                        <input
                          type="text"
                          id="dropoff-zip"
                          name="dropoff-zip"
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder="33101"
                        />
                      </div>
                    </div>
                    <label className="flex items-center mt-3">
                      <input type="checkbox" name="dropoff-storage" className="mr-3 w-4 h-4 text-orange-500" />
                      <span className="text-sm text-gray-600">Drop-off is to a storage facility</span>
                    </label>
                  </div>
                </div>

                {/* Section 3: Date & Time */}
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-orange-600 border-b border-gray-200 pb-2">
                    3. Moving Date & Time
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="move-date" className="block text-sm font-medium text-gray-700 mb-2">
                        Moving Date *
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
                      <label htmlFor="move-time" className="block text-sm font-medium text-gray-700 mb-2">
                        Preferred Start Time *
                      </label>
                      <select
                        id="move-time"
                        name="move-time"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      >
                        <option value="">Select a time</option>
                        <option value="8-9am">8:00 AM - 9:00 AM</option>
                        <option value="9-10am">9:00 AM - 10:00 AM</option>
                        <option value="10-11am">10:00 AM - 11:00 AM</option>
                        <option value="11-12pm">11:00 AM - 12:00 PM</option>
                        <option value="12-1pm">12:00 PM - 1:00 PM</option>
                        <option value="1-2pm">1:00 PM - 2:00 PM</option>
                        <option value="2-5pm">2:00 PM - 5:00 PM (Afternoon)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Section 4: Move Size */}
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-orange-600 border-b border-gray-200 pb-2">
                    4. Move Size
                  </h3>
                  <div>
                    <label htmlFor="move-size" className="block text-sm font-medium text-gray-700 mb-2">
                      Select Your Move Size *
                    </label>
                    <select
                      id="move-size"
                      name="move-size"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option value="">Select move size</option>
                      <option value="studio">Studio</option>
                      <option value="1br-small">1 Bedroom (Small)</option>
                      <option value="1br-average">1 Bedroom (Average)</option>
                      <option value="1br-large">1 Bedroom (Large)</option>
                      <option value="2br-small">2 Bedroom (Small)</option>
                      <option value="2br-average">2 Bedroom (Average)</option>
                      <option value="2br-large">2 Bedroom (Large)</option>
                      <option value="3br-average">3 Bedroom (Average)</option>
                      <option value="3br-large">3 Bedroom (Large)</option>
                      <option value="4br-average">4 Bedroom (Average)</option>
                      <option value="4br-large">4 Bedroom (Large)</option>
                      <option value="5br-plus">5+ Bedroom</option>
                      <option value="commercial-small">Commercial (Small Office)</option>
                      <option value="commercial-average">Commercial (Average Office)</option>
                      <option value="commercial-large">Commercial (Large Office)</option>
                    </select>
                  </div>
                </div>

                {/* Section 5: Additional Services */}
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-orange-600 border-b border-gray-200 pb-2">
                    5. Additional Services
                  </h3>

                  <div className="space-y-6">
                    {/* Packing Service */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Do you need packing services?
                      </label>
                      <div className="grid md:grid-cols-3 gap-4">
                        <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:border-orange-500">
                          <input type="radio" name="packing" value="no" className="mr-3" defaultChecked />
                          <span>No packing needed</span>
                        </label>
                        <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:border-orange-500">
                          <input type="radio" name="packing" value="partial" className="mr-3" />
                          <span>Partial packing</span>
                        </label>
                        <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:border-orange-500">
                          <input type="radio" name="packing" value="full" className="mr-3" />
                          <span>Full packing service</span>
                        </label>
                      </div>
                    </div>

                    {/* Additional Services Checkboxes */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select any additional services needed:
                      </label>
                      <div className="grid md:grid-cols-2 gap-4">
                        <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-orange-500">
                          <input type="checkbox" name="service-unpacking" className="mr-3 w-4 h-4 text-orange-500" />
                          <span>Unpacking Services</span>
                        </label>
                        <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-orange-500">
                          <input type="checkbox" name="service-furniture" className="mr-3 w-4 h-4 text-orange-500" />
                          <span>Furniture Disassembly/Assembly</span>
                        </label>
                        <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-orange-500">
                          <input type="checkbox" name="service-piano" className="mr-3 w-4 h-4 text-orange-500" />
                          <span>Piano Moving</span>
                        </label>
                        <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-orange-500">
                          <input type="checkbox" name="service-storage" className="mr-3 w-4 h-4 text-orange-500" />
                          <span>Storage Services</span>
                        </label>
                        <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-orange-500">
                          <input type="checkbox" name="service-specialty" className="mr-3 w-4 h-4 text-orange-500" />
                          <span>Specialty Items (Art, Antiques)</span>
                        </label>
                        <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-orange-500">
                          <input type="checkbox" name="service-cleaning" className="mr-3 w-4 h-4 text-orange-500" />
                          <span>Cleaning Services</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 6: Additional Information */}
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-orange-600 border-b border-gray-200 pb-2">
                    6. Additional Information
                  </h3>

                  <div className="space-y-6">
                    <div>
                      <label htmlFor="special-items" className="block text-sm font-medium text-gray-700 mb-2">
                        Special Items or Concerns
                      </label>
                      <textarea
                        id="special-items"
                        name="special-items"
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Please list any fragile items, heavy furniture, stairs, elevators, parking restrictions, or any other special requirements..."
                      />
                    </div>

                    <div>
                      <label htmlFor="hear-about" className="block text-sm font-medium text-gray-700 mb-2">
                        How did you hear about us?
                      </label>
                      <select
                        id="hear-about"
                        name="hear-about"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      >
                        <option value="">Select an option</option>
                        <option value="google">Google Search</option>
                        <option value="yelp">Yelp</option>
                        <option value="facebook">Facebook</option>
                        <option value="instagram">Instagram</option>
                        <option value="referral">Friend/Family Referral</option>
                        <option value="previous">Previous Customer</option>
                        <option value="bbb">BBB</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="text-center pt-6 border-t border-gray-200">
                  <p className="text-sm text-gray-500 mb-4">
                    By submitting this form, you agree to receive SMS and email notifications about your move.
                  </p>
                  <button
                    type="submit"
                    className="bg-orange-500 hover:bg-orange-600 text-white px-12 py-4 rounded-lg font-semibold text-lg transition-colors"
                  >
                    Book My Move
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
