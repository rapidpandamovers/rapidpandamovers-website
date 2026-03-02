'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Calendar, Clock, ImageOff, ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useMessages } from 'next-intl'
import { H1 } from '@/app/components/Heading'

interface BlogHeroImageProps {
  featured: string | null | undefined
  title: string
  category: string
  date: string
  readTime: string
}

export default function BlogHeroImage({ featured, title, category, date, readTime }: BlogHeroImageProps) {
  const { ui } = useMessages() as any
  const [imageError, setImageError] = useState(false)
  const [backUrl, setBackUrl] = useState('/blog')
  const [canGoBack, setCanGoBack] = useState(false)
  const router = useRouter()
  const hasValidImage = featured && typeof featured === 'string' && featured.startsWith('/')

  useEffect(() => {
    // Check if we came from a blog page
    const referrer = document.referrer
    if (referrer) {
      try {
        const url = new URL(referrer)
        if (url.origin === window.location.origin) {
          if (/\/blog(\/page\/\d+|\/pagina\/\d+)?$/.test(url.pathname)) {
            setBackUrl(url.pathname) // eslint-disable-line react-hooks/set-state-in-effect
            setCanGoBack(true)
            return
          }
        }
      } catch {
        // Invalid URL, use default
      }
    }

    // Fallback: check sessionStorage for blog page history
    const storedBlogPage = sessionStorage.getItem('lastBlogPage')
    if (storedBlogPage) {
      setBackUrl(storedBlogPage)
    }
  }, [])

  const handleBackClick = (e: React.MouseEvent) => {
    e.preventDefault()
    if (canGoBack && window.history.length > 1) {
      // Use browser back if we came from a blog page
      router.back()
    } else {
      // Navigate to the stored or default blog URL
      router.push(backUrl)
    }
  }

  if (hasValidImage && !imageError) {
    return (
      <div className="relative rounded-4xl overflow-hidden shadow-xl z-10">
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

        {/* Back to Blog Link - Top Left */}
        <a
          href={backUrl}
          onClick={handleBackClick}
          className="absolute top-6 left-6 md:top-8 md:left-8 inline-flex items-center bg-orange-700 text-white text-sm font-medium px-4 py-1.5 rounded-full hover:bg-orange-800 transition-colors cursor-pointer z-10"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {ui?.blog?.backToBlog || 'Back to Blog'}
        </a>

        {/* Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
          <span className="inline-block bg-white text-orange-700 text-sm font-medium px-4 py-1.5 rounded-full mb-4">
            {category}
          </span>

          <H1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 leading-tight">
            {title}
          </H1>

          <div className="flex items-center text-gray-300 text-sm gap-4">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              <span>{new Date(date + 'T00:00:00').toLocaleDateString('en-US', {
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
    <div className="relative z-10">
        <a
          href={backUrl}
          onClick={handleBackClick}
          className="inline-flex items-center text-orange-700 hover:text-orange-800 mb-4 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {ui?.blog?.backToBlog || 'Back to Blog'}
        </a>
        <span className="inline-block bg-white text-orange-700 text-sm font-medium px-4 py-1.5 rounded-full mb-4 border border-orange-700">
          {category}
        </span>
        <H1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 leading-tight text-gray-900">
          {title}
        </H1>
      <div className="flex items-center text-gray-600 text-sm gap-4">
        <div className="flex items-center">
          <Calendar className="w-4 h-4 mr-2" />
          <span>{new Date(date + 'T00:00:00').toLocaleDateString('en-US', {
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
