import Image from 'next/image'
import Link from 'next/link'

interface AboutUsProps {
  className?: string
}

export default function AboutUs({ className = "" }: AboutUsProps) {
  return (
    <section className={`py-16 bg-white ${className}`}>
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                About Rapid Panda Moving
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                At Rapid Panda Movers, we understand that moving is more than just transporting belongings from one place to another. It's about helping families and businesses transition to new chapters in their lives with confidence and peace of mind.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                With years of experience serving the Miami-Dade community, we've built our reputation on reliability, professionalism, and exceptional customer service.
              </p>
              <Link 
                href="/about" 
                className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
              >
                Learn More About Us
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            
            <div className="flex justify-center">
              <Image 
                src="https://www.rapidpandamovers.com/wp-content/uploads/2024/11/about-us-rapid-panda.png" 
                alt="About Us - Rapid Panda Movers" 
                width={500} 
                height={400}
                className=""
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}