import { allContent } from '@/lib/data';
import Hero from '../components/Hero';

export const metadata = {
  title: 'Terms & Conditions | Rapid Panda Movers',
  description: 'Terms and conditions for Rapid Panda Movers. Read our terms and conditions for using our moving services.',
};

export default function TermsPage() {
  const terms = allContent.terms;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <Hero
        title={terms.title}
        description="Welcome to Rapid Panda Movers. By accessing our website or using our services, you agree to be bound by these Terms & Conditions. Please read them carefully before using our services."
        cta="Get Your Free Quote"
      />

      {/* Content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto prose prose-lg">
            {terms.sections.map((section, index) => (
              <div key={index} className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">{section.title}</h2>
                <p className="text-gray-600">{section.content}</p>
              </div>
            ))}

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Booking and Cancellation</h2>
              <p className="text-gray-600">
                All bookings are subject to availability. We recommend booking at least 2 weeks in advance for local moves and 4 weeks for long-distance moves. Cancellations made less than 48 hours before the scheduled move may be subject to a cancellation fee.
              </p>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Customer Responsibilities</h2>
              <p className="text-gray-600">
                Customers are responsible for ensuring that all items to be moved are properly packed unless packing services have been purchased. Customers must disclose any items that require special handling, including but not limited to fragile items, antiques, or items of exceptional value.
              </p>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Insurance and Claims</h2>
              <p className="text-gray-600">
                Basic coverage is included with all moves. Additional insurance options are available for purchase. Any claims for damage must be reported within 24 hours of delivery. We are not responsible for damage to items that were improperly packed by the customer.
              </p>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Prohibited Items</h2>
              <p className="text-gray-600">
                We do not transport hazardous materials, perishable food items, plants, pets, or illegal substances. Firearms and ammunition must be transported by the customer. We reserve the right to refuse to transport any item we deem unsafe or inappropriate.
              </p>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Dispute Resolution</h2>
              <p className="text-gray-600">
                Any disputes arising from our services shall first be addressed through direct communication with our customer service team. If a resolution cannot be reached, disputes may be subject to mediation or arbitration in accordance with Florida state law.
              </p>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Contact Us</h2>
              <p className="text-gray-600">
                If you have any questions about these Terms & Conditions, please contact us at{' '}
                <a href="mailto:info@rapidpandamovers.com" className="text-orange-500 hover:text-orange-600">
                  info@rapidpandamovers.com
                </a>{' '}
                or call us at{' '}
                <a href="tel:786-585-4269" className="text-orange-500 hover:text-orange-600">
                  (786) 585-4269
                </a>.
              </p>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Changes to Terms</h2>
              <p className="text-gray-600">
                We reserve the right to modify these Terms & Conditions at any time. Changes will be effective immediately upon posting to our website. Your continued use of our services after any changes indicates your acceptance of the new terms.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
