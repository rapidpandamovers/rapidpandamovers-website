'use client'

import { useState, useRef } from 'react';
import { Link } from '@/i18n/routing';
import { ArrowRight } from 'lucide-react';
import { useMessages } from 'next-intl';
import { H2, H3 } from '@/app/components/Heading';

interface GlossarySectionProps {
  className?: string;
  variant?: 'preview' | 'full';
}

export default function GlossarySection({ className = "", variant = 'preview' }: GlossarySectionProps) {
  const { content, ui } = useMessages() as any
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
                <H3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
                  {ui.glossary.jumpToLetter}
                </H3>
                <div className="flex flex-wrap justify-center gap-2">
                  {firstLetters.map((letter) => (
                    <button
                      key={letter}
                      onClick={() => scrollToLetter(letter)}
                      className={`px-3 py-2 rounded-lg font-medium text-sm transition-all ${
                        activeLetter === letter
                          ? 'bg-orange-600 text-white text-shadow-sm'
                          : 'bg-white border border-gray-200 text-gray-700 hover:border-orange-600 hover:text-orange-600'
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
                  className="bg-gray-50 rounded-4xl p-6 md:p-8"
                  data-letter={item.term.charAt(0).toUpperCase()}
                >
                  <H3 className="text-xl font-bold mb-3">
                    {item.term}
                  </H3>
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
        <div className="text-center mb-12 px-6 md:px-0">
          <H2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            {ui.glossary.previewTitle}
          </H2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {ui.glossary.previewDescription}
          </p>
        </div>

        <div className="bg-gray-50 rounded-4xl p-6 md:p-8">
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {sampleTerms.map((item, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 text-left">
                <H3 className="text-lg font-bold text-orange-600 mb-2">
                  {item.term}
                </H3>
                <p className="text-gray-600 text-sm line-clamp-2">
                  {item.definition}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/moving-glossary"
              className="inline-flex items-center bg-orange-600 hover:bg-orange-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors text-shadow-sm"
            >
              {ui.buttons.viewFullGlossary}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
