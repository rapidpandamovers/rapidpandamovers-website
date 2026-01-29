import { Mail, Phone, MapPin } from 'lucide-react'

export default function QuotePage() {
  return (
    <div className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Get Your Free Moving Quote
            </h1>
            <p className="text-xl text-gray-600">
              Fill out the form below and we'll provide you with a detailed, 
              no-obligation quote within 24 hours.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Quote Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold mb-6">Tell Us About Your Move</h2>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name *
                      </label>
                      <input 
                        type="text" 
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name *
                      </label>
                      <input 
                        type="text" 
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input 
                        type="email" 
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <input 
                        type="tel" 
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Moving From *
                      </label>
                      <input 
                        type="text" 
                        placeholder="Address or ZIP code"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Moving To *
                      </label>
                      <input 
                        type="text" 
                        placeholder="Address or ZIP code"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Preferred Moving Date
                      </label>
                      <input 
                        type="date" 
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Home Size
                      </label>
                      <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                        <option value="">Select home size</option>
                        <option value="studio">Studio Apartment</option>
                        <option value="1br">1 Bedroom</option>
                        <option value="2br">2 Bedroom</option>
                        <option value="3br">3 Bedroom</option>
                        <option value="4br">4+ Bedroom</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Services Needed (check all that apply)
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {[
                        'Packing',
                        'Loading/Unloading',
                        'Transportation',
                        'Unpacking',
                        'Furniture Assembly',
                        'Storage'
                      ].map((service) => (
                        <label key={service} className="flex items-center">
                          <input type="checkbox" className="mr-2" />
                          <span className="text-sm">{service}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Additional Details
                    </label>
                    <textarea 
                      rows={4}
                      placeholder="Tell us about any special requirements, fragile items, or other details..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    ></textarea>
                  </div>
                  
                  <button type="submit" className="w-full btn-primary py-4 text-lg">
                    Get My Free Quote
                  </button>
                </form>
              </div>
            </div>
            
            {/* Contact Info */}
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-primary-600" />
                    <div>
                      <p className="font-medium">(305) 555-0123</p>
                      <p className="text-sm text-gray-600">Mon-Sun: 8AM-8PM</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-primary-600" />
                    <div>
                      <p className="font-medium">info@rapidpandamovers.com</p>
                      <p className="text-sm text-gray-600">24/7 email support</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-primary-600" />
                    <div>
                      <p className="font-medium">Miami, FL</p>
                      <p className="text-sm text-gray-600">Serving all of Miami-Dade</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-primary-600 text-white rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4">Why Choose Us?</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <span className="inline-block w-2 h-2 bg-white rounded-full mr-3 mt-2"></span>
                    No hidden fees or surprise charges
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-2 h-2 bg-white rounded-full mr-3 mt-2"></span>
                    Licensed and fully insured
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-2 h-2 bg-white rounded-full mr-3 mt-2"></span>
                    Professional, experienced team
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-2 h-2 bg-white rounded-full mr-3 mt-2"></span>
                    Free quotes within 24 hours
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-2 h-2 bg-white rounded-full mr-3 mt-2"></span>
                    Same-day service available
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}