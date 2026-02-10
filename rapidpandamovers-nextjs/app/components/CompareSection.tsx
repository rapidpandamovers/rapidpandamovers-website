import { CheckCircle, XCircle, DollarSign } from 'lucide-react';

interface CompareSectionProps {
  name: string;
  pros: string[];
  cons: string[];
  proTitle?: string;
  conTitle?: string;
  bestFor?: string[];
  costComparison?: string;
}

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
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Pros */}
        <div className="bg-green-50 rounded-4xl p-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            {proTitle || `${name} Pros`}
          </h3>
          <ul className="space-y-3">
            {pros.map((pro, index) => (
              <li key={index} className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">{pro}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Cons */}
        <div className="bg-red-50 rounded-4xl p-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            {conTitle || `${name} Cons`}
          </h3>
          <ul className="space-y-3">
            {cons.map((con, index) => (
              <li key={index} className="flex items-start">
                <XCircle className="w-5 h-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">{con}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Best For (optional) */}
      {bestFor && bestFor.length > 0 && (
        <div className="bg-blue-50 rounded-4xl p-8 mt-12">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            {name} Is Best For:
          </h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {bestFor.map((item, index) => (
              <li key={index} className="flex items-center text-gray-700">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Cost Comparison (optional) */}
      {costComparison && (
        <div className="bg-gray-100 rounded-4xl p-8 mt-12">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <DollarSign className="w-6 h-6 text-orange-500 mr-2" />
            The Real Cost Comparison
          </h3>
          <p className="text-gray-700">{costComparison}</p>
        </div>
      )}
    </>
  );
}
