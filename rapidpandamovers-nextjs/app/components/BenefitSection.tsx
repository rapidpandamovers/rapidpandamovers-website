import { CheckCircle } from 'lucide-react'

interface BenefitSectionProps {
  benefits?: string[]
  serviceName?: string
  locationName?: string
  title?: string
}

const defaultBenefits = [
  'Licensed and insured professional movers',
  'Transparent pricing with no hidden fees',
  'Careful handling of all your belongings',
  'On-time arrival guaranteed',
  'Flexible scheduling options',
  'Free, no-obligation quotes'
]

export default function BenefitSection({
  benefits = defaultBenefits,
  serviceName,
  locationName,
  title
}: BenefitSectionProps) {
  if (!benefits || benefits.length === 0) return null

  // Build title: use custom title, or construct from serviceName/locationName
  const displayTitle = title || (
    serviceName
      ? `Why Choose Our ${serviceName}${locationName ? ` in ${locationName}` : ''}?`
      : 'Why Choose Us?'
  )

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            {serviceName ? (
              <>
                Why Choose Our <span className="text-orange-500">{serviceName}</span>
                {locationName && ` in ${locationName}`}?
              </>
            ) : title ? (
              title.includes(' ') ? (
                <>
                  {title.split(' ').slice(0, -1).join(' ')}{' '}
                  <span className="text-orange-500">{title.split(' ').slice(-1)}</span>
                </>
              ) : (
                <span className="text-orange-500">{title}</span>
              )
            ) : (
              <>Why Choose <span className="text-orange-500">Us</span>?</>
            )}
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {benefits.map((benefit, index) => (
            <div key={index} className="bg-white rounded-lg p-6 shadow-md flex items-start space-x-4">
              <CheckCircle className="w-6 h-6 text-orange-500 flex-shrink-0 mt-1" />
              <p className="text-gray-700 font-medium">{benefit}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
