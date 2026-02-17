'use client'

import { useState, useEffect, FormEvent } from 'react'
import { X, Mail, Phone, MapPin, Loader2 } from 'lucide-react'
import content from '@/data/content.json'

interface QuoteFormProps {
  // Modal mode props
  asModal?: boolean
  isOpen?: boolean
  onClose?: () => void
  // Form initial values
  initialPickupZip?: string
  initialDropoffZip?: string
}

export default function QuoteForm({
  asModal = false,
  isOpen = true,
  onClose,
  initialPickupZip = '',
  initialDropoffZip = ''
}: QuoteFormProps) {
  const [movingFrom, setMovingFrom] = useState(initialPickupZip)
  const [movingTo, setMovingTo] = useState(initialDropoffZip)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  // Update fields when initial values change (modal opens with new values)
  useEffect(() => {
    if (asModal && isOpen) {
      setMovingFrom(initialPickupZip)
      setMovingTo(initialDropoffZip)
      setSubmitStatus('idle')
    }
  }, [asModal, isOpen, initialPickupZip, initialDropoffZip])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    const formData = new FormData(e.currentTarget)
    const services: string[] = []
    const serviceOptions = ['Packing', 'Loading/Unloading', 'Transportation', 'Unpacking', 'Furniture Assembly', 'Storage']
    serviceOptions.forEach(service => {
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
    }

    try {
      const response = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        setSubmitStatus('success')
        if (asModal && onClose) {
          setTimeout(() => {
            onClose()
          }, 2000)
        }
      } else {
        setSubmitStatus('error')
      }
    } catch {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Don't render modal if not open
  if (asModal && !isOpen) return null

  const successContent = (
    <div className="text-center py-12">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-2">Quote Request Sent!</h3>
      <p className="text-gray-600 mb-6">We'll get back to you within 24 hours.</p>
      {!asModal && (
        <a href="/" className="inline-block bg-orange-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors">
          Return Home
        </a>
      )}
    </div>
  )

  const formContent = (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            First Name *
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
            Last Name *
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
            Email Address *
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
            Phone Number *
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
            Moving From *
          </label>
          <input
            type="text"
            placeholder="Address or ZIP code"
            required
            value={movingFrom}
            onChange={(e) => setMovingFrom(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Moving To *
          </label>
          <input
            type="text"
            placeholder="Address or ZIP code"
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
            Preferred Moving Date
          </label>
          <input
            type="date"
            name="moveDate"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Home Size
          </label>
          <select
            name="homeSize"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="">Select home size</option>
            <option value="Studio Apartment">Studio Apartment</option>
            <option value="1 Bedroom">1 Bedroom</option>
            <option value="2 Bedroom">2 Bedroom</option>
            <option value="3 Bedroom">3 Bedroom</option>
            <option value="4+ Bedroom">4+ Bedroom</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Services Needed (check all that apply)
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            'Packing',
            'Loading/Unloading',
            'Transportation',
            'Unpacking',
            'Furniture Assembly',
            'Storage'
          ].map((service) => (
            <label key={service} className="flex items-center">
              <input type="checkbox" name={`service-${service}`} className="mr-2" />
              <span className="text-sm">{service}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Additional Details
        </label>
        <textarea
          name="details"
          rows={4}
          placeholder="Tell us about any special requirements, fragile items, or other details..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        ></textarea>
      </div>

      {submitStatus === 'error' && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm">
          Something went wrong. Please try again or call us directly.
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-orange-500 text-white font-bold py-4 text-lg rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Sending...
          </>
        ) : (
          'Get My Free Quote'
        )}
      </button>
    </form>
  )

  const sidebar = (
    <div className="lg:w-80 bg-white p-6 rounded-2xl">
      <h3 className="text-xl font-bold mb-4">Contact Information</h3>
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
            <p className="text-sm text-gray-600">24/7 email support</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <MapPin className="w-5 h-5 text-orange-500 flex-shrink-0" />
          <div>
            <p className="font-medium">Miami, FL</p>
            <p className="text-sm text-gray-600">Serving all of Miami-Dade</p>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-orange-500 text-white rounded-lg p-6">
        <h3 className="text-xl font-bold mb-4">Why Choose Us?</h3>
        <ul className="space-y-2 text-sm">
          <li className="flex items-start">
            <span className="inline-block w-2 h-2 bg-white rounded-full mr-3 mt-2"></span>
            No hidden fees or surprise charges
          </li>
          <li className="flex items-start">
            <span className="inline-block w-2 h-2 bg-white rounded-full mr-3 mt-2"></span>
            Licensed and fully insured
          </li>
          <li className="flex items-start">
            <span className="inline-block w-2 h-2 bg-white rounded-full mr-3 mt-2"></span>
            Professional, experienced team
          </li>
          <li className="flex items-start">
            <span className="inline-block w-2 h-2 bg-white rounded-full mr-3 mt-2"></span>
            Free quotes within 24 hours
          </li>
          <li className="flex items-start">
            <span className="inline-block w-2 h-2 bg-white rounded-full mr-3 mt-2"></span>
            Same-day service available
          </li>
        </ul>
      </div>
    </div>
  )

  // Modal mode
  if (asModal) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex flex-col lg:flex-row">
            <div className="flex-1 p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Get Your Free Moving Quote</h2>
                {onClose && (
                  <button
                    onClick={onClose}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-6 h-6" />
                  </button>
                )}
              </div>
              {submitStatus === 'success' ? successContent : formContent}
            </div>
            {sidebar}
          </div>
        </div>
      </div>
    )
  }

  // Standalone page mode
  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="flex-1 bg-white rounded-2xl p-6 md:p-8">
        {submitStatus === 'success' ? successContent : formContent}
      </div>
      {sidebar}
    </div>
  )
}
