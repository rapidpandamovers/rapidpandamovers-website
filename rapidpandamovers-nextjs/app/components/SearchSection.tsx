'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Truck, Navigation, X, FileText } from 'lucide-react';
import Link from 'next/link';
import { getAllActiveCities, getAllActiveServices, allRoutes, allLocalRoutes, titleCase } from '@/lib/data';

interface SearchResult {
  type: 'city' | 'neighborhood' | 'service' | 'route' | 'blog';
  name: string;
  slug: string;
  description?: string;
}

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
}

interface SearchSectionProps {
  placeholder?: string;
  showBackground?: boolean;
  posts?: BlogPost[];
}

export default function SearchSection({
  placeholder = 'Search locations, services, routes, or blog posts...',
  showBackground = true,
  posts = []
}: SearchSectionProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Get all searchable data
  const cities = getAllActiveCities();
  const services = getAllActiveServices();
  const routes = [...allRoutes, ...allLocalRoutes].filter((r: any) => r.is_active !== false);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const searchQuery = query.toLowerCase();
    const searchResults: SearchResult[] = [];

    // Search cities
    cities.forEach(city => {
      if (city.name.toLowerCase().includes(searchQuery) ||
          city.slug.toLowerCase().includes(searchQuery)) {
        searchResults.push({
          type: 'city',
          name: `${city.name} Movers`,
          slug: `/${city.slug}-movers`,
          description: `Moving services in ${city.name}`
        });
      }
    });

    // Search services
    services.forEach(service => {
      if (service.name.toLowerCase().includes(searchQuery) ||
          service.slug.toLowerCase().includes(searchQuery)) {
        searchResults.push({
          type: 'service',
          name: service.name,
          slug: `/${service.slug}`,
          description: service.description
        });
      }
    });

    // Search routes
    routes.slice(0, 500).forEach((route: any) => {
      const originName = titleCase(route.origin_name);
      const destName = titleCase(route.destination_name);
      const routeName = `${originName} to ${destName}`;

      if (routeName.toLowerCase().includes(searchQuery) ||
          route.origin_name.toLowerCase().includes(searchQuery) ||
          route.destination_name.toLowerCase().includes(searchQuery)) {
        searchResults.push({
          type: 'route',
          name: routeName,
          slug: `/${route.slug}-movers`,
          description: `${route.distance_mi} miles`
        });
      }
    });

    // Search blog posts (if provided)
    if (posts.length > 0) {
      posts.forEach(post => {
        if (post.title.toLowerCase().includes(searchQuery) ||
            post.slug.toLowerCase().includes(searchQuery) ||
            post.excerpt.toLowerCase().includes(searchQuery) ||
            post.category.toLowerCase().includes(searchQuery)) {
          searchResults.push({
            type: 'blog',
            name: post.title,
            slug: `/blog/${post.slug}`,
            description: post.category
          });
        }
      });
    }

    // Limit results and sort by relevance
    const limitedResults = searchResults
      .sort((a, b) => {
        // Prioritize exact matches
        const aExact = a.name.toLowerCase().startsWith(searchQuery) ? 0 : 1;
        const bExact = b.name.toLowerCase().startsWith(searchQuery) ? 0 : 1;
        return aExact - bExact;
      })
      .slice(0, 8);

    setResults(limitedResults);
    setIsOpen(limitedResults.length > 0);
    setActiveIndex(-1);
  }, [query]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex(prev => (prev < results.length - 1 ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex(prev => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (activeIndex >= 0 && results[activeIndex]) {
          window.location.href = results[activeIndex].slug;
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setQuery('');
        inputRef.current?.blur();
        break;
    }
  };

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (resultsRef.current && !resultsRef.current.contains(e.target as Node) &&
          inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'city':
      case 'neighborhood':
        return <MapPin className="w-5 h-5 text-orange-500" />;
      case 'service':
        return <Truck className="w-5 h-5 text-orange-500" />;
      case 'route':
        return <Navigation className="w-5 h-5 text-orange-500" />;
      case 'blog':
        return <FileText className="w-5 h-5 text-orange-500" />;
      default:
        return <Search className="w-5 h-5 text-orange-500" />;
    }
  };

  const content = (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query.length >= 2 && results.length > 0 && setIsOpen(true)}
          placeholder={placeholder}
          className="w-full pl-12 pr-10 py-4 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent shadow-sm"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setResults([]);
              setIsOpen(false);
              inputRef.current?.focus();
            }}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Results dropdown */}
      {isOpen && results.length > 0 && (
        <div
          ref={resultsRef}
          className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden"
        >
          {results.map((result, index) => (
            <Link
              key={`${result.type}-${result.slug}`}
              href={result.slug}
              className={`flex items-center px-4 py-3 hover:bg-orange-50 transition-colors ${
                index === activeIndex ? 'bg-orange-50' : ''
              } ${index !== results.length - 1 ? 'border-b border-gray-100' : ''}`}
              onClick={() => setIsOpen(false)}
            >
              <div className="flex-shrink-0 mr-3">
                {getIcon(result.type)}
              </div>
              <div className="flex-grow min-w-0">
                <p className="font-medium text-gray-800 truncate">{result.name}</p>
                {result.description && (
                  <p className="text-sm text-gray-500 truncate">{result.description}</p>
                )}
              </div>
              <div className="flex-shrink-0 ml-3">
                <span className="text-xs text-gray-400 uppercase">{result.type}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );

  if (!showBackground) {
    return content;
  }

  return (
    <section className="py-12">
      <div className="container mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            Find Your <span className="text-orange-500">Moving Service</span>
          </h2>
          <p className="text-gray-600">
            Search for locations, services, routes, or blog posts
          </p>
        </div>
        {content}
      </div>
    </section>
  );
}
