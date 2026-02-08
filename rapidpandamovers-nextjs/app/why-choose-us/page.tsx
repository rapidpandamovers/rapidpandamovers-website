import {
  Shield, Users, DollarSign, Clock, Phone, CheckCircle,
  Award, Heart, Truck, Package, Star, ThumbsUp,
  MapPin, Calendar, Headphones, FileCheck
} from 'lucide-react'
import Link from 'next/link'
import Hero from '../components/Hero'
import ReviewSection from '../components/ReviewSection'
import QuoteSection from '../components/QuoteSection'

export const metadata = {
  title: 'Why Choose Rapid Panda Movers | Miami Moving Company',
  description: 'Discover why Miami residents trust Rapid Panda Movers. Licensed, insured, transparent pricing, experienced crews, and 100% satisfaction guaranteed.',
}

export default function WhyChooseUsPage() {
  const mainBenefits = [
    {
      icon: Shield,
      title: 'Licensed & Insured',
      desc: 'Full licensing and comprehensive insurance coverage for your peace of mind. We carry general liability and workers compensation insurance to protect you and your belongings.',
      details: ['Florida licensed mover', 'Full liability coverage', 'Workers compensation', 'Cargo insurance available']
    },
    {
      icon: Users,
      title: 'Experienced Team',
      desc: 'Professional movers with years of experience in local and long-distance moves. Every team member is background-checked, drug-tested, and professionally trained.',
      details: ['Background-checked staff', 'Ongoing training programs', 'Average 5+ years experience', 'Professional uniforms']
    },
    {
      icon: DollarSign,
      title: 'Transparent Pricing',
      desc: 'No hidden fees or surprise charges. Get honest, upfront pricing every time. We provide detailed written estimates so you know exactly what to expect.',
      details: ['Free in-home estimates', 'No hidden fees', 'Price match guarantee', 'Written quotes provided']
    },
    {
      icon: Clock,
      title: 'Reliable Scheduling',
      desc: 'On-time service with flexible scheduling options to fit your busy lifestyle. We show up when we say we will and keep you informed throughout.',
      details: ['On-time arrival guarantee', 'Flexible scheduling', 'Same-day availability', 'Weekend moves available']
    },
    {
      icon: Phone,
      title: '24/7 Customer Support',
      desc: 'Round-the-clock customer service to answer questions and provide assistance. From your first call to move completion, we\'re here for you.',
      details: ['24/7 phone support', 'Dedicated move coordinator', 'Real-time updates', 'Post-move follow-up']
    },
    {
      icon: CheckCircle,
      title: 'Satisfaction Guaranteed',
      desc: '100% satisfaction guarantee with every move. Your happiness is our priority. If something isn\'t right, we\'ll make it right.',
      details: ['100% satisfaction promise', 'Issue resolution guarantee', 'Quality assurance checks', 'Money-back guarantee']
    }
  ]

  const additionalReasons = [
    { icon: Award, title: 'Award-Winning Service', desc: 'Recognized for excellence in customer service and moving quality.' },
    { icon: Heart, title: 'Family-Owned Business', desc: 'We treat your move like we\'d treat our own family\'s move.' },
    { icon: Truck, title: 'Modern Equipment', desc: 'Well-maintained trucks and professional moving equipment.' },
    { icon: Package, title: 'Careful Handling', desc: 'Special care for fragile items, antiques, and valuables.' },
    { icon: MapPin, title: 'Local Expertise', desc: 'We know Miami inside and out - every neighborhood and building.' },
    { icon: Calendar, title: 'Flexible Options', desc: 'Full-service, labor-only, packing services, and more.' },
    { icon: Headphones, title: 'Personal Attention', desc: 'Dedicated coordinator assigned to your move from start to finish.' },
    { icon: FileCheck, title: 'Detailed Inventory', desc: 'Complete inventory documentation for your peace of mind.' }
  ]

  const stats = [
    { number: '10,000+', label: 'Moves Completed' },
    { number: '4.9/5', label: 'Customer Rating' },
    { number: '15+', label: 'Years Experience' },
    { number: '100%', label: 'Satisfaction Rate' }
  ]

  return (
    <div className="min-h-screen">
      <Hero
        title="Why Choose Rapid Panda Movers?"
        description="Miami's most trusted moving company. Licensed, insured, and committed to making your move stress-free."
        cta="Get Your Free Quote"
        image_url="https://www.rapidpandamovers.com/wp-content/uploads/2024/11/about-us-rapid-panda.png"
      />

      {/* Stats Section */}
      <section className="py-12 bg-orange-500">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-orange-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Benefits Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              The <span className="text-orange-500">Rapid Panda</span> Difference
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're not just another moving company. Here's what sets us apart and why thousands of Miami residents trust us with their moves.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mainBenefits.map((benefit, index) => {
              const IconComponent = benefit.icon
              return (
                <div key={index} className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 hover:border-orange-500 hover:shadow-lg transition-all">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-6">
                    <IconComponent className="w-8 h-8 text-orange-500" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">{benefit.title}</h3>
                  <p className="text-gray-600 mb-4">{benefit.desc}</p>
                  <ul className="space-y-2">
                    {benefit.details.map((detail, i) => (
                      <li key={i} className="flex items-center text-sm text-gray-500">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Our Promise Section */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Star className="w-16 h-16 text-orange-500 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Our Promise to You
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              When you choose Rapid Panda Movers, you're not just hiring a moving company - you're gaining a partner committed to making your transition as smooth as possible.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-600">
                <h3 className="text-lg font-bold text-white mb-2">Before Your Move</h3>
                <p className="text-gray-400 text-sm">
                  Free consultation, detailed quote, move planning assistance, and packing tips to help you prepare.
                </p>
              </div>
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-600">
                <h3 className="text-lg font-bold text-white mb-2">During Your Move</h3>
                <p className="text-gray-400 text-sm">
                  Professional crews, careful handling, real-time updates, and on-site supervision for quality control.
                </p>
              </div>
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-600">
                <h3 className="text-lg font-bold text-white mb-2">After Your Move</h3>
                <p className="text-gray-400 text-sm">
                  Follow-up call, satisfaction survey, and quick resolution of any concerns. We're here until you're settled.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Reasons Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              More Reasons to <span className="text-orange-500">Trust Us</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {additionalReasons.map((reason, index) => {
              const IconComponent = reason.icon
              return (
                <div key={index} className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-200 hover:border-orange-500 hover:shadow-md transition-all">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="w-6 h-6 text-orange-500" />
                  </div>
                  <h3 className="font-bold text-gray-800 mb-2">{reason.title}</h3>
                  <p className="text-gray-600 text-sm">{reason.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              How We <span className="text-orange-500">Compare</span>
            </h2>
            <p className="text-xl text-gray-600">
              See how Rapid Panda Movers stacks up against the competition
            </p>
          </div>

          <div className="max-w-4xl mx-auto overflow-x-auto">
            <table className="w-full border-collapse bg-white rounded-xl shadow-sm overflow-hidden">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-4 text-left font-bold text-gray-800">Feature</th>
                  <th className="p-4 text-center font-bold text-orange-500">Rapid Panda</th>
                  <th className="p-4 text-center font-bold text-gray-500">Other Movers</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="p-4 text-gray-700">Transparent Pricing</td>
                  <td className="p-4 text-center"><CheckCircle className="w-5 h-5 text-green-500 mx-auto" /></td>
                  <td className="p-4 text-center text-gray-400">Sometimes</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="p-4 text-gray-700">Background-Checked Crews</td>
                  <td className="p-4 text-center"><CheckCircle className="w-5 h-5 text-green-500 mx-auto" /></td>
                  <td className="p-4 text-center text-gray-400">Varies</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="p-4 text-gray-700">On-Time Guarantee</td>
                  <td className="p-4 text-center"><CheckCircle className="w-5 h-5 text-green-500 mx-auto" /></td>
                  <td className="p-4 text-center text-gray-400">Rarely</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="p-4 text-gray-700">24/7 Support</td>
                  <td className="p-4 text-center"><CheckCircle className="w-5 h-5 text-green-500 mx-auto" /></td>
                  <td className="p-4 text-center text-gray-400">Limited</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="p-4 text-gray-700">No Hidden Fees</td>
                  <td className="p-4 text-center"><CheckCircle className="w-5 h-5 text-green-500 mx-auto" /></td>
                  <td className="p-4 text-center text-gray-400">Often fees</td>
                </tr>
                <tr>
                  <td className="p-4 text-gray-700">Satisfaction Guarantee</td>
                  <td className="p-4 text-center"><CheckCircle className="w-5 h-5 text-green-500 mx-auto" /></td>
                  <td className="p-4 text-center text-gray-400">Limited</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="text-center mt-8">
            <Link
              href="/compare"
              className="text-orange-500 hover:text-orange-600 font-medium inline-flex items-center"
            >
              See detailed comparisons with specific competitors
              <ThumbsUp className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <ReviewSection
        title="What Our Customers Say"
        subtitle="Real reviews from real customers"
        limit={3}
      />

      {/* CTA Section */}
      <QuoteSection
        title="Ready to Experience the Difference?"
        subtitle="Join thousands of satisfied customers who chose Rapid Panda Movers for their Miami move."
      />

    </div>
  )
}
