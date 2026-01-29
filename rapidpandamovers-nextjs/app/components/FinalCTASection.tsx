import { Truck, Package } from 'lucide-react'
import Link from 'next/link'

export default function FinalCTASection() {
  return (
    <section className="py-20 bg-gray-900 text-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Enjoy a Stress-Free Move with <span className="text-orange-400">Rapid Panda Movers</span>
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Ready to experience the difference professional movers make? Contact us today for your free quote 
              and let us handle the heavy lifting while you focus on your new beginning.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/quote" className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-4 px-8 rounded-lg transition-colors text-center">
                Get Free Quote
              </Link>
              <a href="tel:(305)555-0123" className="border border-white text-white font-semibold py-4 px-8 rounded-lg hover:bg-white hover:text-gray-900 transition-colors text-center">
                Call (305) 555-0123
              </a>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {/* Placeholder for moving images - you can replace with actual images */}
            <div className="bg-gray-700 rounded-lg h-48 flex items-center justify-center">
              <Truck className="w-12 h-12 text-gray-400" />
            </div>
            <div className="bg-gray-700 rounded-lg h-48 flex items-center justify-center">
              <Package className="w-12 h-12 text-gray-400" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
