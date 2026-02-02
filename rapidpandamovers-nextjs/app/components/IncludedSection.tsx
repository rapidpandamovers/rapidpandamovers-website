import { CheckCircle } from 'lucide-react'

interface IncludedSectionProps {
  items?: string[]
  title?: string
  subtitle?: string
}

const defaultItems = [
  'Professional packing materials',
  'Careful loading and unloading',
  'Safe transportation',
  'Furniture protection',
  'Licensed and insured movers',
  'Background-checked staff',
  'On-time arrival guaranteed',
  'Transparent pricing'
]

export default function IncludedSection({
  items = defaultItems,
  title = "What's Included",
  subtitle = "Everything you need for a complete moving experience"
}: IncludedSectionProps) {
  if (!items || items.length === 0) return null

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            {title.includes(' ') ? (
              <>
                {title.split(' ').slice(0, -1).join(' ')}{' '}
                <span className="text-orange-500">{title.split(' ').slice(-1)}</span>
              </>
            ) : (
              <span className="text-orange-500">{title}</span>
            )}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {subtitle}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
          {items.map((item, index) => (
            <div key={index} className="flex items-center space-x-3 bg-gray-50 rounded-lg p-4">
              <CheckCircle className="w-5 h-5 text-orange-500 flex-shrink-0" />
              <span className="text-gray-700 text-sm">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
