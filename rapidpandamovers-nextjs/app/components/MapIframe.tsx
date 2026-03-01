'use client'

import { useState } from 'react'

interface MapIframeProps {
  src: string
  height: string
  loadingText: string
}

export default function MapIframe({ src, height, loadingText }: MapIframeProps) {
  const [isLoaded, setIsLoaded] = useState(false)

  return (
    <div
      className="relative rounded-lg overflow-hidden shadow-lg bg-gray-200"
      style={{ height }}
    >
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-gray-500">{loadingText}</p>
          </div>
        </div>
      )}

      <iframe
        src={src}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        onLoad={() => setIsLoaded(true)}
        className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
      />
    </div>
  )
}
