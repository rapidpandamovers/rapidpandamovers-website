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
    <section className="py-16">
      <div className="container mx-auto">
        {(title || subtitle) && (
          <div className="text-center mb-12">
            {title && (
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
            )}
            {subtitle && (
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {subtitle}
              </p>
            )}
          </div>
        )}

        {displayCategories.length > 0 && (
          <div className={`grid gap-12 mx-auto ${displayCategories.length > 1 ? 'md:grid-cols-2' : 'max-w-2xl'}`}>
            {displayCategories.map((category, catIndex) => (
              <div key={catIndex} className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  {category.title}
                </h3>
                {category.description && (
                  <p className="text-gray-600 mb-8">
                    {category.description}
                  </p>
                )}
                <div className="space-y-6">
                  {category.rates.map((rate, index) => (
                    <div key={index} className="border-l-4 border-orange-500 pl-6">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-lg font-semibold text-gray-800">
                          {rate.service}
                        </h4>
                        <span className="text-2xl font-bold text-orange-600">
                          {rate.rate}
                        </span>
                      </div>
                      <p className="text-gray-600">{rate.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Additional Services */}
        {additionalServices && additionalServices.services.length > 0 && (
          <div className={displayCategories.length > 0 ? 'mt-16' : ''}>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                {additionalServices.title}
              </h2>
              {additionalServices.subtitle && (
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  {additionalServices.subtitle}
                </p>
              )}
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {additionalServices.services.map((service, index) => (
                <div key={index} className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-200 hover:border-orange-500 hover:shadow-md transition-all">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {service.service}
                  </h3>
                  <div className="text-3xl font-bold text-orange-600 mb-4">
                    {service.rate}
                  </div>
                  <p className="text-gray-600">{service.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
