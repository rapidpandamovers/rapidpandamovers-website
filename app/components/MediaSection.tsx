'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { Play, Pause, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { useMessages, useLocale } from 'next-intl'
import { H2, H3 } from '@/app/components/Heading'

interface MediaItem {
  type: 'image' | 'video'
  src: string // Image URL, local video path, or YouTube video ID
  thumbnail?: string // Optional thumbnail for videos
  poster?: string // Poster frame for local videos
  title?: string
  description?: string
}

function isLocalVideo(src: string) {
  return src.startsWith('/') || src.startsWith('./') || src.startsWith('http')
    ? /\.(mp4|webm|ogg|mov)(\?|$)/i.test(src)
    : false
}

/** Derive a WebM URL from an MP4 path, e.g. /videos/1.mp4 → /videos/1.webm */
function toWebm(src: string): string {
  return src.replace(/\.mp4$/i, '.webm')
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
  variant?: 'default' | 'left'
}

const defaultImageSrcs = [
  '/images/sights/brickell-city-centre.jpg',
  '/images/sights/cocowalk.jpg',
  '/images/sights/wynwood-walls.jpg',
  '/images/sights/miami-beach-boardwalk.jpg',
]

export default function MediaSection({
  title,
  description,
  items: itemsProp,
  className = "",
  showArrows = true,
  showDots = true,
  autoScroll = false,
  autoScrollInterval = 4000,
  enableModal = true,
  variant = 'default'
}: MediaSectionProps) {
  const { ui } = useMessages() as any
  const locale = useLocale()
  const displayTitle = title ?? ui.media.defaultTitle
  const displayDescription = description ?? ui.media.defaultDescription
  const items: MediaItem[] = itemsProp ?? ui.media.defaultItems.map((item: any, index: number) => ({
    type: 'image' as const,
    src: defaultImageSrcs[index] || defaultImageSrcs[0],
    title: item.title,
    description: item.description,
  }))
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [playingVideoIndex, setPlayingVideoIndex] = useState<number | null>(null)
  const [captionsEnabled, setCaptionsEnabled] = useState<Set<number>>(new Set())
  const scrollRef = useRef<HTMLDivElement>(null)

  const toggleCaptions = useCallback((index: number) => {
    setCaptionsEnabled(prev => {
      const next = new Set(prev)
      if (next.has(index)) {
        next.delete(index)
      } else {
        next.add(index)
      }
      return next
    })
  }, [])

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

  // Lock body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = activeIndex !== null ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [activeIndex])

  const openModal = (index: number) => {
    setActiveIndex(index)
  }

  const closeModal = () => {
    setActiveIndex(null)
  }

  const navigateModal = (direction: 'prev' | 'next') => {
    if (activeIndex === null) return
    if (direction === 'prev') {
      setActiveIndex(activeIndex === 0 ? items.length - 1 : activeIndex - 1)
    } else {
      setActiveIndex(activeIndex === items.length - 1 ? 0 : activeIndex + 1)
    }
  }

  // Refs for local video elements
  const videoRefs = useRef<Map<number, HTMLVideoElement>>(new Map())

  const setVideoRef = useCallback((index: number, el: HTMLVideoElement | null) => {
    if (el) {
      videoRefs.current.set(index, el)
    } else {
      videoRefs.current.delete(index)
    }
  }, [])

  const handleCardClick = (index: number, item: MediaItem) => {
    if (enableModal) {
      openModal(index)
    } else if (item.type === 'video') {
      if (isLocalVideo(item.src)) {
        const video = videoRefs.current.get(index)
        if (video) {
          if (playingVideoIndex === index) {
            video.pause()
            if (video.textTracks?.[0]) video.textTracks[0].mode = 'hidden'
            setCaptionsEnabled(prev => { const next = new Set(prev); next.delete(index); return next })
            setPlayingVideoIndex(null)
          } else {
            // Pause any other playing video and hide its captions
            if (playingVideoIndex !== null) {
              const prev = videoRefs.current.get(playingVideoIndex)
              prev?.pause()
              if (prev?.textTracks?.[0]) prev.textTracks[0].mode = 'hidden'
              setCaptionsEnabled(prev2 => { const next = new Set(prev2); next.delete(playingVideoIndex); return next })
            }
            video.play()
            setPlayingVideoIndex(index)
          }
        }
      } else {
        setPlayingVideoIndex(playingVideoIndex === index ? null : index)
      }
    }
    // Images do nothing when modal is disabled
  }

  const getYouTubeThumbnail = (videoId: string) => {
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
  }

  return (
    <>
      <section className={`pt-20 ${className}`}>
        <div className="container mx-auto">
          {/* Header */}
          {(displayTitle || displayDescription) && variant === 'left' ? (
            <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10 px-6 md:px-0">
              <div>
                {displayTitle && (
                  <H2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                    {displayTitle}
                  </H2>
                )}
                {displayDescription && (
                  <p className="text-lg text-gray-600">
                    {displayDescription}
                  </p>
                )}
              </div>
            </div>
          ) : (displayTitle || displayDescription) && (
            <div className="text-left md:text-center mb-10 px-6 md:px-0">
              {displayTitle && (
                <H2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                  {displayTitle}
                </H2>
              )}
              {displayDescription && (
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  {displayDescription}
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
                  ? 'overflow-x-auto scrollbar-hide snap-x snap-mandatory px-6 scroll-pl-6 pt-1 md:px-1 md:scroll-pl-0'
                  : 'overflow-x-auto scrollbar-hide snap-x snap-mandatory px-6 scroll-pl-6 pt-1 md:grid md:grid-cols-4 md:overflow-visible md:snap-none md:p-0 md:scroll-pl-0'
              }`}
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {items.slice(0, (!showArrows && !showDots && !autoScroll) ? 4 : items.length).map((item, index) => {
                const isStaticMode = !showArrows && !showDots && !autoScroll;
                return (
                <div
                  key={index}
                  onClick={() => handleCardClick(index, item)}
                  className={`group ${isStaticMode ? 'flex-shrink-0 md:flex-1 snap-start p-1 md:p-0' : 'flex-shrink-0 snap-start p-1'} ${enableModal || item.type === 'video' ? 'cursor-pointer' : 'cursor-default'}`}
                >
                  {/* Story Card */}
                  <div className={`relative rounded-4xl overflow-hidden bg-black outline outline-2 outline-transparent group-hover:outline-orange-500 transition-all ${isStaticMode ? 'w-[56vw] h-96 md:w-full md:min-w-0 md:h-[500px]' : 'w-[56vw] h-96 md:w-[calc(25vw-32px)] md:max-w-[280px] md:h-[400px]'}`}>
                    {/* Local Video */}
                    {item.type === 'video' && isLocalVideo(item.src) ? (
                      <>
                        <video
                          ref={(el) => setVideoRef(index, el)}
                          muted
                          playsInline
                          loop
                          preload="metadata"
                          poster={item.poster}
                          aria-label={item.title || `Video ${index + 1}`}
                          className="absolute inset-0 w-full h-full object-cover"
                          onEnded={() => setPlayingVideoIndex(null)}
                        >
                          <source src={`${toWebm(item.src)}#t=0.1`} type="video/webm" />
                          <source src={`${item.src}#t=0.1`} type="video/mp4" />
                          {(() => {
                            const match = item.src.match(/\/(\d+)\.mp4$/)
                            if (!match) return null
                            return (
                              <track
                                kind="captions"
                                src={`/videos/captions/${match[1]}-${locale}.vtt`}
                                srcLang={locale}
                                label={locale === 'es' ? 'Español' : 'English'}
                                default
                              />
                            )
                          })()}
                        </video>

                        {/* Play/Pause Button Overlay */}
                        <div className={`absolute inset-0 flex items-center justify-center z-20 transition-opacity ${playingVideoIndex === index ? 'opacity-0 hover:opacity-100' : 'opacity-100'}`}>
                          <div className="w-14 h-14 bg-black/40 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                            {playingVideoIndex === index ? (
                              <Pause className="w-6 h-6 text-white" fill="currentColor" />
                            ) : (
                              <Play className="w-6 h-6 text-white ml-1" fill="currentColor" />
                            )}
                          </div>
                        </div>

                        {/* CC Toggle — only visible while playing */}
                        {playingVideoIndex === index && (
                          <>
                            <button
                              onClick={(e) => { e.stopPropagation(); toggleCaptions(index) }}
                              className={`absolute bottom-3 right-3 z-30 px-1.5 py-0.5 rounded text-xs font-bold border transition-colors ${
                                captionsEnabled.has(index)
                                  ? 'bg-white text-black border-white'
                                  : 'bg-black/40 text-white/70 border-white/40 hover:text-white hover:border-white'
                              }`}
                              aria-label={captionsEnabled.has(index) ? 'Disable captions' : 'Enable captions'}
                            >
                              CC
                            </button>
                            {captionsEnabled.has(index) && item.title && (
                              <div className="absolute bottom-10 left-3 right-3 z-30 text-center pointer-events-none">
                                <span className="inline-block bg-black/70 text-white text-xs px-2 py-1 rounded">
                                  [{item.title}]
                                </span>
                              </div>
                            )}
                          </>
                        )}
                      </>
                    ) : !enableModal && item.type === 'video' && playingVideoIndex === index ? (
                      /* YouTube Video Player (inline mode) */
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
                          alt={item.title || item.description || 'Media'}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />

                        {/* Play Button for YouTube Videos */}
                        {item.type === 'video' && (
                          <div className="absolute inset-0 flex items-center justify-center z-20">
                            <div className="w-14 h-14 bg-black/40 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                              <Play className="w-6 h-6 text-white ml-1" fill="currentColor" />
                            </div>
                          </div>
                        )}

                        {/* Title & Description — hidden for videos */}
                        {item.type !== 'video' && (
                          <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                            {item.title && (
                              <H3 className="text-white font-semibold text-sm mb-1">{item.title}</H3>
                            )}
                            {item.description && (
                              <p className="text-gray-300 text-xs">{item.description}</p>
                            )}
                          </div>
                        )}
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
            {items[activeIndex].type === 'video' && isLocalVideo(items[activeIndex].src) ? (
              <div className="relative aspect-video">
                <video
                  controls
                  autoPlay
                  aria-label={items[activeIndex].title || `Video ${activeIndex + 1}`}
                  className="w-full h-full rounded-lg"
                >
                  <source src={toWebm(items[activeIndex].src)} type="video/webm" />
                  <source src={items[activeIndex].src} type="video/mp4" />
                  {(() => {
                    const match = items[activeIndex].src.match(/\/(\d+)\.mp4$/)
                    if (!match) return null
                    return (
                      <track
                        kind="captions"
                        src={`/videos/captions/${match[1]}-${locale}.vtt`}
                        srcLang={locale}
                        label={locale === 'es' ? 'Español' : 'English'}
                      />
                    )
                  })()}
                </video>
              </div>
            ) : items[activeIndex].type === 'video' ? (
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
                <H3 className="text-white font-semibold text-lg">{items[activeIndex].title}</H3>
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
