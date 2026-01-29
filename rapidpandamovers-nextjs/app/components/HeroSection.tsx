import { CheckCircle } from 'lucide-react'

export default function HeroSection() {
  return (
    <section className="relative bg-cover bg-center min-h-[700px] flex items-center" style={{
      backgroundImage: "url('https://www.rapidpandamovers.com/wp-content/uploads/2024/10/Rectangle-39-scaled.jpg')"
    }}>
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-white">
            {/* Main Heading */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-center lg:text-left leading-tight">
              <span className="block">YOUR</span>
              <span className="block text-orange-400">MIAMI MOVERS</span>
              <span className="block">WHO CARE</span>
            </h1>
            
            {/* Checklist Items */}
            <div className="space-y-4 mb-8 text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start space-x-3">
                <CheckCircle className="w-5 h-5 text-orange-400" />
                <span className="text-lg">Serving All of Miami-Dade County</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start space-x-3">
                <CheckCircle className="w-5 h-5 text-orange-400" />
                <span className="text-lg">Stress-Free Moves, Guaranteed</span>
              </div>
            </div>
          </div>
          
          {/* Quote Form */}
          <div className="bg-white rounded-lg shadow-xl p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Get Your Free Quote</h3>
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input 
                  type="text" 
                  placeholder="First Name" 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <input 
                  type="text" 
                  placeholder="Last Name" 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <input 
                type="email" 
                placeholder="Email Address" 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <input 
                type="tel" 
                placeholder="Phone Number" 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input 
                  type="text" 
                  placeholder="Moving From" 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <input 
                  type="text" 
                  placeholder="Moving To" 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <input 
                type="date" 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-4 px-6 rounded-lg transition-colors">
                Get Free Quote
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
