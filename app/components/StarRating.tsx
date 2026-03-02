const STARS = [0, 1, 2, 3, 4] as const

interface StarRatingProps {
  rating?: number
  size?: string
  activeClass?: string
  inactiveClass?: string
  className?: string
}

function StarIcon({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}

export default function StarRating({
  rating = 5,
  size = 'w-5 h-5',
  activeClass = 'text-orange-600 fill-current',
  inactiveClass = 'text-gray-200',
  className = '',
}: StarRatingProps) {
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {STARS.map((i) => (
        <StarIcon
          key={i}
          className={`${size} ${i < rating ? activeClass : inactiveClass}`}
        />
      ))}
    </div>
  )
}
