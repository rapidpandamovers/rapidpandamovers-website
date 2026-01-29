import { Star } from 'lucide-react'

export default function TestimonialsSection() {
  const testimonials = [
    { name: 'Sarah Johnson', text: 'Amazing service! The team was professional, careful, and efficient. Highly recommend!', rating: 5 },
    { name: 'Mike Rodriguez', text: 'Best moving experience ever. They handled everything with care and were very affordable.', rating: 5 },
    { name: 'Lisa Chen', text: 'Stress-free move thanks to Rapid Panda Movers. Great communication throughout the process.', rating: 5 }
  ]

  return (
    <section className="py-20 bg-purple-900 text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Happy Customers Share Their Moving Journeys!
          </h2>
          <p className="text-lg text-purple-200 max-w-4xl mx-auto">
            Rapid Panda Movers has been trusted by hundreds of families and businesses for their relocation needs. Here's what our 
            satisfied customers have to say about their moving experience with our professional team.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-purple-800 rounded-lg p-6 text-center">
              <div className="flex justify-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-purple-100 mb-4 italic">"{testimonial.text}"</p>
              <p className="font-semibold">{testimonial.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
