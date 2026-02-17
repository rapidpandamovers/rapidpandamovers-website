import {
  Shield, Users, DollarSign, Clock, Phone, CheckCircle,
  Award, Heart, Truck, Package,
  MapPin, Calendar, Headphones, FileCheck
} from 'lucide-react'
import Link from 'next/link'
import Hero from '../components/Hero'
import IncludedSection from '../components/IncludedSection'
import PromiseSection from '../components/PromiseSection'
import WhySection from '../components/WhySection'
import CompareTable from '../components/CompareTable'
import ReviewSection from '../components/ReviewSection'
import QuoteSection from '../components/QuoteSection'
import content from '@/data/content.json'

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

  const promiseCards = [
    {
      title: 'Before Your Move',
      desc: 'Free consultation, detailed quote, move planning assistance, and packing tips to help you prepare.'
    },
    {
      title: 'During Your Move',
      desc: 'Professional crews, careful handling, real-time updates, and on-site supervision for quality control.'
    },
    {
      title: 'After Your Move',
      desc: 'Follow-up call, satisfaction survey, and quick resolution of any concerns. We\'re here until you\'re settled.'
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

  const compareColumns = [
    { header: 'Rapid Panda' },
    { header: 'Other Movers' }
  ]

  const compareRows = [
    { option: 'Transparent Pricing', cells: ['Always included', 'Sometimes'], highlight: true },
    { option: 'Background-Checked Crews', cells: ['All staff verified', 'Varies'] },
    { option: 'On-Time Guarantee', cells: ['Guaranteed', 'Rarely offered'], highlight: true },
    { option: '24/7 Support', cells: ['Always available', 'Limited hours'] },
    { option: 'No Hidden Fees', cells: ['Written guarantee', 'Often fees added'], highlight: true },
    { option: 'Satisfaction Guarantee', cells: ['100% guaranteed', 'Limited or none'] },
  ]

  return (
    <div className="min-h-screen">
      <Hero
        title="Why Choose Rapid Panda Movers?"
        description="Miami's most trusted moving company. Licensed, insured, and committed to making your move stress-free."
        cta="Get Your Free Quote"
        image_url="https://www.rapidpandamovers.com/wp-content/uploads/2024/11/about-us-rapid-panda.png"
      />

      {/* Main Benefits */}
      <WhySection
        variant="detail"
        title="The Rapid Panda Difference"
        subtitle="We're not just another moving company. Here's what sets us apart and why thousands of Miami residents trust us with their moves."
        benefits={mainBenefits}
      />

      {/* Our Promise */}
      <PromiseSection cards={promiseCards} />

      {/* Reviews */}
      <ReviewSection
        variant="compact"
        title="What Our Customers Say"
        subtitle="Real reviews from real customers"
      />

      {/* Additional Reasons */}
      <IncludedSection
        title="More Reasons to Trust Us"
        items={additionalReasons}
        background="gray"
      />

      {/* Comparison */}
      <CompareTable
        title="How We Compare"
        columns={compareColumns}
        rows={compareRows}
      />

      {/* Compare Link */}
      <div className="text-center -mt-10 pt-20">
        <Link
          href="/compare"
          className="text-orange-500 hover:text-orange-600 font-medium inline-flex items-center"
        >
          See detailed comparisons with specific competitors →
        </Link>
      </div>

      

      {/* CTA */}
      <QuoteSection
        title="Ready to Experience the Difference?"
        subtitle="Join thousands of satisfied customers who chose Rapid Panda Movers for their Miami move."
      />
      
    </div>
  )
}
