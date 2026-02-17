import React from 'react';

interface TipSectionProps {
  title: string;
  description: string;
  categories: Array<{
    title: string;
    tips: string[];
  }>;
}

const TipSection: React.FC<TipSectionProps> = ({ title, description, categories }) => {
  const bgColors = ['bg-orange-50', 'bg-gray-50', 'bg-green-50', 'bg-blue-50', 'bg-orange-50', 'bg-gray-50']

  return (
    <section className="pt-20">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            {title}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {description}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <div key={index} className={`${bgColors[index % bgColors.length]} rounded-4xl p-8`}>
              <h3 className="text-2xl font-bold text-gray-800 mb-6">
                {category.title}
              </h3>
              <ul className="space-y-3">
                {category.tips.map((tip, tipIndex) => (
                  <li key={tipIndex} className="flex items-start bg-white rounded-xl p-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center mr-3 mt-0.5">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-gray-700 leading-relaxed">
                      {tip}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TipSection;
