import Link from 'next/link'

export default function FAQSection() {
  const faqs = [
    { q: 'How much will my move cost?', a: 'Moving costs depend on several factors including distance, size of move, and services needed. Contact us for a free, accurate quote.' },
    { q: 'What happens if something gets damaged?', a: 'We are fully licensed and insured. All moves are covered by our comprehensive insurance policy for your peace of mind.' },
    { q: 'How can I prepare for my move?', a: 'Start by decluttering, gather packing supplies, and confirm your moving date. We provide a complete moving checklist to help you prepare.' },
    { q: 'Do you offer same-day moving services?', a: 'Yes! We offer same-day and emergency moving services throughout Miami-Dade County, subject to availability.' }
  ]

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            HAVE A <span className="text-orange-500">QUESTION</span>?
          </h2>
          <p className="text-xl text-gray-600">
            Frequently Asked Questions
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-gray-200 rounded-lg">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{faq.q}</h3>
                  <p className="text-gray-600">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link href="/contact" className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-8 rounded-lg transition-colors">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
