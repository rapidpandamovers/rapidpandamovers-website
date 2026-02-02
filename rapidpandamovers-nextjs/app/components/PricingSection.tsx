import { CheckCircle } from 'lucide-react'
import Link from 'next/link'

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

export default function PricingSection({ houseSizes, originCity, originZip, destinationCity, destinationZip }: PricingSectionProps) {
  const baseCategories = [
    { 
      key: '1_bedroom',
      title: '1 Room', 
      sqft: '100-800 sq ft',
      description: 'Studios or small to medium apartments.'
    },
    { 
      key: '2_bedroom',
      title: '2 Room', 
      sqft: '800-1200 sq ft',
      description: 'Small homes and large apartments.',
      popular: true
    },
    { 
      key: '3_bedroom',
      title: '3 Room', 
      sqft: '1000-1500 sq ft',
      description: 'Medium homes and small offices.'
    },
    { 
      key: '4_bedroom',
      title: '4 Room', 
      sqft: '1500-2000 sq ft',
      description: 'Large homes and medium offices.'
    },
    { 
      key: '4plus_bedroom',
      title: '4+ Room', 
      sqft: '2000+ sq ft',
      description: 'Extra large homes or large offices.'
    }
  ];

  const categories = baseCategories.map(category => {
    const sizeData = houseSizes?.[category.key as keyof typeof houseSizes];
    
    if (sizeData) {
      const hoursDisplay = sizeData.min_hours === sizeData.max_hours 
        ? `${sizeData.min_hours} hours`
        : `${sizeData.min_hours}-${sizeData.max_hours} hours`;
      
      return {
        ...category,
        cost: sizeData.avg_cost,
        minCost: sizeData.min_cost,
        maxCost: sizeData.max_cost,
        time: hoursDisplay,
        features: [
          `${sizeData.trucks} ${sizeData.trucks === 1 ? 'truck' : 'trucks'}`,
          `${sizeData.movers} ${sizeData.movers === 1 ? 'mover' : 'movers'}`,
          `${sizeData.min_hours}-${sizeData.max_hours} hours`
        ]
      };
    }
    
    // Fallback to default values if no data
    return {
      ...category,
      cost: undefined,
      time: category.title === '1 Room' ? '2-4 hours' : 
            category.title === '2 Room' ? '3-5 hours' :
            category.title === '3 Room' ? '5-7 hours' :
            category.title === '4 Room' ? '4-5 hours' : '5+ hours',
      features: category.title === '1 Room' ? ['1 truck', '2 movers', '1-2 loading', '1-2 unloading'] :
                category.title === '2 Room' ? ['1 truck', '2 movers', '2-3 loading', '1-2 unloading'] :
                category.title === '3 Room' ? ['1 truck', '3 movers', '3-4 loading', '2-3 unloading'] :
                category.title === '4 Room' ? ['1 truck', '4 movers', '3-4 loading', '2-3 unloading'] :
                ['1+ truck', '4+ movers', '5+ loading', '4+ unloading']
    };
  });

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Estimated Moving Costs
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 max-w-7xl mx-auto">
          {categories.map((category, index) => (
            <div key={index} className={`bg-white border rounded-lg p-6 text-center hover:shadow-lg transition-shadow relative ${category.popular ? 'border-orange-500 shadow-lg' : 'border-gray-200'}`}>
              {category.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">Most Popular</span>
                </div>
              )}
              <h3 className="text-2xl font-bold text-gray-800 mb-2">{category.title}</h3>
              <p className="text-gray-500 text-sm mb-2">{category.sqft}</p>
              {category.cost && (
                <div className="mb-3">
                  <p className="text-2xl font-bold text-orange-500">${category.cost.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
                  {category.minCost !== category.maxCost && (
                    <p className="text-xs text-gray-500 mt-1">${category.minCost.toLocaleString(undefined, { maximumFractionDigits: 2 })} - ${category.maxCost.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
                  )}
                </div>
              )}
              <p className="text-orange-500 font-semibold mb-3">{category.time}</p>
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
                href={`/reservations?${new URLSearchParams({
                  ...(originCity && { originCity }),
                  ...(originZip && { originZip }),
                  ...(destinationCity && { destinationCity }),
                  ...(destinationZip && { destinationZip }),
                  size: category.key
                }).toString()}`}
                className={`block w-full py-3 px-4 rounded-lg font-semibold transition-colors text-center ${category.popular ? 'bg-orange-500 hover:bg-orange-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'}`}
              >
                Reserve Now
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
