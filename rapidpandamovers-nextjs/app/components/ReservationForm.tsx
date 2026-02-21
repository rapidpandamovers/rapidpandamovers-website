'use client';

import { useState, useRef, FormEvent } from 'react';
import { useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useMessages } from 'next-intl';
import { H3 } from '@/app/components/Heading';
import TurnstileWidget, { TurnstileWidgetRef } from '@/app/components/TurnstileWidget';

// Map size query param to select option value
const sizeMap: Record<string, string> = {
  '1_bedroom': '1br-average',
  '2_bedroom': '2br-average',
  '3_bedroom': '3br-average',
  '4_bedroom': '4br-average',
  '4plus_bedroom': '5br-plus',
};

export default function ReservationForm() {
  const { content, ui } = useMessages() as any
  const phone = content.site.phone;
  const phoneFormatted = `(${phone.slice(0,3)}) ${phone.slice(4,7)}-${phone.slice(8)}`;
  const searchParams = useSearchParams();
  const originCity = searchParams.get('originCity') || '';
  const originZip = searchParams.get('originZip') || '';
  const destinationCity = searchParams.get('destinationCity') || '';
  const destinationZip = searchParams.get('destinationZip') || '';
  const sizeParam = searchParams.get('size') || '';
  const moveSize = sizeMap[sizeParam] || '';

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [turnstileToken, setTurnstileToken] = useState('');
  const turnstileRef = useRef<TurnstileWidgetRef>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    const formData = new FormData(e.currentTarget);

    // Collect additional services
    const additionalServices: string[] = [];
    const serviceKeys = ['unpacking', 'furniture', 'piano', 'storage', 'specialty', 'cleaning'];
    const serviceLabels = ui.forms.reservation.additionalServiceOptions as string[];
    serviceKeys.forEach((service, index) => {
      if (formData.get(`service-${service}`)) {
        additionalServices.push(serviceLabels[index]);
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
      turnstileToken,
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
      setTurnstileToken('');
      turnstileRef.current?.reset();
    }
  };

  if (submitStatus === 'success') {
    return (
      <div className="text-center pb-6">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <H3 className="text-2xl font-bold text-gray-800 mb-4">{ui.forms.reservation.successTitle}</H3>
        <p className="text-gray-600 text-lg mb-6">
          {ui.forms.reservation.successDescription}
        </p>
        <a href="/" className="inline-block bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors">
          {ui.forms.reservation.returnHome}
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Section 1: Personal Details */}
      <div className="bg-white rounded-2xl p-6 md:p-8">
        <H3 className="text-xl font-bold mb-6 text-gray-800">
          {ui.forms.reservation.sections.personal}
        </H3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              {ui.forms.reservation.labels.fullName}
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder={ui.forms.reservation.placeholders.fullName}
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              {ui.forms.reservation.labels.email}
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder={ui.forms.reservation.placeholders.email}
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              {ui.forms.reservation.labels.phone}
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder={ui.forms.reservation.placeholders.phone}
            />
          </div>
          <div>
            <label htmlFor="reference" className="block text-sm font-medium text-gray-700 mb-2">
              {ui.forms.reservation.labels.referenceNumber}
            </label>
            <input
              type="text"
              id="reference"
              name="reference"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder={ui.forms.reservation.placeholders.reference}
            />
          </div>
        </div>
      </div>

      {/* Section 2: Moving Locations */}
      <div className="bg-white rounded-2xl p-6 md:p-8">
        <H3 className="text-xl font-bold mb-6 text-gray-800">
          {ui.forms.reservation.sections.locations}
        </H3>

        {/* Pick-up Location */}
        <div className="mb-6">
          <h4 className="font-medium text-gray-800 mb-3">{ui.forms.reservation.labels.pickupLocation}</h4>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label htmlFor="pickup-address" className="block text-sm font-medium text-gray-700 mb-2">
                {ui.forms.reservation.labels.address}
              </label>
              <input
                type="text"
                id="pickup-address"
                name="pickup-address"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder={ui.forms.reservation.placeholders.address}
              />
            </div>
            <div>
              <label htmlFor="pickup-apt" className="block text-sm font-medium text-gray-700 mb-2">
                {ui.forms.reservation.labels.aptUnit}
              </label>
              <input
                type="text"
                id="pickup-apt"
                name="pickup-apt"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder={ui.forms.reservation.placeholders.apt}
              />
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-4 mt-4">
            <div>
              <label htmlFor="pickup-city" className="block text-sm font-medium text-gray-700 mb-2">
                {ui.forms.reservation.labels.city}
              </label>
              <input
                type="text"
                id="pickup-city"
                name="pickup-city"
                required
                defaultValue={originCity}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder={ui.forms.reservation.placeholders.city}
              />
            </div>
            <div>
              <label htmlFor="pickup-state" className="block text-sm font-medium text-gray-700 mb-2">
                {ui.forms.reservation.labels.state}
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
                {ui.forms.reservation.labels.zipCode}
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
            <span className="text-sm text-gray-600">{ui.forms.reservation.labels.pickupStorage}</span>
          </label>
        </div>

        {/* Drop-off Location */}
        <div>
          <h4 className="font-medium text-gray-800 mb-3">{ui.forms.reservation.labels.dropoffLocation}</h4>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label htmlFor="dropoff-address" className="block text-sm font-medium text-gray-700 mb-2">
                {ui.forms.reservation.labels.address}
              </label>
              <input
                type="text"
                id="dropoff-address"
                name="dropoff-address"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder={ui.forms.reservation.placeholders.address}
              />
            </div>
            <div>
              <label htmlFor="dropoff-apt" className="block text-sm font-medium text-gray-700 mb-2">
                {ui.forms.reservation.labels.aptUnit}
              </label>
              <input
                type="text"
                id="dropoff-apt"
                name="dropoff-apt"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder={ui.forms.reservation.placeholders.apt}
              />
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-4 mt-4">
            <div>
              <label htmlFor="dropoff-city" className="block text-sm font-medium text-gray-700 mb-2">
                {ui.forms.reservation.labels.city}
              </label>
              <input
                type="text"
                id="dropoff-city"
                name="dropoff-city"
                required
                defaultValue={destinationCity}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder={ui.forms.reservation.placeholders.city}
              />
            </div>
            <div>
              <label htmlFor="dropoff-state" className="block text-sm font-medium text-gray-700 mb-2">
                {ui.forms.reservation.labels.state}
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
                {ui.forms.reservation.labels.zipCode}
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
            <span className="text-sm text-gray-600">{ui.forms.reservation.labels.dropoffStorage}</span>
          </label>
        </div>
      </div>

      {/* Section 3: Date & Time */}
      <div className="bg-white rounded-2xl p-6 md:p-8">
        <H3 className="text-xl font-bold mb-6 text-gray-800">
          {ui.forms.reservation.sections.dateTime}
        </H3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="move-date" className="block text-sm font-medium text-gray-700 mb-2">
              {ui.forms.reservation.labels.movingDate}
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
              {ui.forms.reservation.labels.startTime}
            </label>
            <select
              id="move-time"
              name="move-time"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="">{ui.forms.reservation.timeSlots.select}</option>
              <option value={ui.forms.reservation.timeSlots.morning1}>{ui.forms.reservation.timeSlots.morning1}</option>
              <option value={ui.forms.reservation.timeSlots.morning2}>{ui.forms.reservation.timeSlots.morning2}</option>
              <option value={ui.forms.reservation.timeSlots.morning3}>{ui.forms.reservation.timeSlots.morning3}</option>
              <option value={ui.forms.reservation.timeSlots.midday1}>{ui.forms.reservation.timeSlots.midday1}</option>
              <option value={ui.forms.reservation.timeSlots.midday2}>{ui.forms.reservation.timeSlots.midday2}</option>
              <option value={ui.forms.reservation.timeSlots.afternoon1}>{ui.forms.reservation.timeSlots.afternoon1}</option>
              <option value={ui.forms.reservation.timeSlots.afternoon2}>{ui.forms.reservation.timeSlots.afternoon2}</option>
              <option value={ui.forms.reservation.timeSlots.afternoon3}>{ui.forms.reservation.timeSlots.afternoon3}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Section 4: Move Size */}
      <div className="bg-white rounded-2xl p-6 md:p-8">
        <H3 className="text-xl font-bold mb-6 text-gray-800">
          {ui.forms.reservation.sections.moveSize}
        </H3>
        <div>
          <label htmlFor="move-size" className="block text-sm font-medium text-gray-700 mb-2">
            {ui.forms.reservation.labels.moveSize}
          </label>
          <select
            id="move-size"
            name="move-size"
            required
            defaultValue={moveSize}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="">{ui.forms.reservation.moveSizes.select}</option>
            <option value={ui.forms.reservation.moveSizes.studio}>{ui.forms.reservation.moveSizes.studio}</option>
            <option value={ui.forms.reservation.moveSizes.oneBedSmall}>{ui.forms.reservation.moveSizes.oneBedSmall}</option>
            <option value={ui.forms.reservation.moveSizes.oneBedLarge}>{ui.forms.reservation.moveSizes.oneBedLarge}</option>
            <option value={ui.forms.reservation.moveSizes.twoBed}>{ui.forms.reservation.moveSizes.twoBed}</option>
            <option value={ui.forms.reservation.moveSizes.threeBed}>{ui.forms.reservation.moveSizes.threeBed}</option>
            <option value={ui.forms.reservation.moveSizes.fourBed}>{ui.forms.reservation.moveSizes.fourBed}</option>
            <option value={ui.forms.reservation.moveSizes.fourPlusBed}>{ui.forms.reservation.moveSizes.fourPlusBed}</option>
            <option value={ui.forms.reservation.moveSizes.office}>{ui.forms.reservation.moveSizes.office}</option>
            <option value={ui.forms.reservation.moveSizes.other}>{ui.forms.reservation.moveSizes.other}</option>
          </select>
        </div>
      </div>

      {/* Section 5: Additional Services */}
      <div className="bg-white rounded-2xl p-6 md:p-8">
        <H3 className="text-xl font-bold mb-6 text-gray-800">
          {ui.forms.reservation.sections.additional}
        </H3>

        <div className="space-y-6">
          {/* Packing Service */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {ui.forms.reservation.labels.packingServices}
            </label>
            <div className="grid md:grid-cols-3 gap-4">
              <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:border-orange-600">
                <input type="radio" name="packing" value={ui.forms.reservation.packingOptions.none} className="mr-3" defaultChecked />
                <span>{ui.forms.reservation.packingOptions.none}</span>
              </label>
              <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:border-orange-600">
                <input type="radio" name="packing" value={ui.forms.reservation.packingOptions.partial} className="mr-3" />
                <span>{ui.forms.reservation.packingOptions.partial}</span>
              </label>
              <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:border-orange-600">
                <input type="radio" name="packing" value={ui.forms.reservation.packingOptions.full} className="mr-3" />
                <span>{ui.forms.reservation.packingOptions.full}</span>
              </label>
            </div>
          </div>

          {/* Additional Services Checkboxes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {ui.forms.reservation.labels.additionalServices}
            </label>
            <div className="grid md:grid-cols-2 gap-4">
              {(['unpacking', 'furniture', 'piano', 'storage', 'specialty', 'cleaning'] as const).map((key, index) => (
                <label key={key} className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-orange-600">
                  <input type="checkbox" name={`service-${key}`} className="mr-3 w-4 h-4 text-orange-500" />
                  <span>{(ui.forms.reservation.additionalServiceOptions as string[])[index]}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Section 6: Additional Information */}
      <div className="bg-white rounded-2xl p-6 md:p-8">
        <H3 className="text-xl font-bold mb-6 text-gray-800">
          {ui.forms.reservation.sections.info}
        </H3>

        <div className="space-y-6">
          <div>
            <label htmlFor="special-items" className="block text-sm font-medium text-gray-700 mb-2">
              {ui.forms.reservation.labels.specialItems}
            </label>
            <textarea
              id="special-items"
              name="special-items"
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder={ui.forms.reservation.placeholders.specialItems}
            />
          </div>

          <div>
            <label htmlFor="hear-about" className="block text-sm font-medium text-gray-700 mb-2">
              {ui.forms.reservation.labels.hearAboutUs}
            </label>
            <select
              id="hear-about"
              name="hear-about"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="">{ui.forms.reservation.referralOptions.select}</option>
              <option value={ui.forms.reservation.referralOptions.google}>{ui.forms.reservation.referralOptions.google}</option>
              <option value={ui.forms.reservation.referralOptions.yelp}>{ui.forms.reservation.referralOptions.yelp}</option>
              <option value={ui.forms.reservation.referralOptions.referral}>{ui.forms.reservation.referralOptions.referral}</option>
              <option value={ui.forms.reservation.referralOptions.social}>{ui.forms.reservation.referralOptions.social}</option>
              <option value={ui.forms.reservation.referralOptions.repeat}>{ui.forms.reservation.referralOptions.repeat}</option>
              <option value={ui.forms.reservation.referralOptions.bbb}>{ui.forms.reservation.referralOptions.bbb}</option>
              <option value={ui.forms.reservation.referralOptions.other}>{ui.forms.reservation.referralOptions.other}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {submitStatus === 'error' && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm">
          {(ui.forms.reservation.errorMessage as string).replace('{phone}', phoneFormatted)}
        </div>
      )}

      {/* Submit Button */}
      <div className="bg-white rounded-2xl p-6 md:p-8 text-center">
        <p className="text-sm text-gray-500 mb-4">
          {ui.forms.reservation.disclaimer}
        </p>

        <TurnstileWidget
          ref={turnstileRef}
          onVerify={setTurnstileToken}
          onExpire={() => setTurnstileToken('')}
        />

        <button
          type="submit"
          disabled={isSubmitting || !turnstileToken}
          className="mt-4 bg-orange-600 hover:bg-orange-700 text-white px-12 py-4 rounded-lg font-semibold text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              {ui.forms.reservation.submitting}
            </>
          ) : (
            ui.forms.reservation.submitButton
          )}
        </button>
      </div>
    </form>
  );
}
