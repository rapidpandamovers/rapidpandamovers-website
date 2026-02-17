'use client'

import { useState, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import content from '@/data/content.json';

interface GlossarySectionProps {
  className?: string;
  variant?: 'preview' | 'full';
}

export default function GlossarySection({ className = "", variant = 'preview' }: GlossarySectionProps) {
  const glossaryData = content.glossary;
  const sortedTerms = [...glossaryData.terms].sort((a, b) => a.term.localeCompare(b.term));
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

  // Full variant - complete interactive glossary
  if (variant === 'full') {
    return (
      <section className={`pt-20 ${className}`}>
        <div className="container mx-auto">
          <div className="mx-auto">

            {/* Letter Navigation Bar */}
            <div className="mb-12">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
                  Jump to Letter
                </h3>
                <div className="flex flex-wrap justify-center gap-2">
                  {firstLetters.map((letter) => (
                    <button
                      key={letter}
                      onClick={() => scrollToLetter(letter)}
                      className={`px-3 py-2 rounded-lg font-medium text-sm transition-all ${
                        activeLetter === letter
                          ? 'bg-orange-500 text-white'
                          : 'bg-white border border-gray-200 text-gray-700 hover:border-orange-500 hover:text-orange-600'
                      }`}
                    >
                      {letter}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Terms Grid */}
            <div ref={termsRef} className="grid md:grid-cols-2 gap-6">
              {sortedTerms.map((item: { term: string; definition: string }, index: number) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-4xl p-8"
                  data-letter={item.term.charAt(0).toUpperCase()}
                >
                  <h3 className="text-xl font-bold mb-3">
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
  }

  // Preview variant - shows a few sample terms with link to full glossary
  const sampleTerms = sortedTerms.slice(0, 3);

  return (
    <section className={`py-16 ${className}`}>
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Moving Glossary
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            New to moving? Learn the terminology used in the moving industry to better understand your move and communicate with your movers.
          </p>
        </div>

        <div className="bg-gray-50 rounded-4xl p-8">
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {sampleTerms.map((item, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 text-left">
                <h3 className="text-lg font-bold text-orange-500 mb-2">
                  {item.term}
                </h3>
                <p className="text-gray-600 text-sm line-clamp-2">
                  {item.definition}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/moving-glossary"
              className="inline-flex items-center bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              View Full Glossary
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
