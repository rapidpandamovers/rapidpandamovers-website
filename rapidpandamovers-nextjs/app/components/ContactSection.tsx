'use client'

import { useState, useRef, FormEvent } from 'react'
import { Phone, Mail, MapPin, Clock, Loader2, CheckCircle, ArrowRight } from 'lucide-react'
import { useMessages } from 'next-intl'
import { H3 } from '@/app/components/Heading'
import TurnstileWidget, { TurnstileWidgetRef } from '@/app/components/TurnstileWidget'

interface ContactSectionProps {
  title?: string
  description?: string
  className?: string
  showForm?: boolean
}

export default function ContactSection({
  title: titleProp,
  description: descriptionProp,
  className = "",
  showForm = true
}: ContactSectionProps) {
  const { ui, content } = useMessages() as any
  const title = titleProp ?? ui.contact.getInTouch
  const description = descriptionProp ?? ui.contact.getInTouchDesc
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [turnstileToken, setTurnstileToken] = useState('')
  const turnstileRef = useRef<TurnstileWidgetRef>(null)

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
      turnstileToken,
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
      setTurnstileToken('')
      turnstileRef.current?.reset()
    }
  }

  const contactInfo = [
    {
      icon: Phone,
      title: ui.contact.items.phone.title,
      value: content.site.phone,
      href: `tel:${content.site.phone.replace(/[^0-9]/g, '')}`,
      description: ui.contact.items.phone.description
    },
    {
      icon: Mail,
      title: ui.contact.items.email.title,
      value: content.site.email,
      href: `mailto:${content.site.email}`,
      description: ui.contact.items.email.description
    },
    {
      icon: MapPin,
      title: ui.contact.items.address.title,
      value: content.site.address,
      href: `https://maps.google.com/?q=${encodeURIComponent(content.site.address)}`,
      description: ui.contact.items.address.description
    },
  ]

  return (
    <section className={`pt-20 ${className}`}>
      <div className="container mx-auto">
        <div className={`grid grid-cols-1 ${showForm ? 'md:grid-cols-2' : ''} gap-8`}>
          {/* Contact Info Side */}
          <div className="bg-orange-50 rounded-4xl p-6 md:p-8 flex flex-col">
            <H3 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">{ui.contact.infoTitle}</H3>

            <div className="space-y-6">
              {contactInfo.map((item, index) => {
                const IconComponent = item.icon
                return (
                  <a
                    key={index}
                    href={item.href}
                    target={item.icon === MapPin ? '_blank' : undefined}
                    rel={item.icon === MapPin ? 'noopener noreferrer' : undefined}
                    className="flex items-start group p-4 -m-4 rounded-xl"
                  >
                    <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center mr-4 group-hover:bg-orange-200 transition-colors flex-shrink-0">
                      <IconComponent className="w-6 h-6 text-orange-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-800 mb-1">{item.title}</h4>
                      <p className="text-gray-700 font-medium break-words">{item.value}</p>
                      <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-orange-600 group-hover:translate-x-1 transition-all mt-4 flex-shrink-0" />
                  </a>
                )
              })}
            </div>

            {/* Business Hours */}
            <div className="bg-orange-600 rounded-2xl p-6 mt-6 md:mt-auto pt-6 text-white text-shadow-sm">
              <div className="flex items-center mb-4">
                <Clock className="w-6 h-6 mr-3" />
                <h4 className="text-lg font-semibold">{ui.contact.hoursTitle}</h4>
              </div>
              <div className="space-y-2 text-white/90">
                {content.site.hours.map((entry: { label: string; time: string }, i: number) => (
                  <div key={i} className="flex justify-between">
                    <span>{entry.label}</span>
                    <span className="text-white font-medium">{entry.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form Side */}
          {showForm && (
            <div className="bg-gray-50 rounded-4xl p-6 md:p-8 flex flex-col">
              <H3 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">{ui.forms.contact.title}</H3>

              {submitStatus === 'success' ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-800 mb-2">{ui.messages.contactSuccess.title}</h4>
                  <p className="text-gray-600 mb-6">{ui.messages.contactSuccess.description}</p>
                  <button
                    onClick={() => setSubmitStatus('idle')}
                    className="text-orange-600 hover:text-orange-800 font-medium"
                  >
                    {ui.buttons.sendAnother}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5 flex-1 flex flex-col">
                  <div>
                    <label htmlFor="contact-name" className="block text-sm font-medium text-gray-700 mb-2">
                      {ui.forms.contact.labels.name} <span className="text-red-500">{ui.forms.contact.required}</span>
                    </label>
                    <input
                      type="text"
                      id="contact-name"
                      name="name"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                      placeholder={ui.forms.contact.placeholders.name}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="contact-email" className="block text-sm font-medium text-gray-700 mb-2">
                        {ui.forms.contact.labels.email} <span className="text-red-500">{ui.forms.contact.required}</span>
                      </label>
                      <input
                        type="email"
                        id="contact-email"
                        name="email"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                        placeholder={ui.forms.contact.placeholders.email}
                      />
                    </div>
                    <div>
                      <label htmlFor="contact-phone" className="block text-sm font-medium text-gray-700 mb-2">
                        {ui.forms.contact.labels.phone}
                      </label>
                      <input
                        type="tel"
                        id="contact-phone"
                        name="phone"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                        placeholder={ui.forms.contact.placeholders.phone}
                      />
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col">
                    <label htmlFor="contact-message" className="block text-sm font-medium text-gray-700 mb-2">
                      {ui.forms.contact.labels.message} <span className="text-red-500">{ui.forms.contact.required}</span>
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      required
                      rows={5}
                      className="w-full flex-1 min-h-[120px] px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors resize-none"
                      placeholder={ui.forms.contact.placeholders.message}
                    />
                  </div>

                  {submitStatus === 'error' && (
                    <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
                      {ui.messages.contactError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting || !turnstileToken}
                    className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-orange-300 text-white text-shadow-sm font-semibold py-4 px-6 rounded-lg transition-colors flex items-center justify-center"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        {ui.buttons.sending}
                      </>
                    ) : (
                      ui.buttons.sendMessage
                    )}
                  </button>

                  <TurnstileWidget
                    ref={turnstileRef}
                    onVerify={setTurnstileToken}
                    onExpire={() => setTurnstileToken('')}
                  />
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
