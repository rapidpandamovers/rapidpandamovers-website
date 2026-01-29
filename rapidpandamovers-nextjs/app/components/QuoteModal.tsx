'use client'

import { useState } from 'react'
import { X, Mail, Phone, MapPin } from 'lucide-react'

interface QuoteModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function QuoteModal({ isOpen, onClose }: QuoteModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex">
          {/* Quote Form */}
          <div className="flex-1 p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Get Your Free Moving Quote</h2>
              <button 
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input 
                    type="text" 
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input 
                    type="text" 
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input 
                    type="tel" 
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Home Size
                  </label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent">
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                ></textarea>
              </div>
              
              <button type="submit" className="w-full bg-orange-500 text-white font-bold py-4 text-lg rounded-lg hover:bg-orange-600 transition-colors">
                Get My Free Quote
              </button>
            </form>
          </div>
          
          {/* Contact Info Sidebar */}
          <div className="w-80 bg-gray-50 p-6">
            <h3 className="text-xl font-bold mb-4">Contact Information</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-orange-500" />
                <div>
                  <p className="font-medium">(305) 555-0123</p>
                  <p className="text-sm text-gray-600">Mon-Sun: 8AM-8PM</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-orange-500" />
                <div>
                  <p className="font-medium">info@rapidpandamovers.com</p>
                  <p className="text-sm text-gray-600">24/7 email support</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-orange-500" />
                <div>
                  <p className="font-medium">Miami, FL</p>
                  <p className="text-sm text-gray-600">Serving all of Miami-Dade</p>
                </div>
              </div>
            </div>
            
            <div className="mt-8 bg-orange-500 text-white rounded-lg p-6">
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
  )
}
