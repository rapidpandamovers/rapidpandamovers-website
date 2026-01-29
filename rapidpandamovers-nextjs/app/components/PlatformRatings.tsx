interface PlatformRating {
  name: string
  rating: string
  reviews: string
  icon: string
  iconBgColor: string
  iconTextSize?: string
}

interface PlatformRatingsProps {
  title?: string
  ratings?: PlatformRating[]
}

const defaultRatings: PlatformRating[] = [
  {
    name: 'Google',
    rating: '4.9/5',
    reviews: '1,408+ reviews',
    icon: 'G',
    iconBgColor: 'bg-blue-500'
  },
  {
    name: 'Yelp',
    rating: '4.9/5',
    reviews: '922+ reviews',
    icon: '★',
    iconBgColor: 'bg-red-500'
  },
  {
    name: 'BBB',
    rating: 'A+',
    reviews: 'BBB rated',
    icon: 'BBB',
    iconBgColor: 'bg-blue-600',
    iconTextSize: 'text-xs'
  }
]

export default function PlatformRatings({ 
  title = 'High Ratings Across All Review Sites',
  ratings = defaultRatings
}: PlatformRatingsProps) {
  return (
    <section className="py-5 px-4 md:px-6 lg:px-8">
    <div className="container mx-auto">
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <h2 className="font-display text-xl font-bold">{title}</h2>
        {ratings.map((rating, index) => (
          <div key={index} className="bg-gray-800 rounded-lg px-4 py-3 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 ${rating.iconBgColor} rounded flex items-center justify-center`}>
                  <span className={`text-white font-bold ${rating.iconTextSize || 'text-sm'}`}>{rating.icon}</span>
                </div>
                <span className="text-gray-300">{rating.name}</span>
              </div>
              <div className="text-3xl font-bold text-white">{rating.rating}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
    </section>
  )
}

