import React, { useState } from 'react';
import { Search as SearchIcon, Filter, Award } from 'lucide-react';

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

export function SearchPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPlatforms = platforms.filter((platform) => {
    const matchesCategory = selectedCategory === 'all' || platform.category === selectedCategory;
    const matchesSearch = platform.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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
              onChange={(e) => setSearchQuery(e.target.value)}
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
                    onClick={() => setSelectedCategory(category.id)}
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
            <div className="grid md:grid-cols-2 gap-6">
              {filteredPlatforms.map((platform) => (
                <a
                  key={platform.id}
                  href={`/platform/${platform.id}`}
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
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <img
                        src={platform.topUser.avatar}
                        alt={platform.topUser.name}
                        className="w-6 h-6 rounded-full"
                      />
                      <span>{platform.topUser.name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Award className="w-4 h-4 text-indigo-600" />
                      <span>{platform.topUser.score}</span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}