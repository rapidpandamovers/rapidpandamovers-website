import { AlertCircle } from 'lucide-react'
import content from '@/data/content.json'

const defaults = content.defaults.problems

interface Problem {
  title: string
  description: string
}

interface ProblemSectionProps {
  problems?: Problem[]
  title?: string
  subtitle?: string
}

export default function ProblemSection({
  problems = defaults.items,
  title = defaults.title,
  subtitle = defaults.subtitle
}: ProblemSectionProps) {
  if (!problems || problems.length === 0) return null

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
          {problems.map((problem, index) => (
            <div key={index} className="bg-black rounded-4xl p-8 flex items-start space-x-4">
              <AlertCircle className="w-6 h-6 text-orange-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold text-white mb-2">{problem.title}</h3>
                <p className="text-gray-300">{problem.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
