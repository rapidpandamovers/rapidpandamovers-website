'use client'

import { useState, useRef, FormEvent } from 'react';
import { Mail, Loader2, CheckCircle } from 'lucide-react';
import { useMessages } from 'next-intl';
import { H3 } from '@/app/components/Heading';
import TurnstileWidget, { TurnstileWidgetRef } from '@/app/components/TurnstileWidget';

interface NewsletterSectionProps {
  title?: string;
  description?: string;
  className?: string;
}

export default function NewsletterSection({
  title,
  description,
  className = ""
}: NewsletterSectionProps) {
  const { ui } = useMessages() as any
  const displayTitle = title ?? ui.newsletter.defaultTitle
  const displayDescription = description ?? ui.newsletter.defaultDescription

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [turnstileToken, setTurnstileToken] = useState('')
  const turnstileRef = useRef<TurnstileWidgetRef>(null)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    const form = e.currentTarget
    const formData = new FormData(form)
    const data = {
      email: formData.get('email'),
      turnstileToken,
    }

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        form.reset()
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

  return (
    <section className={`pt-20 ${className}`}>
      <div className="container mx-auto">
        <div className="bg-gray-50 rounded-4xl p-6 md:p-16 text-center mx-auto">
          <H3 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            {displayTitle}
          </H3>
          <p className="text-gray-600 mb-6">
            {displayDescription}
          </p>

          {submitStatus === 'success' ? (
            <div className="flex items-center justify-center gap-3 text-green-600">
              <CheckCircle className="w-5 h-5" />
              <div>
                <p className="font-semibold">{ui.messages.newsletterSuccess.title}</p>
                <p className="text-sm text-gray-600">{ui.messages.newsletterSuccess.description}</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-stretch">
                <div className="flex flex-row gap-3 flex-1 sm:contents">
                  <div className="bg-orange-100 border border-orange-100 rounded-lg flex items-center justify-center flex-shrink-0 px-3">
                    <Mail className="w-6 h-6 text-orange-700" />
                  </div>
                  <input
                    id="newsletter-email"
                    name="email"
                    type="email"
                    required
                    placeholder={ui.forms.newsletter.placeholder}
                    className="flex-1 min-w-0 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting || !turnstileToken}
                  className="bg-orange-700 hover:bg-orange-800 disabled:bg-orange-300 text-white font-semibold px-6 py-3 rounded-lg transition-colors flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    ui.buttons.subscribe
                  )}
                </button>
              </div>

              <div className="mt-4">
                <TurnstileWidget
                  ref={turnstileRef}
                  onVerify={setTurnstileToken}
                  onExpire={() => setTurnstileToken('')}
                />
              </div>

              {submitStatus === 'error' && (
                <p className="mt-3 text-sm text-red-600">{ui.messages.newsletterError}</p>
              )}
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
