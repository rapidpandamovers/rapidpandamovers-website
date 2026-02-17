import { CheckCircle, XCircle, DollarSign, Star } from 'lucide-react';

interface CompareSectionProps {
  name: string;
  pros: string[];
  cons: string[];
  proTitle?: string;
  conTitle?: string;
  bestFor?: string[];
  costComparison?: string;
}

const bgColors = ['bg-orange-50', 'bg-gray-50']

export default function CompareSection({
  name,
  pros,
  cons,
  proTitle,
  conTitle,
  bestFor,
  costComparison,
}: CompareSectionProps) {
  return (
    <section className="pt-20">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Pros */}
          <div className={`${bgColors[0]} rounded-4xl p-8`}>
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              {proTitle || `${name} Pros`}
            </h3>
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
          <div className={`${bgColors[1]} rounded-4xl p-8`}>
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              {conTitle || `${name} Cons`}
            </h3>
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
          <div className={`${bgColors[0]} rounded-4xl p-8 mt-8`}>
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              {name} Is Best For:
            </h3>
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
          <div className={`${bgColors[1]} rounded-4xl p-8 mt-8`}>
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              The Real Cost Comparison
            </h3>
            <p className="text-gray-700">{costComparison}</p>
          </div>
        )}
      </div>
    </section>
  );
}
