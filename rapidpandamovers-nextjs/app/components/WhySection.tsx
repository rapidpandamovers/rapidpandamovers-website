import { Shield, Users, DollarSign, Clock, Phone, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function WhySection() {
  const benefits = [
    { icon: Shield, title: 'Licensed & Insured', desc: 'Full licensing and comprehensive insurance coverage for your peace of mind.' },
    { icon: Users, title: 'Experienced Team', desc: 'Professional movers with years of experience in local and long-distance moves.' },
    { icon: DollarSign, title: 'Transparent Pricing', desc: 'No hidden fees or surprise charges. Get honest, upfront pricing every time.' },
    { icon: Clock, title: 'Reliable Scheduling', desc: 'On-time service with flexible scheduling options to fit your busy lifestyle.' },
    { icon: Phone, title: '24/7 Customer Support', desc: 'Round-the-clock customer service to answer questions and provide assistance.' },
    { icon: CheckCircle, title: 'Satisfaction Guaranteed', desc: '100% satisfaction guarantee with every move. Your happiness is our priority.' }
  ]

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
            Why Choose <span className="text-orange-500">Rapid Panda Movers</span>?
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => {
            const IconComponent = benefit.icon
            return (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <IconComponent className="w-8 h-8 text-orange-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.desc}</p>
              </div>
            )
          })}
        </div>
        
        <div className="text-center mt-12">
          <Link href="/about" className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-8 rounded-lg transition-colors">
            Learn More About Us
          </Link>
        </div>
      </div>
    </section>
  )
}
