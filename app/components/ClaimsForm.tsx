'use client';

import { useState, useRef, FormEvent } from 'react';
import { Loader2 } from 'lucide-react';
import { useMessages } from 'next-intl';
import { H3 } from '@/app/components/Heading';
import TurnstileWidget, { TurnstileWidgetRef } from '@/app/components/TurnstileWidget';

export default function ClaimsForm() {
  const { content, ui } = useMessages() as any;
  const phone = content.site.phone;
  const phoneFormatted = `(${phone.slice(0,3)}) ${phone.slice(4,7)}-${phone.slice(8)}`;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [turnstileToken, setTurnstileToken] = useState('');
  const turnstileRef = useRef<TurnstileWidgetRef>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    const formData = new FormData(e.currentTarget);

    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      reference: formData.get('reference'),
      description: formData.get('description'),
      turnstileToken,
    };

    try {
      const response = await fetch('/api/claims', {
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
        <H3 className="text-2xl font-bold text-gray-800 mb-4">{ui.forms.claims.successTitle}</H3>
        <p className="text-gray-600 text-lg mb-6">
          {ui.forms.claims.successDescription}
        </p>
        <a href="/" className="inline-block bg-orange-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-800 transition-colors">
          {ui.forms.claims.returnHome}
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Section 1: Contact Information */}
      <div className="bg-white rounded-2xl p-6 md:p-8">
        <H3 className="text-xl font-bold mb-6 text-gray-800">
          {ui.forms.claims.sections.contact}
        </H3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              {ui.forms.claims.labels.fullName}
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder={ui.forms.claims.placeholders.fullName}
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              {ui.forms.claims.labels.email}
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder={ui.forms.claims.placeholders.email}
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              {ui.forms.claims.labels.phone}
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder={ui.forms.claims.placeholders.phone}
            />
          </div>
          <div>
            <label htmlFor="reference" className="block text-sm font-medium text-gray-700 mb-2">
              {ui.forms.claims.labels.reference}
            </label>
            <input
              type="text"
              id="reference"
              name="reference"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder={ui.forms.claims.placeholders.reference}
            />
          </div>
        </div>
      </div>

      {/* Section 2: Claim Details */}
      <div className="bg-white rounded-2xl p-6 md:p-8">
        <H3 className="text-xl font-bold mb-6 text-gray-800">
          {ui.forms.claims.sections.details}
        </H3>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            {ui.forms.claims.labels.description}
          </label>
          <textarea
            id="description"
            name="description"
            required
            rows={6}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder={ui.forms.claims.placeholders.description}
          />
        </div>
      </div>

      {/* Error Message */}
      {submitStatus === 'error' && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm">
          {(ui.forms.claims.errorMessage as string).replace('{phone}', phoneFormatted)}
        </div>
      )}

      {/* Submit Button */}
      <div className="bg-white rounded-2xl p-6 md:p-8 text-center">
        <button
          type="submit"
          disabled={isSubmitting || !turnstileToken}
          className="mt-4 bg-orange-700 hover:bg-orange-800 text-white px-12 py-4 rounded-lg font-semibold text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              {ui.forms.claims.submitting}
            </>
          ) : (
            ui.forms.claims.submit
          )}
        </button>

        <TurnstileWidget
          ref={turnstileRef}
          onVerify={setTurnstileToken}
          onExpire={() => setTurnstileToken('')}
        />
      </div>
    </form>
  );
}
