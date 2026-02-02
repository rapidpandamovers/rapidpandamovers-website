'use client';

import { useState, FormEvent } from 'react';
import { useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';

// Map size query param to select option value
const sizeMap: Record<string, string> = {
  '1_bedroom': '1br-average',
  '2_bedroom': '2br-average',
  '3_bedroom': '3br-average',
  '4_bedroom': '4br-average',
  '4plus_bedroom': '5br-plus',
};

export default function ReservationForm() {
  const searchParams = useSearchParams();
  const originCity = searchParams.get('originCity') || '';
  const originZip = searchParams.get('originZip') || '';
  const destinationCity = searchParams.get('destinationCity') || '';
  const destinationZip = searchParams.get('destinationZip') || '';
  const sizeParam = searchParams.get('size') || '';
  const moveSize = sizeMap[sizeParam] || '';

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    const formData = new FormData(e.currentTarget);

    // Collect additional services
    const additionalServices: string[] = [];
    const serviceOptions = ['unpacking', 'furniture', 'piano', 'storage', 'specialty', 'cleaning'];
    serviceOptions.forEach(service => {
      if (formData.get(`service-${service}`)) {
        const labels: Record<string, string> = {
          'unpacking': 'Unpacking Services',
          'furniture': 'Furniture Disassembly/Assembly',
          'piano': 'Piano Moving',
          'storage': 'Storage Services',
          'specialty': 'Specialty Items',
          'cleaning': 'Cleaning Services',
        };
        additionalServices.push(labels[service]);
      }
    });

    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      reference: formData.get('reference'),
      pickupAddress: formData.get('pickup-address'),
      pickupApt: formData.get('pickup-apt'),
      pickupCity: formData.get('pickup-city'),
      pickupState: formData.get('pickup-state'),
      pickupZip: formData.get('pickup-zip'),
      pickupStorage: formData.get('pickup-storage') === 'on',
      dropoffAddress: formData.get('dropoff-address'),
      dropoffApt: formData.get('dropoff-apt'),
      dropoffCity: formData.get('dropoff-city'),
      dropoffState: formData.get('dropoff-state'),
      dropoffZip: formData.get('dropoff-zip'),
      dropoffStorage: formData.get('dropoff-storage') === 'on',
      moveDate: formData.get('move-date'),
      moveTime: formData.get('move-time'),
      moveSize: formData.get('move-size'),
      packing: formData.get('packing'),
      additionalServices,
      specialItems: formData.get('special-items'),
      hearAbout: formData.get('hear-about'),
    };

    try {
      const response = await fetch('/api/reservation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setSubmitStatus('success');
      } else {
        setSubmitStatus('error');
      }
    } catch {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitStatus === 'success') {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Reservation Request Submitted!</h3>
        <p className="text-gray-600 text-lg mb-6">
          Thank you for choosing Rapid Panda Movers. We'll contact you within 24 hours to confirm your booking.
        </p>
        <a href="/" className="inline-block bg-orange-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors">
          Return Home
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
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
                defaultValue={originCity}
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
                defaultValue="FL"
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
                defaultValue={originZip}
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
                defaultValue={destinationCity}
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
                defaultValue="FL"
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
                defaultValue={destinationZip}
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
              <option value="8:00 AM - 9:00 AM">8:00 AM - 9:00 AM</option>
              <option value="9:00 AM - 10:00 AM">9:00 AM - 10:00 AM</option>
              <option value="10:00 AM - 11:00 AM">10:00 AM - 11:00 AM</option>
              <option value="11:00 AM - 12:00 PM">11:00 AM - 12:00 PM</option>
              <option value="12:00 PM - 1:00 PM">12:00 PM - 1:00 PM</option>
              <option value="1:00 PM - 2:00 PM">1:00 PM - 2:00 PM</option>
              <option value="2:00 PM - 5:00 PM">2:00 PM - 5:00 PM (Afternoon)</option>
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
            defaultValue={moveSize}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="">Select move size</option>
            <option value="Studio">Studio</option>
            <option value="1 Bedroom (Small)">1 Bedroom (Small)</option>
            <option value="1 Bedroom (Average)">1 Bedroom (Average)</option>
            <option value="1 Bedroom (Large)">1 Bedroom (Large)</option>
            <option value="2 Bedroom (Small)">2 Bedroom (Small)</option>
            <option value="2 Bedroom (Average)">2 Bedroom (Average)</option>
            <option value="2 Bedroom (Large)">2 Bedroom (Large)</option>
            <option value="3 Bedroom (Average)">3 Bedroom (Average)</option>
            <option value="3 Bedroom (Large)">3 Bedroom (Large)</option>
            <option value="4 Bedroom (Average)">4 Bedroom (Average)</option>
            <option value="4 Bedroom (Large)">4 Bedroom (Large)</option>
            <option value="5+ Bedroom">5+ Bedroom</option>
            <option value="Commercial (Small Office)">Commercial (Small Office)</option>
            <option value="Commercial (Average Office)">Commercial (Average Office)</option>
            <option value="Commercial (Large Office)">Commercial (Large Office)</option>
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
                <input type="radio" name="packing" value="No packing needed" className="mr-3" defaultChecked />
                <span>No packing needed</span>
              </label>
              <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:border-orange-500">
                <input type="radio" name="packing" value="Partial packing" className="mr-3" />
                <span>Partial packing</span>
              </label>
              <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:border-orange-500">
                <input type="radio" name="packing" value="Full packing service" className="mr-3" />
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
              <option value="Google Search">Google Search</option>
              <option value="Yelp">Yelp</option>
              <option value="Facebook">Facebook</option>
              <option value="Instagram">Instagram</option>
              <option value="Friend/Family Referral">Friend/Family Referral</option>
              <option value="Previous Customer">Previous Customer</option>
              <option value="BBB">BBB</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {submitStatus === 'error' && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm">
          Something went wrong. Please try again or call us directly at (786) 585-4269.
        </div>
      )}

      {/* Submit Button */}
      <div className="text-center pt-6 border-t border-gray-200">
        <p className="text-sm text-gray-500 mb-4">
          By submitting this form, you agree to receive SMS and email notifications about your move.
        </p>
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-orange-500 hover:bg-orange-600 text-white px-12 py-4 rounded-lg font-semibold text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Submitting...
            </>
          ) : (
            'Book My Move'
          )}
        </button>
      </div>
    </form>
  );
}
