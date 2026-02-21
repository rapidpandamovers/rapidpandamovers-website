'use client'

import { useState, useRef, FormEvent } from 'react'
import { Mail, Phone, MapPin, Loader2 } from 'lucide-react'
import { useMessages } from 'next-intl'
import { H2, H3 } from '@/app/components/Heading'
import TurnstileWidget, { TurnstileWidgetRef } from '@/app/components/TurnstileWidget'

interface QuoteFormProps {
  initialPickupZip?: string
  initialDropoffZip?: string
}

export default function QuoteForm({
  initialPickupZip = '',
  initialDropoffZip = ''
}: QuoteFormProps) {
  const { content, ui } = useMessages() as any
  const [movingFrom, setMovingFrom] = useState(initialPickupZip)
  const [movingTo, setMovingTo] = useState(initialDropoffZip)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [turnstileToken, setTurnstileToken] = useState('')
  const turnstileRef = useRef<TurnstileWidgetRef>(null)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    const formData = new FormData(e.currentTarget)
    const services: string[] = []
    const serviceOptions = ui.forms.quote.serviceOptions
    serviceOptions.forEach((service: string) => {
      if (formData.get(`service-${service}`)) {
        services.push(service)
      }
    })

    const data = {
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      movingFrom,
      movingTo,
      moveDate: formData.get('moveDate'),
      homeSize: formData.get('homeSize'),
      services,
      details: formData.get('details'),
      turnstileToken,
    }

    try {
      const response = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        setSubmitStatus('success')
      } else {
        setSubmitStatus('error')
      }
    } catch {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
      setTurnstileToken('')
      turnstileRef.current?.reset()
    }
  }

  const successContent = (
    <div className="text-center py-12">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <H3 className="text-xl font-bold text-gray-800 mb-2">{ui.forms.quote.successTitle}</H3>
      <p className="text-gray-600 mb-6">{ui.forms.quote.successDescription}</p>
      <a href="/" className="inline-block bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors">
        {ui.forms.quote.returnHome}
      </a>
    </div>
  )

  const formContent = (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {ui.forms.quote.labels.firstName}
          </label>
          <input
            type="text"
            name="firstName"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {ui.forms.quote.labels.lastName}
          </label>
          <input
            type="text"
            name="lastName"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {ui.forms.quote.labels.email}
          </label>
          <input
            type="email"
            name="email"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {ui.forms.quote.labels.phone}
          </label>
          <input
            type="tel"
            name="phone"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {ui.forms.quote.labels.movingFrom}
          </label>
          <input
            type="text"
            placeholder={ui.forms.quote.placeholders.address}
            required
            value={movingFrom}
            onChange={(e) => setMovingFrom(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {ui.forms.quote.labels.movingTo}
          </label>
          <input
            type="text"
            placeholder={ui.forms.quote.placeholders.address}
            required
            value={movingTo}
            onChange={(e) => setMovingTo(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {ui.forms.quote.labels.movingDate}
          </label>
          <input
            type="date"
            name="moveDate"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {ui.forms.quote.labels.homeSize}
          </label>
          <select
            name="homeSize"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="">{ui.forms.quote.homeSizes.select}</option>
            <option value="Studio Apartment">{ui.forms.quote.homeSizes.studio}</option>
            <option value="1 Bedroom">{ui.forms.quote.homeSizes.oneBed}</option>
            <option value="2 Bedroom">{ui.forms.quote.homeSizes.twoBed}</option>
            <option value="3 Bedroom">{ui.forms.quote.homeSizes.threeBed}</option>
            <option value="4+ Bedroom">{ui.forms.quote.homeSizes.fourPlusBed}</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {ui.forms.quote.labels.servicesNeeded}
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {(ui.forms.quote.serviceOptions as string[]).map((service: string) => (
            <label key={service} className="flex items-center">
              <input type="checkbox" name={`service-${service}`} className="mr-2" />
              <span className="text-sm">{service}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {ui.forms.quote.labels.additionalDetails}
        </label>
        <textarea
          name="details"
          rows={4}
          placeholder={ui.forms.quote.placeholders.details}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        ></textarea>
      </div>

      {submitStatus === 'error' && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm">
          {ui.forms.quote.errorMessage}
        </div>
      )}

      <TurnstileWidget
        ref={turnstileRef}
        onVerify={setTurnstileToken}
        onExpire={() => setTurnstileToken('')}
      />

      <button
        type="submit"
        disabled={isSubmitting || !turnstileToken}
        className="w-full bg-orange-600 text-white font-bold py-4 text-lg rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            {ui.forms.quote.submitting}
          </>
        ) : (
          ui.forms.quote.submitButton
        )}
      </button>
    </form>
  )

  const sidebar = (
    <div className="lg:w-80 bg-white p-6 rounded-2xl">
      <H3 className="text-xl font-bold mb-4">{ui.forms.quote.contactTitle}</H3>
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <Phone className="w-5 h-5 text-orange-500 flex-shrink-0" />
          <div>
            <p className="font-medium">{content.site.phone}</p>
            <p className="text-sm text-gray-600">{content.contact.contact_info.hours}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Mail className="w-5 h-5 text-orange-500 flex-shrink-0" />
          <div>
            <p className="font-medium">{content.site.email}</p>
            <p className="text-sm text-gray-600">{ui.forms.quote.emailSupport}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <MapPin className="w-5 h-5 text-orange-500 flex-shrink-0" />
          <div>
            <p className="font-medium">{ui.forms.quote.locationCity}</p>
            <p className="text-sm text-gray-600">{ui.forms.quote.locationArea}</p>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-orange-600 text-white rounded-lg p-6">
        <H3 className="text-xl font-bold mb-4">{ui.forms.quote.whyChooseTitle}</H3>
        <ul className="space-y-2 text-sm">
          {(ui.forms.quote.whyChooseItems as string[]).map((item: string, index: number) => (
            <li key={index} className="flex items-start">
              <span className="inline-block w-2 h-2 bg-white rounded-full mr-3 mt-2"></span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="flex-1 bg-white rounded-2xl p-6 md:p-8">
        {submitStatus === 'success' ? successContent : formContent}
      </div>
      {sidebar}
    </div>
  )
}
