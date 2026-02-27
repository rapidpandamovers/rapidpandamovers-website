import { CheckCircle } from 'lucide-react'
import { Link } from '@/i18n/routing'
import { getMessages, getLocale } from 'next-intl/server'
import { H2, H3 } from '@/app/components/Heading'
import { getTranslatedSlug } from '@/i18n/slug-map'
import type { Locale } from '@/i18n/config'

interface HouseSize {
  min_cost: number;
  max_cost: number;
  avg_cost: number;
  movers: number;
  trucks: number;
  min_hours: number;
  max_hours: number;
}

interface PricingSectionProps {
  houseSizes?: {
    '1_bedroom'?: HouseSize;
    '2_bedroom'?: HouseSize;
    '3_bedroom'?: HouseSize;
    '4_bedroom'?: HouseSize;
    '4plus_bedroom'?: HouseSize;
  };
  originCity?: string;
  originZip?: string;
  destinationCity?: string;
  destinationZip?: string;
}

export default async function PricingSection({ houseSizes, originCity, originZip, destinationCity, destinationZip }: PricingSectionProps) {
  const { ui } = (await getMessages()) as any
  const locale = await getLocale() as Locale
  const reservationsSlug = getTranslatedSlug('reservations', locale)
  const cats = ui.pricing.categories
  const baseCategories = [
    {
      key: '1_bedroom',
      title: cats.oneRoom.title,
      sqft: cats.oneRoom.size,
      description: cats.oneRoom.desc
    },
    {
      key: '2_bedroom',
      title: cats.twoRoom.title,
      sqft: cats.twoRoom.size,
      description: cats.twoRoom.desc,
      popular: true
    },
    {
      key: '3_bedroom',
      title: cats.threeRoom.title,
      sqft: cats.threeRoom.size,
      description: cats.threeRoom.desc
    },
    {
      key: '4_bedroom',
      title: cats.fourRoom.title,
      sqft: cats.fourRoom.size,
      description: cats.fourRoom.desc
    },
    {
      key: '4plus_bedroom',
      title: cats.fourPlusRoom.title,
      sqft: cats.fourPlusRoom.size,
      description: cats.fourPlusRoom.desc
    }
  ];

  const categories = baseCategories.map(category => {
    const sizeData = houseSizes?.[category.key as keyof typeof houseSizes];
    
    if (sizeData) {
      const hoursDisplay = sizeData.min_hours === sizeData.max_hours
        ? `${sizeData.min_hours} ${sizeData.min_hours === 1 ? ui.pricing.features.hour : ui.pricing.features.hours}`
        : `${sizeData.min_hours}-${sizeData.max_hours} ${ui.pricing.features.hours}`;
      
      return {
        ...category,
        cost: sizeData.avg_cost,
        minCost: sizeData.min_cost,
        maxCost: sizeData.max_cost,
        time: hoursDisplay,
        features: [
          `${sizeData.trucks} ${sizeData.trucks === 1 ? ui.pricing.features.truck : ui.pricing.features.trucks}`,
          `${sizeData.movers} ${sizeData.movers === 1 ? ui.pricing.features.mover : ui.pricing.features.movers}`,
          `${sizeData.min_hours}-${sizeData.max_hours} ${ui.pricing.features.hours}`
        ]
      };
    }
    
    // Fallback to default values if no data
    return {
      ...category,
      cost: undefined,
      time: category.key === '1_bedroom' ? '2-4 hours' :
            category.key === '2_bedroom' ? '3-5 hours' :
            category.key === '3_bedroom' ? '5-7 hours' :
            category.key === '4_bedroom' ? '4-5 hours' : '5+ hours',
      features: category.key === '1_bedroom' ? [`1 ${ui.pricing.features.truck}`, `2 ${ui.pricing.features.movers}`, `1-2 ${ui.pricing.features.loading}`, `1-2 ${ui.pricing.features.unloading}`] :
                category.key === '2_bedroom' ? [`1 ${ui.pricing.features.truck}`, `2 ${ui.pricing.features.movers}`, `2-3 ${ui.pricing.features.loading}`, `1-2 ${ui.pricing.features.unloading}`] :
                category.key === '3_bedroom' ? [`1 ${ui.pricing.features.truck}`, `3 ${ui.pricing.features.movers}`, `3-4 ${ui.pricing.features.loading}`, `2-3 ${ui.pricing.features.unloading}`] :
                category.key === '4_bedroom' ? [`1 ${ui.pricing.features.truck}`, `4 ${ui.pricing.features.movers}`, `3-4 ${ui.pricing.features.loading}`, `2-3 ${ui.pricing.features.unloading}`] :
                [`1+ ${ui.pricing.features.truck}`, `4+ ${ui.pricing.features.movers}`, `5+ ${ui.pricing.features.loading}`, `4+ ${ui.pricing.features.unloading}`]
    };
  });

  return (
    <section className="pt-20 bg-white">
      <div className="container mx-auto">
        <div className="text-center mb-16 px-6 md:px-0">
          <H2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            {ui.pricing.title}
          </H2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 max-w-7xl mx-auto">
          {categories.map((category, index) => (
            <div key={index} className={`bg-white border rounded-lg p-6 text-center hover:shadow-lg transition-shadow relative ${category.popular ? 'border-orange-500 shadow-lg' : 'border-gray-200'}`}>
              {category.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-orange-600 text-white px-3 py-1 rounded-full text-sm font-medium text-shadow-sm">{ui.pricing.mostPopular}</span>
                </div>
              )}
              <H3 className="text-2xl font-bold text-gray-800 mb-2">
                {(() => {
                  const parts = category.title.split(' ');
                  return <>
                    <span className="block text-3xl">{parts[0]}</span>
                    {parts.slice(1).join(' ')}
                  </>;
                })()}
              </H3>
              <p className="text-gray-500 text-sm mb-2">{category.sqft}</p>
              {category.cost && (
                <div className="mb-3">
                  <p className="text-2xl font-bold text-orange-600">${category.cost.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
                  {category.minCost !== category.maxCost && (
                    <p className="text-xs text-gray-500 mt-1">${category.minCost.toLocaleString(undefined, { maximumFractionDigits: 2 })} - ${category.maxCost.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
                  )}
                </div>
              )}
              <p className="text-orange-600 font-semibold mb-3">{category.time}</p>
              <p className="text-gray-600 mb-4 text-sm">{category.description}</p>
              <ul className="space-y-2 mb-6">
                {category.features.map((feature, i) => (
                  <li key={i} className="text-sm text-gray-600 flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-orange-500 mr-2" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link
                href={`/${reservationsSlug}?${new URLSearchParams({
                  ...(originCity && { originCity }),
                  ...(originZip && { originZip }),
                  ...(destinationCity && { destinationCity }),
                  ...(destinationZip && { destinationZip }),
                  size: category.key
                }).toString()}`}
                className={`block w-full py-3 px-4 rounded-lg font-semibold transition-colors text-center ${category.popular ? 'bg-orange-600 hover:bg-orange-700 text-white text-shadow-sm' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'}`}
              >
                {ui.buttons.reserveNow}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
