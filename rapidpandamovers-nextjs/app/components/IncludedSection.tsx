import { CheckCircle } from 'lucide-react'

export default function IncludedSection() {
  const stressFreeItems = [
    'Professional packing materials',
    'Careful loading and unloading', 
    'Safe transportation',
    'Furniture protection'
  ]

  const professionalItems = [
    'Licensed and insured movers',
    'Background-checked staff',
    'On-time arrival guaranteed',
    'Transparent pricing'
  ]

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            What's included in <span className="text-orange-500">every move</span>.
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Stress-Free Moving and Packing</h3>
            <div className="space-y-4">
              {stressFreeItems.map((item, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-orange-500" />
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Professional Service</h3>
            <div className="space-y-4">
              {professionalItems.map((item, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-orange-500" />
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
