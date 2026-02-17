interface ProcessStep {
  step: string
  title: string
  description: string
}

interface ProcessSectionProps {
  steps?: ProcessStep[]
  title?: string
  subtitle?: string
}

const defaultSteps: ProcessStep[] = [
  {
    step: '1',
    title: 'Get a Quote',
    description: 'Contact us for a free, no-obligation estimate based on your moving needs.'
  },
  {
    step: '2',
    title: 'Schedule Your Move',
    description: 'Pick a date and time that works best for you. We offer flexible scheduling.'
  },
  {
    step: '3',
    title: 'We Pack & Load',
    description: 'Our professional team carefully packs and loads your belongings.'
  },
  {
    step: '4',
    title: 'Safe Delivery',
    description: 'We transport and unload everything at your new location with care.'
  }
]

export default function ProcessSection({
  steps = defaultSteps,
  title = 'Our Moving Process',
  subtitle = 'A simple, stress-free process designed to make your move as smooth as possible'
}: ProcessSectionProps) {
  if (!steps || steps.length === 0) return null

  return (
    <section className="pt-20">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            {title}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {subtitle}
          </p>
        </div>
        <div className="bg-orange-50 rounded-4xl p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-orange-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  {step.step}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
