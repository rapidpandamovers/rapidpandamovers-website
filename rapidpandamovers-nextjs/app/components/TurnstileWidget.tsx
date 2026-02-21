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
    const locale = useLocale()

    const renderWidget = useCallback(() => {
      if (!containerRef.current || !window.turnstile) return
      // Remove existing widget if any
      if (widgetIdRef.current) {
        window.turnstile.remove(widgetIdRef.current)
        widgetIdRef.current = null
      }

      const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
      if (!siteKey) return

      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        callback: onVerify,
        'expired-callback': onExpire,
        language: locale,
      })
    }, [onVerify, onExpire, locale])

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
        if (widgetIdRef.current && window.turnstile) {
          window.turnstile.reset(widgetIdRef.current)
        }
      },
    }))

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
