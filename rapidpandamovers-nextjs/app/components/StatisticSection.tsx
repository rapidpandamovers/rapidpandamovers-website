import { Users, Award, TrendingUp, Star } from 'lucide-react'

export interface StatisticSectionStats {
  total_moves: string
  customer_satisfaction: string
  years_experience: string
  average_rating: string
}

interface StatisticSectionProps {
  stats: StatisticSectionStats
  title?: string
  subtitle?: string
}

export default function StatisticSection({
  stats,
  title = 'Trusted by Miami Families & Businesses',
  subtitle = 'Our commitment to excellence has earned us the trust of thousands of customers throughout Miami-Dade County.',
}: StatisticSectionProps) {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">{title}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">{subtitle}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-orange-600" />
            </div>
            <div className="text-3xl font-bold text-gray-800 mb-2">{stats.total_moves}</div>
            <div className="text-gray-600">Successful Moves</div>
          </div>

          <div className="text-center">
            <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Award className="w-8 h-8 text-orange-600" />
            </div>
            <div className="text-3xl font-bold text-gray-800 mb-2">{stats.customer_satisfaction}</div>
            <div className="text-gray-600">Customer Satisfaction</div>
          </div>

          <div className="text-center">
            <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-orange-600" />
            </div>
            <div className="text-3xl font-bold text-gray-800 mb-2">{stats.years_experience}</div>
            <div className="text-gray-600">Years Experience</div>
          </div>

          <div className="text-center">
            <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Star className="w-8 h-8 text-orange-600" />
            </div>
            <div className="text-3xl font-bold text-gray-800 mb-2">{stats.average_rating}</div>
            <div className="text-gray-600">Average Rating</div>
          </div>
        </div>
      </div>
    </section>
  )
}
