import { getMessages } from 'next-intl/server'
import { H2, H3 } from '@/app/components/Heading'

interface PromiseCard {
  title: string
  desc: string
}

interface PromiseSectionProps {
  title?: string
  subtitle?: string
  cards: PromiseCard[]
}

export default async function PromiseSection({
  title,
  subtitle,
  cards,
}: PromiseSectionProps) {
  const { ui } = (await getMessages()) as any
  title = title ?? ui.promise.defaultTitle
  subtitle = subtitle ?? ui.promise.defaultSubtitle
  if (!cards || cards.length === 0) return null

  return (
    <section className="pt-20">
      <div className="container mx-auto">
        <div className="bg-orange-50 rounded-4xl p-8 md:p-12">
          <div className="max-w-4xl mx-auto text-center mb-10">
            <H2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              {title}
            </H2>
            <p className="text-lg text-gray-600">
              {subtitle}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {cards.map((card, index) => (
              <div key={index} className="bg-white rounded-2xl p-6">
                <H3 className="text-lg font-bold text-gray-800 mb-2">{card.title}</H3>
                <p className="text-gray-600 text-sm">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
