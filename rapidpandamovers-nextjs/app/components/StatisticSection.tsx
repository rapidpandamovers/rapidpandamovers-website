import { Users, Award, TrendingUp, Star } from 'lucide-react'
import { getMessages } from 'next-intl/server'
import { H2 } from '@/app/components/Heading'

export interface StatisticSectionStats {
  total_moves: string
  customer_satisfaction: string
  years_experience: string
  average_rating: number
}

interface StatisticSectionProps {
  stats: StatisticSectionStats
  title?: string
  subtitle?: string
}

export default async function StatisticSection({
  stats,
  title: titleProp,
  subtitle: subtitleProp,
}: StatisticSectionProps) {
  const { ui } = (await getMessages()) as any
  const title = titleProp ?? ui.statistics.defaultTitle
  const subtitle = subtitleProp ?? ui.statistics.defaultSubtitle
  const statCards = [
    {
      icon: Users,
      value: stats.total_moves,
      label: ui.statistics.successfulMoves,
      bg: 'bg-gray-50',
      iconBg: 'bg-gray-200',
      iconColor: 'text-gray-600',
    },
    {
      icon: Award,
      value: stats.customer_satisfaction,
      label: ui.statistics.customerSatisfaction,
      bg: 'bg-gray-50',
      iconBg: 'bg-gray-200',
      iconColor: 'text-gray-600',
    },
    {
      icon: TrendingUp,
      value: stats.years_experience,
      label: ui.statistics.yearsExperience,
      bg: 'bg-gray-50',
      iconBg: 'bg-gray-200',
      iconColor: 'text-gray-600',
    },
    {
      icon: Star,
      value: `${stats.average_rating}/5`,
      label: ui.statistics.averageRating,
      bg: 'bg-gray-50',
      iconBg: 'bg-gray-200',
      iconColor: 'text-gray-600',
    },
  ]

  return (
    <section className="pt-20">
      <div className="container mx-auto">
        <div className="text-center mb-12 px-6 md:px-0">
          <H2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">{title}</H2>
          <p className="text-gray-600 max-w-2xl mx-auto">{subtitle}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mx-auto">
          {statCards.map((card) => {
            const IconComponent = card.icon
            return (
              <div key={card.label} className={`${card.bg} rounded-4xl p-6 md:p-8 text-center`}>
                <div className={`${card.iconBg} rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4`}>
                  <IconComponent className={`w-8 h-8 ${card.iconColor}`} />
                </div>
                <div className="text-3xl font-bold text-gray-800 mb-2">{card.value}</div>
                <div className="text-gray-600">{card.label}</div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
