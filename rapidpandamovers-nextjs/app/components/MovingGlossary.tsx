"use client";

import React, { useState, useRef } from 'react';

interface MovingGlossaryProps {
  title: string;
  description: string;
  terms: Array<{
    term: string;
    definition: string;
  }>;
}

const MovingGlossary: React.FC<MovingGlossaryProps> = ({ title, description, terms }) => {
  // Sort terms alphabetically by term name
  const sortedTerms = [...terms].sort((a, b) => a.term.localeCompare(b.term));
  const [activeLetter, setActiveLetter] = useState<string>('');
  const termsRef = useRef<HTMLDivElement>(null);

  // Get all unique first letters from terms
  const firstLetters = Array.from(new Set(sortedTerms.map(term => term.term.charAt(0).toUpperCase()))).sort();

  // Function to scroll to first term with selected letter
  const scrollToLetter = (letter: string) => {
    setActiveLetter(letter);
    const firstTermWithLetter = sortedTerms.find(term => 
      term.term.charAt(0).toUpperCase() === letter
    );
    
    if (firstTermWithLetter && termsRef.current) {
      const termIndex = sortedTerms.findIndex(term => term.term === firstTermWithLetter.term);
      const termElement = termsRef.current.children[termIndex] as HTMLElement;
      if (termElement) {
        termElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start',
          inline: 'nearest'
        });
      }
    }
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {title}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {description}
            </p>
          </div>

          {/* Letter Navigation Bar */}
          <div className="mb-12">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
                Jump to Letter
              </h3>
              <div className="flex flex-wrap justify-center gap-2">
                {firstLetters.map((letter) => (
                  <button
                    key={letter}
                    onClick={() => scrollToLetter(letter)}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                      activeLetter === letter
                        ? 'bg-orange-500 text-white shadow-lg transform scale-105'
                        : 'bg-gray-100 text-gray-700 hover:bg-orange-100 hover:text-orange-600'
                    }`}
                  >
                    {letter}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Terms Grid */}
          <div ref={termsRef} className="grid md:grid-cols-2 gap-8">
            {sortedTerms.map((item: { term: string; definition: string }, index: number) => (
              <div 
                key={index} 
                className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow"
                data-letter={item.term.charAt(0).toUpperCase()}
              >
                <h3 className="text-xl font-bold text-orange-500 mb-4">
                  {item.term}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {item.definition}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MovingGlossary;
