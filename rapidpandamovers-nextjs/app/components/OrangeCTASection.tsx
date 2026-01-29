import Link from 'next/link'

export default function OrangeCTASection() {
  return (
    <section className="py-16">
      <div className="container mx-auto bg-orange-500 rounded-4xl p-16 text-center text-white">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          We're a Miami Moving Company Offering Moving
        </h2>
        <h3 className="text-2xl md:text-3xl font-bold mb-6">
          Services Across Florida
        </h3>
        <p className="text-lg mb-8 max-w-4xl mx-auto leading-relaxed">
          At Rapid Panda Movers, we're dedicated to providing exceptional moving services throughout Florida. 
          Whether you're relocating within Miami or moving across the state, our experienced team ensures 
          a smooth, stress-free transition to your new home or office.
        </p>
        <Link href="/services" className="bg-white text-orange-500 font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors">
          View All Services
        </Link>
      </div>
    </section>
  )
}
