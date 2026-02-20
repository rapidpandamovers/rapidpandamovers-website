import { CheckCircle } from 'lucide-react'

interface Solution {
  title: string
  description: string
}

interface SolutionSectionProps {
  solutions?: Solution[]
  title?: string
  subtitle?: string
}

const defaultSolutions: Solution[] = [
  {
    title: 'We Handle Everything',
    description: 'From planning to delivery, our experienced team manages every detail of your move.'
  },
  {
    title: 'Professional Care',
    description: 'Licensed movers with proper equipment and full insurance protect your belongings.'
  },
  {
    title: 'Transparent Pricing',
    description: 'Get your full quote upfront with no hidden fees or surprise charges.'
  },
  {
    title: 'Reliable Service',
    description: 'On-time arrivals, professional crews, and guaranteed satisfaction every time.'
  }
]

export default function SolutionSection({
  solutions = defaultSolutions,
  title = 'How We Solve Them',
  subtitle = 'Our professional moving services are designed to eliminate stress and deliver results.'
}: SolutionSectionProps) {
  if (!solutions || solutions.length === 0) return null

  return (
    <section className="pt-20">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            {title}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {subtitle}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mx-auto">
          {solutions.map((solution, index) => (
            <div key={index} className="bg-orange-500 rounded-4xl p-8 flex items-start space-x-4">
              <CheckCircle className="w-6 h-6 text-white flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold text-white mb-2">{solution.title}</h3>
                <p className="text-orange-100">{solution.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
