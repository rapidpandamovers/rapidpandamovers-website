'use client'

import { useState, FormEvent } from 'react'
import { Phone, Mail, MapPin, Clock, Loader2, CheckCircle, ArrowRight } from 'lucide-react'
import content from '@/data/content.json'

interface ContactSectionProps {
  title?: string
  description?: string
  className?: string
  showForm?: boolean
}

export default function ContactSection({
  title = "Get In Touch",
  description = "Ready to make your move? Contact us today for a free quote or any questions about our moving services.",
  className = "",
  showForm = true
}: ContactSectionProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      message: formData.get('message'),
    }

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        setSubmitStatus('success')
        e.currentTarget.reset()
      } else {
        setSubmitStatus('error')
      }
    } catch {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const contactInfo = [
    {
      icon: Phone,
      title: 'Phone',
      value: content.site.phone,
      href: `tel:${content.site.phone.replace(/[^0-9]/g, '')}`,
      description: 'Please call for immediate assistance'
    },
    {
      icon: Mail,
      title: 'Email',
      value: content.site.email,
      href: `mailto:${content.site.email}`,
      description: 'We reply within 24 hours'
    },
    {
      icon: MapPin,
      title: 'Address',
      value: content.site.address,
      href: `https://maps.google.com/?q=${encodeURIComponent(content.site.address)}`,
      description: 'Miami, Florida'
    },
  ]

  return (
    <section className={`py-20 ${className}`}>
      <div className="container mx-auto">
        <div className="mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              {title.includes('Touch') ? (
                <>Get In <span className="text-orange-500">Touch</span></>
              ) : (
                title
              )}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {description}
            </p>
          </div>

          <div className={`grid grid-cols-1 ${showForm ? 'lg:grid-cols-2' : ''} gap-12`}>
            {/* Contact Info Side */}
            <div>
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Contact Information</h3>

                <div className="space-y-6">
                  {contactInfo.map((item, index) => {
                    const IconComponent = item.icon
                    return (
                      <a
                        key={index}
                        href={item.href}
                        target={item.icon === MapPin ? '_blank' : undefined}
                        rel={item.icon === MapPin ? 'noopener noreferrer' : undefined}
                        className="flex items-start group hover:bg-orange-50 p-4 -m-4 rounded-xl transition-colors"
                      >
                        <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center mr-4 group-hover:bg-orange-200 transition-colors flex-shrink-0">
                          <IconComponent className="w-6 h-6 text-orange-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-800 mb-1">{item.title}</h4>
                          <p className="text-gray-700 font-medium break-words">{item.value}</p>
                          <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                        </div>
                        <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-orange-500 group-hover:translate-x-1 transition-all mt-4 flex-shrink-0" />
                      </a>
                    )
                  })}
                </div>
              </div>

              {/* Business Hours Card */}
              <div className="bg-orange-500 rounded-2xl shadow-lg p-6 mt-6 text-white">
                <div className="flex items-center mb-4">
                  <Clock className="w-6 h-6 mr-3" />
                  <h4 className="text-lg font-semibold">Business Hours</h4>
                </div>
                <div className="space-y-2 text-orange-100">
                  <div className="flex justify-between">
                    <span>{content.site.hours.weekdayLabel}</span>
                    <span className="text-white font-medium">{content.site.hours.weekdayTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{content.site.hours.weekendLabel}</span>
                    <span className="text-white font-medium">{content.site.hours.weekendTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{content.site.hours.emergencyLabel}</span>
                    <span className="text-white font-medium">{content.site.hours.emergencyTime}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form Side */}
            {showForm && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Send Us a Message</h3>

                {submitStatus === 'success' ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-green-500" />
                    </div>
                    <h4 className="text-xl font-bold text-gray-800 mb-2">Message Sent!</h4>
                    <p className="text-gray-600 mb-6">We'll get back to you within 24 hours.</p>
                    <button
                      onClick={() => setSubmitStatus('idle')}
                      className="text-orange-500 hover:text-orange-600 font-medium"
                    >
                      Send another message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label htmlFor="contact-name" className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="contact-name"
                        name="name"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                        placeholder="John Doe"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="contact-email" className="block text-sm font-medium text-gray-700 mb-2">
                          Email <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          id="contact-email"
                          name="email"
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                          placeholder="john@example.com"
                        />
                      </div>
                      <div>
                        <label htmlFor="contact-phone" className="block text-sm font-medium text-gray-700 mb-2">
                          Phone
                        </label>
                        <input
                          type="tel"
                          id="contact-phone"
                          name="phone"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                          placeholder="(555) 123-4567"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="contact-message" className="block text-sm font-medium text-gray-700 mb-2">
                        Message <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="contact-message"
                        name="message"
                        required
                        rows={5}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors resize-none"
                        placeholder="Tell us about your moving needs..."
                      />
                    </div>

                    {submitStatus === 'error' && (
                      <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
                        Failed to send message. Please try again or call us directly.
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-semibold py-4 px-6 rounded-lg transition-colors flex items-center justify-center"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        'Send Message'
                      )}
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
