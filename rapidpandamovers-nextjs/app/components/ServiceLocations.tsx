import { MapPin } from 'lucide-react'

export default function ServiceLocations() {
  const locations = [
    'Miami', 'Coral Gables', 'Miami Beach', 'Hialeah', 'Doral', 'Aventura',
    'Kendall', 'Homestead', 'Palmetto Bay', 'Pinecrest', 'South Beach', 'Brickell',
    'Downtown Miami', 'Wynwood', 'Little Havana', 'Coconut Grove', 'Key Biscayne', 'Fisher Island'
  ]

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Service Plus Locations
          </h2>
          <h3 className="text-2xl font-bold text-gray-800">
            We're Proud to Serve
          </h3>
          <p className="text-lg text-gray-600 mt-4 max-w-3xl mx-auto">
            Rapid Panda Movers provides professional moving services throughout Miami-Dade County and beyond. 
            No matter where you're moving within our service area, we're here to help.
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {locations.map((location, index) => (
            <div key={index} className="bg-white rounded-lg p-4 text-center shadow-sm hover:shadow-md transition-shadow">
              <MapPin className="w-5 h-5 text-orange-500 mx-auto mb-2" />
              <h4 className="font-medium text-gray-800 text-sm">{location}</h4>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
