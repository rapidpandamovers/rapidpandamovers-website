import { H2, H3 } from '@/app/components/Heading'

interface Rate {
  service: string
  rate: string
  description: string
}

interface RateCategory {
  title: string
  description?: string
  rates: Rate[]
}

interface AdditionalServices {
  title: string
  subtitle?: string
  services: Rate[]
}

interface RateSectionProps {
  title?: string
  subtitle?: string
  categories?: RateCategory[]
  additionalServices?: AdditionalServices
  // Legacy props for backwards compatibility
  localMovingRates?: Rate[]
  packingRates?: Rate[]
}

export default function RateSection({
  title,
  subtitle,
  categories,
  additionalServices,
  localMovingRates = [],
  packingRates = []
}: RateSectionProps) {
  // Build categories from legacy props if not provided
  const displayCategories: RateCategory[] = categories || [
    ...(localMovingRates.length > 0 ? [{ title: 'Local Moving Rates', rates: localMovingRates }] : []),
    ...(packingRates.length > 0 ? [{ title: 'Packing Services', rates: packingRates }] : [])
  ]

  const hasAdditionalServices = additionalServices && additionalServices.services.length > 0

  if (displayCategories.length === 0 && !hasAdditionalServices) {
    return null
  }

  return (
    <section className="pt-20">
      <div className="container mx-auto">
        {(title || subtitle) && (
          <div className="text-center mb-12 px-6 md:px-0">
            {title && (
              <H2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                {title}
              </H2>
            )}
            {subtitle && (
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {subtitle}
              </p>
            )}
          </div>
        )}

        {displayCategories.length > 0 && (
          <div className={`grid gap-8 ${displayCategories.length > 1 ? 'md:grid-cols-2' : 'max-w-2xl mx-auto'}`}>
            {displayCategories.map((category, catIndex) => {
              const bgColors = ['bg-orange-50', 'bg-gray-50', 'bg-green-50', 'bg-blue-50']
              return (
                <div key={catIndex} className={`${bgColors[catIndex % bgColors.length]} rounded-4xl p-6 md:p-8`}>
                  <H3 className="text-2xl font-bold text-gray-800 mb-4">
                    {category.title}
                  </H3>
                  {category.description && (
                    <p className="text-gray-600 mb-6">
                      {category.description}
                    </p>
                  )}
                  <div className="space-y-4">
                    {category.rates.map((rate, index) => (
                      <div key={index} className="bg-white rounded-2xl p-6">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="text-lg font-semibold text-gray-800">
                            {rate.service}
                          </h4>
                          <span className="text-2xl font-bold text-orange-700">
                            {rate.rate}
                          </span>
                        </div>
                        <p className="text-gray-600">{rate.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Additional Services */}
        {additionalServices && additionalServices.services.length > 0 && (
          <div className={displayCategories.length > 0 ? 'mt-16' : ''}>
            <div className="text-center mb-12 px-6 md:px-0">
              <H2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                {additionalServices.title}
              </H2>
              {additionalServices.subtitle && (
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  {additionalServices.subtitle}
                </p>
              )}
            </div>
            <div className="bg-gray-50 rounded-4xl p-6 md:p-8">
              <div className="grid md:grid-cols-3 gap-6">
                {additionalServices.services.map((service, index) => (
                  <div key={index} className="bg-white rounded-2xl p-6 text-center">
                    <H3 className="text-xl font-semibold text-gray-800 mb-2">
                      {service.service}
                    </H3>
                    <div className="text-3xl font-bold text-orange-700 mb-4">
                      {service.rate}
                    </div>
                    <p className="text-gray-600">{service.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
