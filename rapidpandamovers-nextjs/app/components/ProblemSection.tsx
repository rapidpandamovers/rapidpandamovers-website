import { AlertCircle } from 'lucide-react'

interface Problem {
  title: string
  description: string
}

interface ProblemSectionProps {
  problems?: Problem[]
  title?: string
  subtitle?: string
}

const defaultProblems: Problem[] = [
  {
    title: 'Stressful Planning',
    description: 'Coordinating logistics, timing, and packing can be overwhelming and time-consuming.'
  },
  {
    title: 'Risk of Damage',
    description: 'DIY moves often result in damaged furniture, broken items, and costly repairs.'
  },
  {
    title: 'Hidden Costs',
    description: 'Many movers add surprise fees after the job starts, blowing your budget.'
  },
  {
    title: 'Unreliable Service',
    description: 'No-shows, late arrivals, and unprofessional crews cause unnecessary headaches.'
  }
]

export default function ProblemSection({
  problems = defaultProblems,
  title = 'Common Moving Challenges',
  subtitle = "Moving doesn't have to be stressful. Here are the problems we solve for you."
}: ProblemSectionProps) {
  if (!problems || problems.length === 0) return null

  return (
    <section className="py-20">
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {problems.map((problem, index) => (
            <div key={index} className="bg-black rounded-lg p-6 flex items-start space-x-4">
              <AlertCircle className="w-6 h-6 text-orange-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-bold text-white mb-2">{problem.title}</h3>
                <p className="text-gray-300">{problem.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
