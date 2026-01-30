'use client'

import Link from 'next/link'
import { Star } from 'lucide-react'
import { useState } from 'react'
import QuoteModal from './QuoteModal'

interface HeroProps {
  title?: string
  description?: string
  cta?: string
  image_url?: string
}

export default function Hero({ 
  title, 
  description, 
  cta, 
  image_url
}: HeroProps = {}) {
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false)
  
  // Use provided props with fallback defaults
  const displayTitle = title || "Family-Owned Moving Company in Miami"
  const displayDescription = description || "Low-cost moving & packing services"
  const displayCta = cta || "Get a free quote"
  const displayImage = image_url || "https://www.rapidpandamovers.com/wp-content/uploads/2024/11/about-us-rapid-panda.png"
  return (
    <section className="py-5 px-4 md:px-6 lg:px-8">
      <div className="container mx-auto rounded-4xl border border-gray-700 bg-black p-6 md:p-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left side - Image */}
          <div className="relative">
            <img 
              src={displayImage} 
              alt="Professional movers with moving boxes" 
              className="w-full h-auto object-contain rounded-lg"
            />
          </div>
          
          {/* Right side - Content */}
          <div className="space-y-6">
            <div>
              <h1 className="font-display text-4xl md:text-5xl text-white mb-4 font-black tracking-tight">
                {displayTitle}
              </h1>
              <p className="text-xl text-white mb-8">
                {displayDescription}
              </p>
            </div>
            
            {/* Quote form */}
            <div className="space-y-4">
              <p className="text-white font-medium">{displayCta}</p>
              <div className="grid grid-cols-2 gap-4">
                <input 
                  type="text" 
                  placeholder="Enter Pick up Zip" 
                  className="px-4 py-3 bg-gray-800 border border-gray-600 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <input 
                  type="text" 
                  placeholder="Enter Drop off Zip" 
                  className="px-4 py-3 bg-gray-800 border border-gray-600 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <button 
                onClick={() => setIsQuoteModalOpen(true)}
                className="w-full bg-orange-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-orange-600 transition-colors"
              >
                Get Free Quote
              </button>
            </div>
            
            {/* Rating display */}
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-orange-500 fill-current" />
                ))}
              </div>
              <span className="text-white">4,9/5 Based on 9,568+ verified reviews</span>
            </div>
          </div>
        </div>

      </div>
      
      {/* Quote Modal */}
      <QuoteModal 
        isOpen={isQuoteModalOpen} 
        onClose={() => setIsQuoteModalOpen(false)} 
      />
    </section>
  )
}