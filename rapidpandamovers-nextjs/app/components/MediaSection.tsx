'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { Play, X, ChevronLeft, ChevronRight } from 'lucide-react'

interface MediaItem {
  type: 'image' | 'video'
  src: string // Image URL or YouTube video ID
  thumbnail?: string // Optional thumbnail for videos
  title?: string
  description?: string
}

interface MediaSectionProps {
  title?: string
  description?: string
  items?: MediaItem[]
  className?: string
  showArrows?: boolean
  showDots?: boolean
  autoScroll?: boolean
  autoScrollInterval?: number // in milliseconds
  enableModal?: boolean // When false, videos play inline and images do nothing
}

const defaultItems: MediaItem[] = [
  {
    type: 'image',
    src: '/images/sights/brickell-city-centre.jpg',
    title: 'Brickell Moving',
    description: 'Downtown Miami relocations'
  },
  {
    type: 'image',
    src: '/images/sights/cocowalk.jpg',
    title: 'Coconut Grove',
    description: 'Village charm moves'
  },
  {
    type: 'image',
    src: '/images/sights/wynwood-walls.jpg',
    title: 'Wynwood',
    description: 'Arts district moves'
  },
  {
    type: 'image',
    src: '/images/sights/miami-beach-boardwalk.jpg',
    title: 'Miami Beach',
    description: 'Coastal relocations'
  },
]

export default function MediaSection({
  title = "See Us In Action",
  description = "Watch our professional team handle moves with care and precision",
  items = defaultItems,
  className = "",
  showArrows = true,
  showDots = true,
  autoScroll = false,
  autoScrollInterval = 4000,
  enableModal = true
}: MediaSectionProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [playingVideoIndex, setPlayingVideoIndex] = useState<number | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 320 // Match card width + gap
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  // Auto scroll functionality
  useEffect(() => {
    if (!autoScroll || activeIndex !== null) return

    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
        // If at the end, scroll back to start
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' })
        } else {
          scroll('right')
        }
      }
    }, autoScrollInterval)

    return () => clearInterval(interval)
  }, [autoScroll, autoScrollInterval, activeIndex])

  const openModal = (index: number) => {
    setActiveIndex(index)
    document.body.style.overflow = 'hidden'
  }

  const closeModal = () => {
    setActiveIndex(null)
    document.body.style.overflow = 'unset'
  }

  const navigateModal = (direction: 'prev' | 'next') => {
    if (activeIndex === null) return
    if (direction === 'prev') {
      setActiveIndex(activeIndex === 0 ? items.length - 1 : activeIndex - 1)
    } else {
      setActiveIndex(activeIndex === items.length - 1 ? 0 : activeIndex + 1)
    }
  }

  const handleCardClick = (index: number, item: MediaItem) => {
    if (enableModal) {
      openModal(index)
    } else if (item.type === 'video') {
      setPlayingVideoIndex(playingVideoIndex === index ? null : index)
    }
    // Images do nothing when modal is disabled
  }

  const getYouTubeThumbnail = (videoId: string) => {
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
  }

  return (
    <>
      <section className={`pt-20 px-4 md:px-6 lg:px-8 ${className}`}>
        <div className="container mx-auto">
          {/* Header */}
          {(title || description) && (
            <div className="text-center mb-10">
              {title && (
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                  {title}
                </h2>
              )}
              {description && (
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  {description}
                </p>
              )}
            </div>
          )}

          {/* Stories Container */}
          <div className="relative">
            {/* Navigation Arrows */}
            {showArrows && (
              <>
                <button
                  onClick={() => scroll('left')}
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all -translate-x-1/2 hidden md:flex"
                >
                  <ChevronLeft className="w-6 h-6 text-gray-800" />
                </button>
                <button
                  onClick={() => scroll('right')}
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all translate-x-1/2 hidden md:flex"
                >
                  <ChevronRight className="w-6 h-6 text-gray-800" />
                </button>
              </>
            )}

            {/* Scrollable Stories */}
            <div
              ref={scrollRef}
              className={`flex gap-4 pb-4 ${
                showArrows || showDots || autoScroll
                  ? 'overflow-x-auto scrollbar-hide snap-x snap-mandatory px-1 pt-1'
                  : 'overflow-visible p-1'
              }`}
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {items.slice(0, (!showArrows && !showDots && !autoScroll) ? 4 : items.length).map((item, index) => {
                const isStaticMode = !showArrows && !showDots && !autoScroll;
                return (
                <div
                  key={index}
                  onClick={() => handleCardClick(index, item)}
                  className={`group ${isStaticMode ? 'flex-1' : 'flex-shrink-0'} ${showArrows || showDots || autoScroll ? 'snap-start p-1' : ''} ${enableModal || item.type === 'video' ? 'cursor-pointer' : 'cursor-default'}`}
                >
                  {/* Story Card */}
                  <div className={`relative rounded-xl overflow-hidden bg-black outline outline-2 outline-transparent group-hover:outline-orange-500 transition-all ${isStaticMode ? 'w-full h-[500px]' : 'w-64 h-96 md:w-[calc(25vw-32px)] md:max-w-[280px] md:h-[400px]'}`}>
                    {/* Video Player (inline mode) */}
                    {!enableModal && item.type === 'video' && playingVideoIndex === index ? (
                      <iframe
                        src={`https://www.youtube.com/embed/${item.src}?autoplay=1`}
                        title={item.title || 'Video'}
                        className="absolute inset-0 w-full h-full z-30"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <>
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />

                        {/* Image/Thumbnail */}
                        <Image
                          src={item.type === 'video' ? (item.thumbnail || getYouTubeThumbnail(item.src)) : item.src}
                          alt={item.title || `Media ${index + 1}`}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />

                        {/* Play Button for Videos */}
                        {item.type === 'video' && (
                          <div className="absolute inset-0 flex items-center justify-center z-20">
                            <div className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                              <Play className="w-6 h-6 text-orange-500 ml-1" fill="currentColor" />
                            </div>
                          </div>
                        )}

                        {/* Title & Description */}
                        <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                          {item.title && (
                            <h3 className="text-white font-semibold text-sm mb-1">{item.title}</h3>
                          )}
                          {item.description && (
                            <p className="text-gray-300 text-xs">{item.description}</p>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              );
              })}
            </div>

            {/* Progress Dots */}
            {showDots && (
              <div className="flex justify-center gap-2 mt-6">
                {items.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => enableModal && openModal(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      activeIndex === index ? 'bg-orange-500 w-6' : 'bg-gray-400 hover:bg-gray-500'
                    } ${!enableModal ? 'cursor-default' : ''}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Modal/Lightbox */}
      {enableModal && activeIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
          {/* Close Button */}
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 z-50 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          {/* Navigation */}
          <button
            onClick={() => navigateModal('prev')}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-50 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
          >
            <ChevronLeft className="w-8 h-8 text-white" />
          </button>
          <button
            onClick={() => navigateModal('next')}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-50 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
          >
            <ChevronRight className="w-8 h-8 text-white" />
          </button>

          {/* Content */}
          <div className="w-full max-w-4xl mx-4">
            {items[activeIndex].type === 'video' ? (
              <div className="relative aspect-video">
                <iframe
                  src={`https://www.youtube.com/embed/${items[activeIndex].src}?autoplay=1`}
                  title={items[activeIndex].title || 'Video'}
                  className="w-full h-full rounded-lg"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <div className="relative aspect-video">
                <Image
                  src={items[activeIndex].src}
                  alt={items[activeIndex].title || 'Image'}
                  fill
                  className="object-contain rounded-lg"
                />
              </div>
            )}

            {/* Caption */}
            <div className="text-center mt-4">
              {items[activeIndex].title && (
                <h3 className="text-white font-semibold text-lg">{items[activeIndex].title}</h3>
              )}
              {items[activeIndex].description && (
                <p className="text-gray-400 mt-1">{items[activeIndex].description}</p>
              )}
              <p className="text-gray-500 text-sm mt-2">
                {activeIndex + 1} / {items.length}
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-1">
            {items.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`h-1 rounded-full transition-all ${
                  activeIndex === index ? 'bg-orange-500 w-8' : 'bg-white/30 w-4 hover:bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </>
  )
}
