import { CheckCircle, LucideIcon } from 'lucide-react'
import { resolveIcon } from '@/lib/icons'
import content from '@/data/content.json'

const defaults = content.defaults.included

interface DetailItem {
  icon?: LucideIcon | string
  title: string
  desc?: string
}

interface IncludedSectionProps {
  items?: string[] | DetailItem[]
  title?: string
  subtitle?: string
  background?: 'gray' | 'orange'
}

export default function IncludedSection({
  items = defaults.items,
  title = defaults.title,
  subtitle,
  background = 'gray',
}: IncludedSectionProps) {
  if (!items || items.length === 0) return null

  // Normalize items to DetailItem format
  const normalizedItems: DetailItem[] = items.map(item =>
    typeof item === 'string' ? { title: item } : item
  )

  const bgClass = background === 'orange' ? 'bg-orange-50' : 'bg-gray-50'

  return (
    <section className="pt-20">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>
        <div className={`${bgClass} rounded-4xl p-8`}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {normalizedItems.map((item, index) => {
              const IconComponent = typeof item.icon === 'string' ? resolveIcon(item.icon) : (item.icon || CheckCircle)
              return (
                <div key={index} className="bg-white rounded-2xl p-6 text-center">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="w-6 h-6 text-orange-500" />
                  </div>
                  <h3 className="font-bold text-gray-800 mb-2">{item.title}</h3>
                  {item.desc && <p className="text-gray-600 text-sm">{item.desc}</p>}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
