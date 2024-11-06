import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search as SearchIcon, Filter, Award, RefreshCw, AlertCircle } from 'lucide-react';
import { EmptyState } from '../components/EmptyState';
import api from '../config/axios';

const categories = [
  { id: 'all', name: 'All Categories' },
  { id: 'finance', name: 'Finance' },
  { id: 'shopping', name: 'Shopping' },
  { id: 'crypto', name: 'Crypto' },
  { id: 'rewards', name: 'Rewards' },
];

const platforms = [
  {
    id: 'chase-sapphire',
    name: 'Chase Sapphire Preferred',
    category: 'finance',
    logo: 'https://images.unsplash.com/photo-1622186477895-f2af6a0f5a97?auto=format&fit=crop&w=64&h=64',
    deal: '60,000 Points Bonus',
    topUser: {
      name: 'Sarah M.',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=32&h=32',
      score: 95
    }
  },
  {
    id: 'amex-platinum',
    name: 'Amex Platinum',
    category: 'finance',
    logo: 'https://images.unsplash.com/photo-1622186477895-f2af6a0f5a97?auto=format&fit=crop&w=64&h=64',
    deal: '150,000 Points Bonus',
    topUser: {
      name: 'John D.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=32&h=32',
      score: 88
    }
  },
  // Add more platforms...
];

interface Platform {
  id: string;
  name: string;
  category: string;
  logo: string;
  deal: string;
  topUser: {
    name: string;
    avatar: string;
    score: number;
  };
}

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [platforms, setPlatforms] = useState<Platform[]>([]);

  // Initialize search query and category from URL params
  useEffect(() => {
    const queryParam = searchParams.get('q') || '';
    const categoryParam = searchParams.get('category') || 'all';
    setSearchQuery(queryParam);
    setSelectedCategory(categoryParam);
  }, [searchParams]);

  // Handle search input change
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setSearchQuery(newQuery);
    if (newQuery) {
      setSearchParams({ q: newQuery, category: selectedCategory });
    } else {
      setSearchParams({ category: selectedCategory });
    }
  }, [setSearchParams, selectedCategory]);

  // Handle category selection
  const handleCategoryChange = useCallback((categoryId: string) => {
    setSelectedCategory(categoryId);
    if (searchQuery) {
      setSearchParams({ q: searchQuery, category: categoryId });
    } else {
      setSearchParams({ category: categoryId });
    }
  }, [searchQuery, setSearchParams]);

  // Fetch platforms with search and filters
  const fetchFilteredPlatforms = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/api/platforms', {
        params: {
          search: searchQuery,
          category: selectedCategory !== 'all' ? selectedCategory : undefined
        }
      });
      setPlatforms(response.data.platforms);
    } catch (error) {
      console.error('Error fetching platforms:', error);
      setError('Failed to load platforms');
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, selectedCategory]);

  useEffect(() => {
    fetchFilteredPlatforms();
  }, [fetchFilteredPlatforms]);

  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-6">Find Referral Codes</h1>
          <div className="relative">
            <SearchIcon className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search platforms or paste a referral link..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="w-5 h-5 text-gray-600" />
                <h2 className="font-semibold">Filters</h2>
              </div>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryChange(category.id)}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-indigo-50 text-indigo-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin" />
              </div>
            ) : error ? (
              <EmptyState
                icon={<AlertCircle className="w-12 h-12 text-red-400 mx-auto" />}
                title="Error Loading Platforms"
                description={error}
                action={
                  <button
                    onClick={() => fetchFilteredPlatforms()}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                    Try Again
                  </button>
                }
              />
            ) : platforms.length === 0 ? (
              <EmptyState
                title={searchQuery ? 'No Results Found' : 'No Platforms Available'}
                description={
                  searchQuery
                    ? `We couldn't find any platforms matching "${searchQuery}"`
                    : 'Check back soon for new platforms and offers!'
                }
                action={
                  searchQuery && (
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedCategory('all');
                        setSearchParams({});
                      }}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    >
                      Clear Search
                    </button>
                  )
                }
              />
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {platforms.map((platform) => (
                  <Link
                    key={platform.id}
                    to={`/platform/${platform.id}`}
                    className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <img
                        src={platform.logo}
                        alt={platform.name}
                        className="w-16 h-16 rounded-lg"
                      />
                      <div>
                        <h3 className="font-semibold text-lg">{platform.name}</h3>
                        <p className="text-indigo-600 font-medium">{platform.deal}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-4">
                      <img
                        src={platform.topUser.avatar}
                        alt={platform.topUser.name}
                        className="w-6 h-6 rounded-full"
                      />
                      <span className="text-sm text-gray-600">{platform.topUser.name}</span>
                      <div className="flex items-center gap-1 ml-auto">
                        <Award className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm font-medium">{platform.topUser.score}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchPage;