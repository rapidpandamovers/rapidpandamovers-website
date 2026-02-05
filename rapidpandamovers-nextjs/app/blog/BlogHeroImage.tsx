'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Calendar, Clock, ImageOff } from 'lucide-react'

interface BlogHeroImageProps {
  featured: string | null | undefined
  title: string
  category: string
  date: string
  readTime: string
}

export default function BlogHeroImage({ featured, title, category, date, readTime }: BlogHeroImageProps) {
  const [imageError, setImageError] = useState(false)
  const hasValidImage = featured && typeof featured === 'string' && featured.startsWith('/')

  if (hasValidImage && !imageError) {
    return (
      <div className="relative mt-6 rounded-2xl overflow-hidden shadow-xl">
        <div className="relative h-[40vh] md:h-[50vh]">
          <Image
            src={featured}
            alt={title}
            fill
            className="object-cover"
            priority
            onError={() => setImageError(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        </div>

        {/* Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
          <span className="inline-block bg-orange-500 text-white text-sm font-medium px-4 py-1.5 rounded-full mb-4">
            {category}
          </span>

          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 leading-tight">
            {title}
          </h1>

          <div className="flex items-center text-gray-300 text-sm gap-4">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              <span>{new Date(date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</span>
            </div>
            <span>•</span>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              <span>{readTime}</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Fallback: No image or image failed to load
  return (
    <div className="mt-6">
      <span className="inline-block bg-orange-500 text-white text-sm font-medium px-4 py-1.5 rounded-full mb-4">
        {category}
      </span>
      <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 leading-tight text-gray-900">
        {title}
      </h1>
      <div className="flex items-center text-gray-600 text-sm gap-4">
        <div className="flex items-center">
          <Calendar className="w-4 h-4 mr-2" />
          <span>{new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}</span>
        </div>
        <span>•</span>
        <div className="flex items-center">
          <Clock className="w-4 h-4 mr-2" />
          <span>{readTime}</span>
        </div>
      </div>
    </div>
  )
}
