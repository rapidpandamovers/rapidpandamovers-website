import { Star } from 'lucide-react'
import content from '@/data/content.json'

interface PlatformRating {
  name: string
  rating: string
  icon: React.ReactNode
  color: string
}

interface RatingSectionProps {
  title?: string
  ratings?: PlatformRating[]
  className?: string
}

// Platform icons
const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
)

const YelpIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="#D32323">
    <path d="M20.16 12.594l-4.995 1.433c-.96.276-1.74-.8-1.176-1.63l2.905-4.308a1.072 1.072 0 0 1 1.596-.206 9.194 9.194 0 0 1 2.364 3.252 1.073 1.073 0 0 1-.694 1.459zm-3.984 5.838l-4.59-2.655a1.073 1.073 0 0 1 .063-1.89l4.59-2.655c.89-.515 1.89.29 1.628 1.31l-1.165 4.58c-.18.706-1.144.985-1.726.31zm-5.943-2.655l-4.59 2.655c-.89.515-1.89-.29-1.628-1.31l1.165-4.58c.18-.706 1.144-.985 1.726-.31l4.59 2.655c.963.557.89 1.947-.263 2.39zM5.17 12.594l4.995 1.433c.96.276 1.74-.8 1.176-1.63l-2.905-4.308a1.072 1.072 0 0 0-1.596-.206 9.194 9.194 0 0 0-2.364 3.252 1.073 1.073 0 0 0 .694 1.459zM12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z"/>
  </svg>
)

const BBBIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="#005A78">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
  </svg>
)

const defaultRatings: PlatformRating[] = [
  {
    name: 'Google',
    rating: String(content.reviews.platforms.google.rating),
    icon: <GoogleIcon />,
    color: '#4285F4'
  },
  {
    name: 'Yelp',
    rating: String(content.reviews.platforms.yelp.rating),
    icon: <YelpIcon />,
    color: '#D32323'
  },
  {
    name: 'BBB',
    rating: String(content.reviews.platforms.bbb.rating),
    icon: <BBBIcon />,
    color: '#005A78'
  }
]

export default function RatingSection({
  title = 'Excellent Ratings Across All Platforms',
  ratings = defaultRatings,
  className = ''
}: RatingSectionProps) {
  return (
    <section className={`-mt-8 relative z-[-1] ${className}`}>
      <div className="container mx-auto">
        <div className="bg-gray-100 rounded-b-4xl px-6 pt-14 pb-6 md:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* Title */}
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 lg:flex-shrink-0">
            {title}
          </h2>

          {/* Ratings */}
          <div className="flex flex-wrap gap-4 lg:gap-6">
            {ratings.map((rating, index) => (
              <div
                key={index}
                className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3"
              >
                {/* Platform Icon */}
                <div className="flex-shrink-0">
                  {rating.icon}
                </div>

                {/* Rating Info */}
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-gray-900">{rating.rating}</span>
                    {rating.rating !== 'A+' && (
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 text-orange-500 fill-current" />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
