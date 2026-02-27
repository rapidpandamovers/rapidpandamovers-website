import { CheckCircle, XCircle, DollarSign, Star } from 'lucide-react';
import { getMessages } from 'next-intl/server';
import { H3 } from '@/app/components/Heading';

interface CompareSectionProps {
  name: string;
  pros: string[];
  cons: string[];
  proTitle?: string;
  conTitle?: string;
  bestFor?: string[];
  costComparison?: string;
  className?: string;
}

const bgColors = ['bg-orange-50', 'bg-gray-50']

export default async function CompareSection({
  name,
  pros,
  cons,
  proTitle,
  conTitle,
  bestFor,
  costComparison,
  className = '',
}: CompareSectionProps) {
  const { ui } = (await getMessages()) as any;
  return (
    <section className={`pt-20 ${className}`}>
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Pros */}
          <div className={`${bgColors[0]} rounded-4xl p-6 md:p-8`}>
            <H3 className="text-xl font-bold text-gray-800 mb-4">
              {proTitle || `${name} Pros`}
            </H3>
            <ul className="space-y-3">
              {pros.map((pro, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{pro}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Cons */}
          <div className={`${bgColors[1]} rounded-4xl p-6 md:p-8`}>
            <H3 className="text-xl font-bold text-gray-800 mb-4">
              {conTitle || `${name} Cons`}
            </H3>
            <ul className="space-y-3">
              {cons.map((con, index) => (
                <li key={index} className="flex items-start">
                  <XCircle className="w-4 h-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{con}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Best For (optional) */}
        {bestFor && bestFor.length > 0 && (
          <div className={`${bgColors[0]} rounded-4xl p-6 md:p-8 mt-8`}>
            <H3 className="text-xl font-bold text-gray-800 mb-4">
              {ui.compare.bestFor.replace('{name}', name)}
            </H3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {bestFor.map((item, index) => (
                <li key={index} className="flex items-center text-gray-700">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Cost Comparison (optional) */}
        {costComparison && (
          <div className={`${bgColors[1]} rounded-4xl p-6 md:p-8 mt-8`}>
            <H3 className="text-xl font-bold text-gray-800 mb-4">
              {ui.compare.realCostComparison}
            </H3>
            <p className="text-gray-700">{costComparison}</p>
          </div>
        )}
      </div>
    </section>
  );
}
