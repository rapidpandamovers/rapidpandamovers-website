"use client";

import React, { useState, useRef } from 'react';
import Hero from '../components/Hero';
import ResourceSection from '../components/ResourceSection';
import QuoteSection from '../components/QuoteSection';
import content from '../../data/content.json';

export default function MovingGlossaryPage() {
  const glossaryData = content.glossary;

  // Sort terms alphabetically by term name
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

  return (
    <div>
      <Hero
        title={glossaryData.title}
        description={glossaryData.description}
        cta="Get Your Free Quote"
        image_url="https://www.rapidpandamovers.com/wp-content/uploads/2024/11/about-us-rapid-panda.png"
      />

      <section className="py-16">
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
            <div ref={termsRef} className="grid md:grid-cols-2 gap-8">
              {sortedTerms.map((item: { term: string; definition: string }, index: number) => (
                <div
                  key={index}
                  className="bg-white rounded-4xl p-6 shadow-sm border border-gray-200 hover:border-orange-500 hover:shadow-md transition-all"
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

      {/* Resources Section */}
      <ResourceSection
        title="More Moving Resources"
        subtitle="Explore our comprehensive guides and services for a successful move"
        variant="grid"
      />

      <QuoteSection
        title="Need Help With Your Move?"
        subtitle="Now that you know the terminology, let us handle the logistics. Get a free quote today."
      />
    </div>
  );
}
