'use client'

import { useRef, useEffect, useState, useCallback, forwardRef, useImperativeHandle } from 'react'
import Script from 'next/script'
import { useLocale } from 'next-intl'

declare global {
  interface Window {
    turnstile: {
      render: (
        container: HTMLElement,
        options: {
          sitekey: string
          callback: (token: string) => void
          'expired-callback'?: () => void
          language?: string
        }
      ) => string
      remove: (widgetId: string) => void
      reset: (widgetId: string) => void
    }
  }
}

interface TurnstileWidgetProps {
  onVerify: (token: string) => void
  onExpire?: () => void
}

export interface TurnstileWidgetRef {
  reset: () => void
}

const TurnstileWidget = forwardRef<TurnstileWidgetRef, TurnstileWidgetProps>(
  function TurnstileWidget({ onVerify, onExpire }, ref) {
    const containerRef = useRef<HTMLDivElement>(null)
    const widgetIdRef = useRef<string | null>(null)
    const [scriptReady, setScriptReady] = useState(false)
    const [verified, setVerified] = useState(false)
    const locale = useLocale()

    const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

    // If no site key, bypass turnstile entirely
    useEffect(() => {
      if (!siteKey) {
        onVerify('bypass')
        setVerified(true) // eslint-disable-line react-hooks/set-state-in-effect
      }
    }, [siteKey, onVerify])

    const handleVerify = useCallback((token: string) => {
      setVerified(true)
      onVerify(token)
    }, [onVerify])

    const renderWidget = useCallback(() => {
      if (!containerRef.current || !window.turnstile || !siteKey) return
      // Remove existing widget if any
      if (widgetIdRef.current) {
        window.turnstile.remove(widgetIdRef.current)
        widgetIdRef.current = null
      }

      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        callback: handleVerify,
        'expired-callback': onExpire,
        language: locale,
      })
    }, [handleVerify, onExpire, locale, siteKey])

    useEffect(() => {
      if (scriptReady) {
        renderWidget()
      }
      return () => {
        if (widgetIdRef.current && window.turnstile) {
          window.turnstile.remove(widgetIdRef.current)
          widgetIdRef.current = null
        }
      }
    }, [scriptReady, renderWidget])

    useImperativeHandle(ref, () => ({
      reset: () => {
        setVerified(false)
        if (widgetIdRef.current && window.turnstile) {
          window.turnstile.reset(widgetIdRef.current)
        }
      },
    }))

    // Hide when no site key or after auto-pass
    if (!siteKey || verified) {
      return null
    }

    return (
      <>
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
          strategy="afterInteractive"
          onReady={() => setScriptReady(true)}
        />
        <div ref={containerRef} className="min-h-[65px]">
          {!scriptReady && (
            <div className="h-[65px] bg-gray-100 rounded-lg animate-pulse flex items-center justify-center">
              <span className="text-sm text-gray-500">Loading verification...</span>
            </div>
          )}
        </div>
      </>
    )
  }
)

export default TurnstileWidget
