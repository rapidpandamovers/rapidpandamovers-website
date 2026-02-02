'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

export default function BackToBlogLink() {
  const router = useRouter()
  const [backUrl, setBackUrl] = useState('/blog')
  const [canGoBack, setCanGoBack] = useState(false)

  useEffect(() => {
    // Check if we came from a blog page
    const referrer = document.referrer
    if (referrer) {
      try {
        const url = new URL(referrer)
        // Check if referrer is from the same origin and is a blog listing page
        if (url.origin === window.location.origin) {
          if (url.pathname === '/blog' || url.pathname.startsWith('/blog/page/')) {
            setBackUrl(url.pathname)
            setCanGoBack(true)
          }
        }
      } catch {
        // Invalid URL, use default
      }
    }

    // Also check sessionStorage for blog page history
    const storedBlogPage = sessionStorage.getItem('lastBlogPage')
    if (storedBlogPage && !canGoBack) {
      setBackUrl(storedBlogPage)
    }
  }, [canGoBack])

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    if (canGoBack && window.history.length > 1) {
      // Use browser back if we came from a blog page
      router.back()
    } else {
      // Navigate to the stored or default blog URL
      router.push(backUrl)
    }
  }

  return (
    <a
      href={backUrl}
      onClick={handleClick}
      className="inline-flex items-center text-orange-500 hover:text-orange-600 mb-8 transition-colors cursor-pointer"
    >
      <ArrowLeft className="w-4 h-4 mr-2" />
      Back to Blog
    </a>
  )
}
