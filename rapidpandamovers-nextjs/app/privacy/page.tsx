import { allContent } from '@/lib/data';
import Hero from '../components/Hero';

export const metadata = {
  title: 'Privacy Policy | Rapid Panda Movers',
  description: 'Privacy policy for Rapid Panda Movers. Learn how we collect, use, and protect your personal information.',
};

export default function PrivacyPage() {
  const privacy = allContent.privacy;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <Hero
        title={privacy.title}
        description="At Rapid Panda Movers, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services."
        cta="Get Your Free Quote"
      />

      {/* Content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto prose prose-lg">
            {privacy.sections.map((section, index) => (
              <div key={index} className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">{section.title}</h2>
                <p className="text-gray-600">{section.content}</p>
              </div>
            ))}

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Cookies and Tracking</h2>
              <p className="text-gray-600">
                We may use cookies and similar tracking technologies to track activity on our website and hold certain information. Cookies are files with a small amount of data which may include an anonymous unique identifier. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
              </p>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Data Security</h2>
              <p className="text-gray-600">
                We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure.
              </p>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Rights</h2>
              <p className="text-gray-600">
                You have the right to access, update, or delete your personal information at any time. You may also opt out of receiving promotional communications from us by following the unsubscribe instructions in those messages.
              </p>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Contact Us</h2>
              <p className="text-gray-600">
                If you have any questions about this Privacy Policy, please contact us at{' '}
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
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Changes to This Policy</h2>
              <p className="text-gray-600">
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
