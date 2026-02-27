import { CheckCircle } from 'lucide-react'
import { getMessages } from 'next-intl/server'
import { H2, H3 } from '@/app/components/Heading'

interface Solution {
  title: string
  description: string
}

interface SolutionSectionProps {
  solutions?: Solution[]
  title?: string
  subtitle?: string
}

export default async function SolutionSection({
  solutions,
  title,
  subtitle
}: SolutionSectionProps) {
  const { content } = (await getMessages()) as any
  const defaults = content.defaults.solutions
  solutions = solutions ?? defaults.items
  title = title ?? defaults.title
  subtitle = subtitle ?? defaults.subtitle
  if (!solutions || solutions.length === 0) return null

  return (
    <section className="pt-20">
      <div className="container mx-auto">
        <div className="text-center mb-16 px-6 md:px-0">
          <H2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            {title}
          </H2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {subtitle}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mx-auto">
          {solutions.map((solution, index) => (
            <div key={index} className="bg-orange-600 rounded-4xl p-6 md:p-8 flex items-start space-x-4">
              <CheckCircle className="w-6 h-6 text-white flex-shrink-0 mt-1" />
              <div>
                <H3 className="text-xl font-bold text-white text-shadow-sm mb-2">{solution.title}</H3>
                <p className="text-orange-100 text-shadow-sm">{solution.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
