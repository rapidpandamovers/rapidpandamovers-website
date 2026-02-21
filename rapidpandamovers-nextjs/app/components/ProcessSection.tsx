import { getMessages } from 'next-intl/server'
import { H2, H3 } from '@/app/components/Heading'

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

export default async function ProcessSection({
  steps,
  title,
  subtitle
}: ProcessSectionProps) {
  const { content } = (await getMessages()) as any
  const defaults = content.defaults.process
  steps = steps ?? defaults.steps
  title = title ?? defaults.title
  subtitle = subtitle ?? defaults.subtitle
  if (!steps || steps.length === 0) return null

  return (
    <section className="pt-20">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <H2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            {title}
          </H2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {subtitle}
          </p>
        </div>
        <div className="bg-orange-50 rounded-4xl p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-orange-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  {step.step}
                </div>
                <H3 className="text-xl font-bold text-gray-800 mb-3">{step.title}</H3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
